<?php

namespace App\Http\Controllers\Auth;

use App\Constants\AppConstant;
use App\Http\Controllers\Controller;
use App\Http\Controllers\MailController;
use App\Http\Requests\UserRegistrationRequest;
use App\Models\User;
use App\Services\NotificationService;
use App\Trait\Utils;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    use Utils;
     /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        try {
            // return $request;
            $request->validate([
                'username' => 'required|string',
                'password' => 'required|string',
            ]);
            
            $credentials = $request->only('password', 'username');
            // return $credentials;

            // if (filter_var($request->username, FILTER_VALIDATE_EMAIL)) {
            //     $credentials['email'] = $request->username;
            // }else if (preg_match('/^[0-9]{10}$/', $request->username)) {
            //     $credentials['phone_number'] = $request->username;
            // }else {
            //     return $this->resp('Error', 409, 'Invalid username or password!', null);
            // }

            if ($request->has('remember_me') && $request->remember_me == true) {
                $token = Auth::attempt($credentials, true);
            }else{
                $token = Auth::attempt($credentials);
            }
        //    return $token;
            if (!$token) {
                return $this->resp('Error', 401, 'Unauthorized', null);
            }
            $user = Auth::user();
            
            if ($user->is_verified == 0) {
                Auth::logout();
                return $this->resp('Error', 409, 'User is not yet verified!', null);
            }
            
            $auth_user = [
                'user' => $user,
                'app_name' => config('app.name'),
                'authorization' => [
                    'token' => $token,
                    'type' => 'bearer',
                    'token_expires' => config('jwt.ttl') * 60,
                ],
            ];
        
            return $this->resp('Success', 200, 'Login Successful', $auth_user);
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
        
    }

    /**
     * Register a User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function register(Request $request)
    {
        // return $request;
        try {
            $data = [
                'name' => $request->name,
                'username' => $request->username,
                'profile_photo' => $request->profile_photo,
                'password' => $request->password,
            ];
            $rules = [
                'name' => 'required|string|max:255',
                'username' => 'required|string|unique:users,username',
                'profile_photo' => 'nullable|string',
                'password' => 'required|string|min:6',
            ];
            

            $validator = Validator::make($data, $rules);
            if ($validator->fails()) {
                return $this->resp('Error', 409, 'Check your inputs and try again', $validator->errors());
            }

            // $provider = (int) request('provider');
            
            $code = $this->generateVerificationCode($request->username);
            // dd($code);
            $user = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'verification_code' => $code,
                'profile_photo' => $request->profile_photo,
                'verification_code_expires_at' => Carbon::now()->addMinutes(30),
                'password' => Hash::make($request->password),
            ]);

           

            if (! empty($request->username) && filter_var($request->username, FILTER_VALIDATE_EMAIL)) {
                $mail_otp = new MailController();
                $mail_otp->send_notification(['ref' => $user->username, 'otp' => $user->verification_code, 'is_invite' => false]);
            } elseif (preg_match("/^\+\d+$/", $request->username)) {
                $send_otp = new NotificationService();
                $send_otp->send_verification_code($user);
            }
            else {
                $user->delete();
                return $this->resp('Error', 409, 'Username should either be a valid phone number or email', null);
            }

            // $table->string('name');
            // $table->string('email')->unique();
            // $table->string('phone_number', 20)->unique();
            // $table->string('verification_code', 10)->unique();
            // $table->boolean('is_verified')->default(false);
            // $table->string('profile_photo')->nullable();
            // $table->timestamp('verification_code_expires_at');
            // $table->timestamp('email_verified_at')->nullable();
            // $table->timestamp('phone_verified_at')->nullable();
            // $table->string('password');
            // $table->string('profile_visibility')->default('Everyone');
            // $table->string('status_visibility')->default('Everyone');
            // $table->string('groups_visibility')->default('Everyone');
            // $table->boolean('read_receipt')->default(1);
            // $table->boolean('security_notification')->default(0);
            // $table->string('language')->default('en'
            // $this->createOrUpdateSettings($user->id, 0, 0, 0, null); //create default settings (by default the user can view items in all location both new and used. The user can decide to cahnge this settings)
          
           if($user){
               return $this->resp('Success', 201, "User created successfully and OTP sent to ". $user->name ."'s contact", $user);
            }else{
               return $this->resp('Error', 500, 'SMS Notification Engine Failed. Please try again later or contact '. env('APP_NAME') .' Team', $user);
           }
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
    }

    public function resend_otp($id)
    {
        try {
            $user = User::find($id);
            if(!$user){
                return $this->resp('Error', 404, 'User not found! Signup instead!', null);
            }
            $new_code = $this->generateVerificationCode($user->phone_number ?? $user->email);
           
            $user->verification_code = $new_code;
            $user->verification_code_expires_at = Carbon::now()->addMinutes(30);
            
            if ($user->save()) {
                $sms = new NotificationService();
                if($sms->send_verification_code($user) === true){
                    return $this->resp('Success', 200, 'Code successfully resent to '. $user->name, $user);
                }else{
                    return $this->resp('Error', 500, 'Notification Engine Failed. Please try again later or contact '. env('APP_NAME') .' Team', $user);
                }
            }

        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
    }


    public function verify_code(Request $request)
    {
        try {
            // return $request;
            $data = [
                'otp' => $request->otp,
                'ref' => $request->ref,
            ];
            $rules = [
                'otp' => 'required|string|min:6|max:6',
                'ref' => 'required|string',
            ];
            

            $validator = Validator::make($data, $rules);
            if ($validator->fails()) {
                return $this->resp('Error', 409, 'Invalid verification link', $validator->errors());
            }

           $code = $request->otp;
           $ref = Crypt::decrypt($request->ref);
            $user = User::where('username', $ref)->where('verification_code', $code)->first();
            
            if(!$user){
                return $this->resp('Error', 404, 'User not found! Signup instead!', null);
            }
            if ($user->verification_code == $code) {
                //check if code has expired
                $expires_at = Carbon::parse($user->verification_code_expires_at);
                $verified_at = Carbon::parse(Carbon::now());

                if($verified_at->greaterThan($expires_at)){
                    return $this->resp('Error', 409, 'Oops! The code has expired! Click on Resend code for a new verification code', null);
                }
                
                $user->is_verified = AppConstant::IS_VERIFIED_USER;
                $user->user_verified_at = Carbon::now();
                if($user->save()){
                    return $this->resp('Success', 200, 'Successfully verified! Login to proceed', null);
                }
                return $this->resp('Error', 500, 'Verification failed!', null);
            }
            return $this->resp('Error', 404, 'Verification code mismatched!', null);
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
    }

    public function update_phone_number(Request $request, $id)
    {
        try {
            $data = [
                'phone_number' => $request->phone_number,
            ];
            $rules = [
                'phone_number' => 'required|string|unique:users,phone_number',
            ];

            $validator = Validator::make($data, $rules);
            if ($validator->fails()) {
                return $this->resp('Error', 409, 'Check your inputs and try again', $validator->errors());
            }

            $user = User::find($id);

            if(!$user){
                return $this->resp('Error', 404, 'User not found! Signup instead!', null);
            }

            $new_code = $this->generateVerificationCode($user->phone_number ?? $user->email);
           
            $user->verification_code = $new_code;
            $user->verification_code_expires_at = Carbon::now()->addMinutes(30);
            $user->phone_number = $request->phone_number;
            $user->is_verified = 0;

            if($user->save()){
                $user->refresh();
                $sms = new NotificationService();
                if($sms->send_verification_code($user) === true){
                    return $this->resp('Success', 200, 'Code successfully resent to '. $user->name, $user);
                }else{
                    return $this->resp('Error', 500, 'Notification Engine Failed. Please try again later or contact '. env('APP_NAME') .' Team', $user);
                }
                return $this->resp('Success', 200, 'Phone number successfully changed', null);
            }
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
    }

    public function update_user_info(Request $request, $id)
    {
        try {
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'profile_photo' => $request->profile_photo,
                'password' => $request->password,
            ];
            $rules = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|unique:users,email',
                'phone_number' => 'required|string|unique:users,phone_number',
                'profile_photo' => 'nullable|string',
                'password' => 'required|string|min:6',
            ];

            $validator = Validator::make($data, $rules);
            if ($validator->fails()) {
                return $this->resp('Error', 409, 'Check your inputs and try again', $validator->errors());
            }

            $user = User::with(['item.order'])->find($id);
            if(!$user){
                return $this->resp('Error', 404, 'User not found! Signup instead!', null);
            }
            return $this->deleteMediaFile($user->profile_photo);
            // $items = $user->item;
            // $has_order = 0;
            // $pending_order = 0;
            // foreach ($items as $item) {
            //     // Check if the item has an associated order
            //     if ($item->order) {
            //         $has_order = 1;
            //         if($item->order->state == AppConstant::ORDER_PENDING){
            //             $pending_order = 1;
            //         }
            //     }
            // }
            // if ($has_order == 1 ||  $pending_order == 1) {
            //     if ($request->has('otp') && ! empty($request->otp)) {
            //         $otp = $request->otp;
            //     }
            //     return $this->resp('Error', 400, 'User not found! Signup instead!', null);
            // }
            $user->name = $request->name;
            $user->email = $request->email;
            $message = 'Update successful';
            if ($request->filled('phone_number')) {
                $user->phone_number = $request->phone_number;
                $user->is_verified = 0;
                $message = "Seems like you updated your phone number. All your items are currently not visible to buyers until the new phone number is verified.";
            }

            if ($request->filled('profile_photo')) {
                $user->profile_photo = $request->profile_photo;
            }

            if($user->save()){
                return $this->resp('Success', 200, $message, null);
            }
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, $th->getMessage(), null);
        }
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::logout();
        return $this->resp('Success', 200, 'Successfully logged out', null);
    }

     /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        $user = Auth::user();
        $auth_user = [
            'user' => $user,
            'authorization' => [
                'token' => Auth::refresh(),
                'type' => 'bearer',
            ],
        ];
        return $this->resp('Success', 200, 'Token Successfully Refreshed', $auth_user);
    }

    public function deleteUser($id)
    {
        $user = User::find($id);
        if (! $user) {
            return $this->resp('Error', 404, 'Account not found!', null);
        }
        $user->delete();

        return $this->resp('Success', 200, 'User account deleted successfully', null);
    }
}
