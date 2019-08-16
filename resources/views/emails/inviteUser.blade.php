<!doctype html>
<html>
    <body>
    {{-- <h2>Hej {{$user->name}}, Du er blevet inviteret til {{$team->name}}/h2> --}}
    <h3>Hi {{$request->user['name']}}, you have been invited to join the team, {{$request->team['title']}} on Kollekt</h3>
        <p>{{$request->sender['name']}} invited you to join their team.</p>
        <p>Click the link below to register your user</p>
        <a href="{{ route('register') }}?email={{$request->user['email']}}&name={{$request->user['name']}}">{{ route('register') }}</a>
    </body>
</html>

