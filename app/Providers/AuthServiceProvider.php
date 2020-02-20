<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Auth;
use App\Services\Auth\JwtGuard;

class AuthServiceProvider extends ServiceProvider
{
    // /**
    //  * Register any application authentication / authorization services.
    //  *
    //  * @return void
    //  */
    // public function boot()
    // {
    //     $this->registerPolicies();

    //     Auth::extend('jwt', function ($app, $name, array $config) {
    //         // Return an instance of Illuminate\Contracts\Auth\Guard...

    //         return new JwtGuard(Auth::createUserProvider($config['provider']));
    //     });
    // }

    // /**
    //  * The policy mappings for the application.
    //  *
    //  * @var array
    //  */
    // protected $policies = [
    //     'App\Model' => 'App\Policies\ModelPolicy',
    // ];



    /**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();

        // Passport::routes();

        // Passport::enableImplicitGrant();

        // Passport::$ignoreCsrfToken = true;

        // Auth::viaRequest('custom-auth', function (Request $request) {

        //     $user_id = $request->header('user_id');
        //     Log::info($user_id);

        //     $user = User::find($user_id);
        //     return $user;

        // });

        // Auth::extend('custom-auth', function ($app, $name, array $config) {
        // // AuthManager::viaRequest('custom-auth', function ($request) {
        //     // Any custom user-lookup logic here. For example:

        //     Log::info('From Login: Session:');
        //     // Log::info($app);
        //     Log::info(json_encode($app));
        //     // Log::info($config);
        //     // Log::info('From login: Request:');

        //     $user = User::first();
        //     return $user;


        //     // if ($request->header('x-session')) {
        //     //     $user = User::first();
        //     //     return $user;
        //     // }
        // });

    }
}
