const mix = require('laravel-mix')
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin')
const tailwindcss = require('tailwindcss')
const globalVars = require('./global.vars')
const playEmbedScriptPathFull = `public/${globalVars.play.embedScriptPath}/${globalVars.play.embedScriptVersion}`

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
    .js('resources/js/public-scripts/play.js', `${playEmbedScriptPathFull}/play.js`)
    .js('resources/js/public-scripts/play-dkc.js', `${playEmbedScriptPathFull}/dkc.js`)
    .js('resources/js/public-scripts/play-shopify.js', `${playEmbedScriptPathFull}/play-shopify.js`)
    .js('resources/js/public-scripts/play-ga.js', `${playEmbedScriptPathFull}/play-ga.js`)
    .sass('resources/sass/app.scss', 'public/css')
    .copy('node_modules/@fortawesome/fontawesome-pro/webfonts', 'public/webfonts')
    .options({
        processCssUrls: false,
        postCss: [tailwindcss('./tailwind.config.js')],
        // extractVueStyles: true,
        globalVueStyles: 'resources/sass/_variables.scss', // Import scss variables in every component implicitly
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
