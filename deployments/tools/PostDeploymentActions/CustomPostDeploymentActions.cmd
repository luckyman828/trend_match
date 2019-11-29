:: 1. Post Deployment Custom scripts
echo Running custom post deployment scripts
:: echo generate key
:: call php artisan key:generate 
echo Resetting the configuration cache
call php artisan config:cache
echo route cache
call php artisan route:cache
echo Building the app (npm run prod)
call npm run production
echo Done, running custom post deployment!