<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Hash;


class JoinController extends Controller
{
    public function getLinkHash(Request $request, $selection_id)
    {
        $hash = base_convert($selection_id, 10, 36);
        return $hash;
    }

    public function readLinkHash(Request $request, $link_hash)
    {
        $selection_id = intval($link_hash, 36);
        return ['selection_id' => (string) $selection_id];
    }


    public function joinViaLink(Request $request)
    {
        $token = $request->captchaToken;
        $email = $request->email;
        $selectionId = $request->selectionId;

        $captchaVerifyBody = [
            'secret' => \Config::get('app.captcha_secret'),
            'response' => $token,
        ];
        
        // Send reqeust to API
        $client = new Client();
        $response = $client->request('POST', 'https://www.google.com/recaptcha/api/siteverify', [
            'form_params' => $captchaVerifyBody
        ]);

        // Cast reponse body to JSON string
        $contents = (string) $response->getBody();
        // Cast JSON string to object
        $responseObject = json_decode($contents);
        $catpchaSuccess = $responseObject->success;
        // Return false if the captcha was invalid
        if (!$catpchaSuccess) {
            throw new \Exception('Captcha failed');
        }

        // Send request to the Kollekt API to let the user join
        $apiBaseUrl = \Config::get('app.api_base_url');
        $apiToken = \Config::get('app.api_token');
        $joinSelectionBody =  [
            'email' => $email,
            'selection_id' => $selectionId,
        ];

        $joinClient = new Client();
        try {
            // $joinResponse = $joinClient->request('POST', $apiBaseUrl . '/public-internal/join-selection', [
            $joinResponse = $joinClient->request('POST', 'http://kollekt-api-prod.kollekt-prod:16969/internal/join-selection', [
                \GuzzleHttp\RequestOptions::JSON => $joinSelectionBody,
                'headers' => ['X-Auth-Token' => $apiToken]
            ]);
            // // $joinResponse = $joinClient->request('POST', $apiBaseUrl . '/public-internal/join-selection', [
            // //     'form_params' => $joinSelectionBody,
            // //     'headers' => ['Auth-Token' => $apiToken]
            // // ]);
            // return 'join response? ' . $joinResponse->getStatusCode();
        }
        // catch(\GuzzleHttp\Exception\ClientException $err) {
        catch(\GuzzleHttp\Exception\RequestException $e) {
            // throw new \Exception($e);
            return [
                // 'response' => \GuzzleHttp\Psr7\str($e->getResponse()),
                'request' => \GuzzleHttp\Psr7\str($e->getRequest()),
                
                // 'request' => json_encode($e->getRequest()),
                // 'response' => json_encode(\GuzzleHttp\Psr7\str($e->getResponse())),
                // 'request' => json_encode(\GuzzleHttp\Psr7\str($e->getRequest())),
        
            ];
        }

        // return 'response and status code: ' . $joinResponse->getStatusCode();

        // Send create user to API
        

        return $joinResponse->getBody();
    }

}
