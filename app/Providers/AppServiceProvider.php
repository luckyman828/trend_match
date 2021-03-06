<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Http\Resources\Json\Resource;
use Illuminate\Support\Facades\Log;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Resource::withoutWrapping();
        if(config('app.env') !== 'local') {
            \URL::forceScheme('https');
        }
        // $this->app['events']->listen(Authenticated::class, function ($e) {
        //     Log::info('Authenticated!');
        // });
    }
}
