<?php

namespace App\Services;

use App\Http\Controllers\MailController;
use App\Http\Resources\UserResource;
use App\Models\Contact;
use App\Models\User;
use App\Trait\Utils;
use Carbon\Carbon;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ContactInvite
{
    use Utils;
    public function inviteContact($request)
    {
        try {
            $data= [
                'contact' => $request['contact']
            ];
    
            $rules = [
                'contact' => 'required|string',
            ];
    
            $validator = Validator::make($data, $rules);
           
    
            if ($validator->fails()) {
                return $this->resp('Error', 409, 'Input error. Check your inputs and try again', null); 
            }
            
            $contact_list = explode(',', Str::replace(' ', '', trim($request->contact)));
            // Retrieve existing contacts.
            $existing_contacts = User::select('username')->whereIn('username', $contact_list)->pluck('username')->toArray();
    
            // Find new contacts.
            $new_contacts = array_diff($contact_list, $existing_contacts);
    
            // Prepare data for upsert.
            $upsert_data = [];
            foreach ($new_contacts as $username) {
                // $user_pass = Str::random(6);
                $verification_code = $this->generateVerificationCode($username);
                $verification_code_expires_at = Carbon::now()->addDays(14);
                $upsert_data[] = [
                    'username' => $username,
                    'name' => $username,
                    'verification_code' => $verification_code,
                    'verification_code_expires_at' => $verification_code_expires_at,
                    'password' => Hash::make('Password'),
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ];
            }
            // Upsert new contacts into the user table.
            if (!empty($upsert_data)) {
                DB::table('users')->upsert($upsert_data, ['username']);
            }
    
            // Retrieve the IDs of both existing and new entries.
            $contacts = User::whereIn('username', $contact_list)->get();
            $my_contacts = [];
            foreach ($contacts as $contact) {
                if (Auth::id() !== $contact->id) {
                    
                    $my_contacts[] = [
                        'inviter_id' => Auth::id(),
                        'invitee_id' => $contact->id,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
    
                    $message = $this->moreMessage($contact, 'Password');
                    if (! empty($contact->username) && filter_var($contact->username, FILTER_VALIDATE_EMAIL)) {
                        $mail_otp = new MailController();
                        $mail_otp->send_notification(['ref' => $contact->username, 'otp' => $message, 'is_invite' => true]);
                    } elseif (preg_match("/^\+\d+$/", $contact->username)) {
                        $send_otp = new NotificationService();
                        $send_otp->send_verification_code($contact, $message);
                    }
                }
    
    
            }
            if (!empty($my_contacts)) {
               $sent = DB::table('contacts')->upsert($my_contacts, ['inviter_id', 'invitee_id']);
            }
    
            if ($sent) {
                return $this->resp('Success', 201, 'Invites successfully sent', null); 
            }else{
                return $this->resp('Success', 200, 'It seems all selected contact are already in your contact list', null); 
            }
        } catch (\Throwable $th) {
            return $this->resp('Error', 500, 'An error occurred', $th->getMessage()); 
        }

    }

    private function moreMessage($user, $password): string
    {
        return  'Hey, ' . Auth::user()->name .' is inviting you to '. config('app.name'). 'Use '. $user->username .' and '. $password. ' as your username and password'. 'This link expires in 14 days. Once verified, try update your Username and Password. Click on the link to verify account ' .  config('app.frontendUrl').'/verify-account/code='. $user->verification_code.'&ref='. Crypt::encrypt($user->username);
    }

    public function getContacts()
    {
        $user_contacts = User::with(['contacts.user'])->find(Auth::id());
        if($user_contacts !== null){
            $user_contacts->contacts->load(['user' => function ($query) {
                $query->where('is_verified', 1);
            }]);
            $data = new UserResource($user_contacts);
            return $this->resp('Success', 200, 'Contacts successfully retrieved', $data); 
        }
        return $this->resp('Success', 200, 'Contacts successfully retrieved', $user_contacts); 
    }
}