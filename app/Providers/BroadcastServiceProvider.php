<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Broadcast;

class BroadcastServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Broadcast::routes();
        Broadcast::routes(['middleware' => ['auth:api']]);
        // Broadcast::routes(['middleware' => ['auth:broadcasting']]);
        // Broadcast::routes(['middleware' => ['auth:web']]);
        // Broadcast::routes(['client']);
        // Broadcast::routes(['middleware' => ['web', 'auth:api']]);

        require base_path('routes/channels.php');
    }
}
