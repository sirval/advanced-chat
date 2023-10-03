<?php

namespace App\Services;

use App\Trait\Utils;
use GuzzleHttp\Client as GuzzleHttpClient;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Http;
use Twilio\Rest\Client;
use SendChamp;

class NotificationService
{
    use Utils;

    protected function message($user, $more_message)
    {
        if ($more_message !== null) {
            return  $more_message;
        }
        return 'Welcome to ' . config('app.name') . '. Click on the link to verify account ' .  config('app.frontendUrl').'/verify-account/code='. $user->verification_code.'&ref='. Crypt::encrypt($user->email);
    }

    protected function sendchamp($user, $more_message)
    {
       
        $publicKey = config('sendchamp.publicKey');
        $baseUrl = config('sendchamp.publicUrl');

        $body = [
            'message' => $this->message($user, $more_message),
            'sender_name' => 'Sendchamp',
            'route' => 'dnd',
            'to' => [$user->phone_number],
            'mode' => 'live'
        ];

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$publicKey}",
            'accept' => 'application/json',
            'content-type' => 'application/json',
        ])->post($baseUrl.'/sms/send', $body);
        
        if ($response['code'] === 200) {
            return true;
        }else {
            $user->delete();
            return $this->resp('Error', 400, 'OTP was not sent. Try another mobile number or contact ' . env('APP_NAME') . ' Team for support', $response['errors']);
        }
    }

    public function send_verification_code($user, $more_message = null)
    {
       return $this->sendchamp($user, $more_message);
        
    }
}
