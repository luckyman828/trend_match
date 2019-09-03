<!doctype html>
<html>
    <body>
    <h3>Hi {{ $data['user']['name'] }}, you have been invited to join the team, {{ $data['team']['title'] }} on Kollekt</h3>
        <p>{{ $data['sender']['name'] }} invited you to join their team.</p>
        <p>Click the link below to register your user</p>
        <a href="{{ route('register') }}?email={{ $data['user']['email'] }}&name={{ $data['user']['name'] }}">{{ route('register') }}</a>
    </body>
</html>

