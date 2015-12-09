require.config({
    //baseUrl: "../dist/js",
    urlArgs: 'v1.0', // 版本号
    paths: {
        'underscore': '../lib/underscore-min',
        'backbone': '../lib/backbone-min',
        'localStorage': '../lib/backbone.localStorage',
        'angular-animate': '../lib/angular-animate.min',
        'jquery': '../lib/jquery.min',
        'lightbox': '../lib/jquery.lightbox-0.5.min',
        'jqueryUI': '../lib/jquery-ui.min'
    },
    //这个配置是你在引入依赖的时候的包名
    shim: {
        jquery: {
            exports: "$"
        },
        jqueryUI: {
            deps: ['jquery']
        },
        lightbox: {
            deps: ['jquery']
        },
        "underscore": {
            exports: "_"
        }
    }
});