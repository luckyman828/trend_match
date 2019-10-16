<?php

namespace App\Providers;

use Illuminate\Support\Facades\Event;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use App\Listeners\FlushUserPasswordRememberToken;
use Illuminate\Auth\Events\PasswordReset;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event listener mappings for the application.
     *
     * @var array
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],
        PasswordReset::class => [
            FlushUserPasswordRememberToken::class,
        ],
        'App\Events\DynamicDataUpdated' => [
            'App\Listeners\BroadcastEvent',
        ],
        'App\Events\CommentUpdated' => [],
        'App\Events\CommentDeleted' => [],
        'App\Events\ActionUpdated' => [],
        'App\Events\ManyActionsCreated' => [],
        'App\Events\ManyActionsUpdated' => [],
        'App\Events\ActionDeleted' => [],
    ];

    /**
     * Register any events for your application.
     *
     * @return void
     */
    public function boot()
    {
        parent::boot();

        //
    }
}
