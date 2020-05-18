<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <script>window.Laravel = { csrfToken: '{{ csrf_token() }}' }</script>
        <title>Kollekt</title>

        {{-- Favicon --}}
        <link rel="shortcut icon" href="/images/kollekt_logo_00_1024x1024@3x.png">

        <!-- Styles -->
        <link type="text/css" rel="stylesheet" href="{{ mix('css/app.css') }}">
        {{-- <link rel="stylesheet" src="{{ asset('css/vue-styles.css') }}" /> --}}

    </head>
    <body>
        <div class="main-wrapper">
            
            <div id="internet-explorer" style="display: none">
                <div class="ie-screen">
                    <div class="container">
                        <img class="logo" src="/images/kollekt-logo.svg">
                        <h1>Welcome to Kollekt</h1>
                        <h2>Uh oh! Old browser detected!</h2>
                        <img class="graphic" src="/images/undraw_back_in_the_day_knsh.svg">
                        <!-- <i class="xl far fa-sad-tear"></i> -->
                        <h3>Sorry, We don't support Internet Explorer</h3>
                        <p>We save lots of time not having to support Internet Explorer.</p>
                        <p>That means we can provide you an even better experience in a modern browser!</p>
                        <p class="cta"><strong>Please visit Kollekt from a modern web browser like Google Chrome.</strong></p>
                        <div class="buttons">
                            <a href="https://www.mozilla.org/en-US/firefox/new/" class="button primary ghost xl">
                                <span>Download Firefox</span>
                            </a>
                            <a href="https://www.google.com/chrome/" class="button primary xl">
                                <span>Download Chrome</span>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <div id="app">
                <app></app>
                <portal-target name="modals" multiple></portal-target>
            </div>
        </div>

        <style>
            .ie-screen .container {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 60px 0;
                margin: auto;
                max-width: 500px;
                text-align: center;
            }
            .ie-screen h2 {
                margin-bottom: 20px;
            }
            .ie-screen h3 {
                margin-top: 8px;
            }
            .ie-screen .logo {
                margin-bottom: 32px;
            }
            .ie-screen .graphic {
                height: 260px;
            }
            .ie-screen a {
                margin-top: 32px;
            }
            .ie-screen .cta {
                margin-top: 20px;
            }
            .ie-screen .buttons {
                display: flex;
            }
            .ie-screen .buttons > *:not(:first-child) {
                margin-left: 20px;
            }
        </style>
        <script>
            if (!!window.document.documentMode) {
                document.getElementById('internet-explorer').style.display = 'block'
                document.getElementById('app').style.display = 'none'
            } 
        </script>
        {{-- <script src="{{ asset('js/app.js') }}"></script> --}}
        <script src="{{ mix('js/app.js') }}"></script>
        <script src="/lib/signalr/signalr.js"></script>
    </body>
</html>
