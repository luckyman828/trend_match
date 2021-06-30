const mix = require('laravel-mix')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
const chunkFilename = process.env.NODE_ENV == 'production' ? 'js/[name].[hash].js' : 'js/[name].js'

mix.js('resources/js/app.js', 'public/js')
    .js('resources/js/public-scripts/play.js', 'public/js/public')
    .js('resources/js/public-scripts/play-dkc.js', 'public/js/public')
    .js('resources/js/public-scripts/play-shopify.js', 'public/js/public')
    .sass('resources/sass/app.scss', 'public/css')
    .copy('node_modules/@fortawesome/fontawesome-pro/webfonts', 'public/webfonts')
    .options({
        processCssUrls: false,
    })
    .webpackConfig({
        resolve: {
            alias: {
                '@': path.resolve('resources/sass'),
            },
        },
        plugins: [new CaseSensitivePathsPlugin()],
        output: {
            chunkFilename: chunkFilename,
        },
    })
    .version()
