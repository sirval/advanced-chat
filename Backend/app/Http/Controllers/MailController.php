<?php

namespace App\Http\Controllers;

use App\Jobs\OtpNotificationEmailJob;
use Illuminate\Http\Request;

class MailController extends Controller
{
    public function send_notification(array $data)
    {
        if ($data['is_invite'] === true) {
            dispatch(new OtpNotificationEmailJob($data))->delay(now()->addMinutes(10));
        }else{
            dispatch(new OtpNotificationEmailJob($data))->delay(now()->addMinutes(2));
        }
    }
}
