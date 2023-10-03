<?php

namespace App\Jobs;

use App\Mail\OtpNotificationEmail;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Mail;

class OtpNotificationEmailJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $data;
    public $tries = 5;
    public $timeout = 20;
    /**
     * Create a new job instance.
     */
    public function  __construct($data)
    {
        $this->afterCommit();
        $this->data = $data;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $mail = new OtpNotificationEmail($this->data);
        Mail::to($this->data['ref'])
                ->bcc('ohukaiv@gmail.com')
                ->send($mail);
    }
}
