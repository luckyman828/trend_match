<?php

namespace App\Listeners;

use App\Events\DynamicDataUpdated;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class BroadcastEvent
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
     * @param  DynamicDataUpdated  $event
     * @return void
     */
    public function handle(DynamicDataUpdated $event)
    {
        //
    }
}
