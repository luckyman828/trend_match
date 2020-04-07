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
        <link rel="stylesheet" src="{{ asset('css/vue-styles.css') }}" />

    </head>
    <body>
        <div class="main-wrapper">
            
            <div id="app">
                <app></app>
                <portal-target name="modals" multiple></portal-target>
            </div>
        </div>

        <script src="{{ asset('js/app.js') }}"></script>
    </body>
</html>
