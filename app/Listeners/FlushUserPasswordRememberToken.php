<?php

namespace App\Listeners;

use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

use App\Mail\PasswordResetEmail;
use Illuminate\Auth\Events\PasswordReset;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class FlushUserPasswordRememberToken
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  object  $event
     * @return void
     */
    public function handle(PasswordReset $event)
    {
        $user = $event->user;

        // Also reset user password tokens at succesful reset
        $endpoint = "https://trendmatchb2b.dawady.com/hooks/updated-user-password";
        $client = new \GuzzleHttp\Client([
            'headers' => [
                'Content-Type' => 'application/json',
                'X-Kollekt-App-Key' => 'mnkAEefWBEL7cY1gEetlW4dM_YYL9Vu4K6dmavW2'
                ]
        ]);

        $response = $client->request('POST', $endpoint, ['json' => [
            'user_id' => $user->id, 
        ]]);


    }
}
