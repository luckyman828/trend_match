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
                return "Succes: Send invite and created a new team_invite entry";
            }

        }
    }
}
