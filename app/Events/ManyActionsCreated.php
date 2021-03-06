<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Queue\SerializesModels;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;

class ManyActionsCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $actions;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct($actions)
    {
        $this->actions = $actions;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    public function broadcastOn()
    {
        return new PrivateChannel('workspace.'.Cache::get('user_'.Auth::id().'_currentWorkspaceId'));
    }

    public function broadcastAs()
    {
        return 'actions.many.created';
    }
}
