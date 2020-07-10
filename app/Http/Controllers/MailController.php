<?php

namespace App\Http\Controllers;

use App\Mail\InviteUser;
use App\TeamInvite;
use App\User;
use App\UserTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function inviteUser(Request $request)
    {
        // First check if the invited e-mail already has a user
        $existingUser = User::where('email', $request->user['email'])->first();
        if ($existingUser) {
            // If the user exists
            // Check if the user is already a member of the team
            $alreadyMember = UserTeam::find(['user_id' => $existingUser->id, 'team_id' => $request->team['id']]);
            if ($alreadyMember) {
                // If the user already is a member of the team, throw an error
                return "ERR: The requested user is already a member of the requested team";
            } else {
                // If the user is not currently a member of the team - add the user to the team
                // Construct a new UserTeam model object
                $userTeam = new UserTeam;
                $userTeam->user_id = $existingUser->id;
                $userTeam->team_id = $request->team['id'];
                // Add the user to the team
                $userTeam->save();
                return "success: Saved new user";
            }

            
        } else {
            // If the user does not exist
            // Send an email invite to the user
            Mail::to($request->user['email'])->send(new InviteUser($request));

            // Create an entry in the team_invite table
            // Check if the email is already invited to this team
            $alreadyInvited = TeamInvite::find(['email' => $request->user['email'], 'team_id' => $request->team['id']]);
            if ($alreadyInvited) {
                // If the email has already been invited to this team, throw an error
                return "ERR: The provided email has already been invited to this team - a new invite email has been sent though";
            } else {
                // If the user is not currently a member of the team - add the user to the team
                // Construct a new TeamInvite model object
                $teamInvite = new TeamInvite;
                $teamInvite->email = $request->user['email'];
                $teamInvite->team_id = $request->team['id'];
                // Add the invite to the table
                $teamInvite->save();
                return "success: Send invite and created a new team_invite entry";
            }

        }
    }

    public function inviteUsers(Request $request)
    {
        $usersToAdd = [];
        $usersToInvite = [];
        
        $index = 0;
        foreach ($request->users as $user) {
            
            // First check if the invited e-mail already has a user
            $existingUser = User::where('email', $user['email'])->first();
            if ($existingUser) {
                // If the user exists
                // Check if the user is already a member of the team
                $alreadyMember = UserTeam::find(['user_id' => $existingUser->id, 'team_id' => $request->team['id']]);
                if (!$alreadyMember) {
                    // If the user is not currently a member of the team - add the user to the team
                    // Construct a new UserTeam model object
                    $userTeam = [
                        'user_id' => $existingUser->id,
                        'team_id' => $request->team['id'],
                        'permission_level' => $user['permission_level']
                    ];
                    // Add the user to the array of users to be invited
                    array_push($usersToAdd, $userTeam);
                }
            } else {
                // If the user does not exist

                // Create an entry in the team_invite table
                // Check if the email is already invited to this team
                $alreadyInvited = TeamInvite::find(['email' => $user['email'], 'team_id' => $request->team['id']]);
                if (!$alreadyInvited) {
                    // If the user is not already invited, invite the user
                    $teamInvite = [
                        'email' => $user['email'],
                        'team_id' => $request->team['id'],
                        'permission_level' => $user['permission_level']
                    ];
                    // Add the invite to the table
                    array_push($usersToInvite, $teamInvite);

                    // Construct a single user request object to be used in the email
                    $data = [
                        'user' => $user,
                        'team' => $request->team,
                        'sender' => $request->sender

                    ];

                    // Send an email invite to the user
                    Mail::to($user['email'])->send(new InviteUser($data));
                }

            }
            $index++;
        }
        UserTeam::insert($usersToAdd);
        TeamInvite::insert($usersToInvite);

        return 'success';
    }

    public function resendInvite(Request $request)
    {
        Mail::to($request->user['email'])->send(new InviteUser($request));
        return $request;
        // return "success: Resent invite!";
    }
}
