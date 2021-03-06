<?php

namespace App\Http\Controllers\Auth;

use App\User;
use App\Http\Controllers\Controller;
use App\Team;
use App\TeamInvite;
use App\UserTeam;
use App\WorkspaceUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Foundation\Auth\RegistersUsers;

class RegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    protected $redirectTo = '/';

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('guest');
    }

    /**
     * Get a validator for an incoming registration request.
     *
     * @param  array  $data
     * @return \Illuminate\Contracts\Validation\Validator
     */
    protected function validator(array $data)
    {
        return Validator::make($data, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\User
     */
    protected function create(array $data)
    {
        // Create the user
        // Save a reference to the new user
        $newUser = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        // Find the teams that the user may have been invited to
        $teamInvites = TeamInvite::where('email', $newUser->email)->get();
        if ($teamInvites) {
            $permission_level_to_set = 1;
            $workspace_to_set = '';
            foreach( $teamInvites as $invite) {
                // Get the users permissionlevel
                if ($invite->permission_level > $permission_level_to_set) {
                    $permission_level_to_set = $invite->permission_level;
                }
                // Add the user to the teams they are invited to
                $user_team = new UserTeam;
                $user_team->user_id = $newUser->id;
                $user_team->team_id = $invite->team_id;
                // Save the new user teams
                $user_team->save();
                // Delete the invites
                $invite->delete();

            }
            // Add the user to the workspace they were invited to
            $team = Team::find($teamInvites[0]->team_id);
            $workspace_to_set = $team->workspace_id;
            $workspace_user = new WorkspaceUser;
            $workspace_user->workspace_id = $workspace_to_set;
            $workspace_user->user_id = $newUser->id;
            $workspace_user->permission_level = $permission_level_to_set;
            $workspace_user->save();
            
            // set the permission level for the new user
            $newUser->role_id = $permission_level_to_set;
            $newUser->save();
        }


        return $newUser;
    }
}
