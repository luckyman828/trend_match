<?php

namespace App\Http\Controllers;

use App\Mail\InviteUser;
use App\User;
use App\UserTeam;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class MailController extends Controller
{
    public function inviteUser(Request $request)
    {
        // INSTRUCTIONS:
        // First check if the invited e-mail already has a user
        // If the user exists, get the ID of the user
        // Then, add the user + team to the user_teams table
        // --- DONE UNTIL HERE ---

        // V1
        // If the invited e-mail does not exist
        // Send an invite email with a SIGNED LINK to the provided email
        // Guide: https://pineco.de/inviting-users-with-laravels-singed-urls/
        // Remember which team the invited user was invited to... somehow
        // When a user is registered via that link, get their created ID
        // Add that user_id + the saved team id to the user_teams table

        // V2
        // DB PREPRATION
        // Create a team_invites table
        // In this table, store user_email + team_id
        // If a user is created with the stored e_mail,
        // add them to the team and delete the record from the team_invites table
        // The above, should be added to the Auth RegisterController

        // HANDLING REQUEST
        // If the invited e-mail does not exist
        // Send e-mail with register link to user
        // Create a record in the team_invites table for the team_id and user_email



        // PUTTING IN THE WORK:
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
                return "Succes: Saved new user";
            }

            
        } else {
            Mail::to($request->user['email'])->send(new InviteUser($request));
        }
    }
}
