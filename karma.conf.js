// Karma configuration
// Generated on Thu Sep 21 2017 15:02:11 GMT-0400 (Eastern Daylight Time)

/* eslint-disable */

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '.',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-jquery', 'jasmine'],
	
	browserNoActivityTimeout: 10000,

    // list of files / patterns to load in the browser
    files: [
		'node_modules/jquery/dist/jquery.min.js',
		'node_modules/angular/angular.min.js',
		'node_modules/angular-animate/angular-animate.min.js',
		'node_modules/angular-route/angular-route.min.js',
		'node_modules/angular-mocks/angular-mocks.js',
		'node_modules/angular-sanitize/angular-sanitize.min.js',
		'node_modules/handlebars/dist/handlebars.min.js',
		'node_modules/underscore/underscore-min.js',	
		'node_modules/moment/min/moment.min.js',	
		'js/vendor/slick/slick.min.js',
		{ pattern: 'dist/images/**/*.png', included: false, served: true, watched: false },
		{ pattern: 'data/**/*.json', included: false, served: true, watched: false },
		{ pattern: 'test/**/*.fixture.html', included: false, served: true, watched: false },
		'js/utility/namespacer.js',
		'js/utility/*.js',
		'js/constants.js',
		'js/page-specific/**/*.js',
		'js/apps/**/*.js',
		'js/*.js',
		{
			pattern: 'test/**/*.spec.js', watched: false, served: true, included: true
		}
		
	],
	
    // list of files to exclude
    exclude: [
		'js/apps/events-page/directives/featuredEvents.js',
		'js/apps/**/featuredEventsWidget.js',
    ],

    plugins: [
		'karma-mocha-reporter',
		'karma-jasmine',
		'karma-jasmine-jquery-2',
		'karma-firefox-launcher',
		'karma-coverage',
		'karma-coveralls'
	],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
		'js/*.js': ['coverage'],
		'js/apps/**/*.js': ['coverage'],
		'js/utility/*.js': ['coverage'],
		'js/page-specific/*.js': ['coverage']
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha', 'coverage', 'coveralls'],

	coverageReporter: {
		type : 'lcovonly',
		dir : 'coverage/'
	},

    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Firefox'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
