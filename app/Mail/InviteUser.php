<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class InviteUser extends Mailable
{
    use Queueable, SerializesModels;

    public $request;
    public $data;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('david@trendmatch.dk', 'Kollekt App')
                    // ->subject('You are invited to join the team, ' . $this->request->team['title'])
                    ->subject('You are invited to join a team')
                    ->view('emails.inviteUser')->with(['data', $this->data]);

    }
}
