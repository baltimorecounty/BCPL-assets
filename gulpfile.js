const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const coveralls = require('gulp-coveralls');
const cssnano = require('gulp-cssnano');
const download = require('gulp-download');
const fs = require('fs');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const order = require('gulp-order');
const path = require('path');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const stripCode = require('gulp-strip-code');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
const util = require('gulp-util');
const featuredEventsFiles = require('./gulp-tasks/featured-events.files');

gulp.task('clean', () => gulp.src('dist')
	.pipe(clean()));

gulp.task('process-scss', () => gulp.src(['stylesheets/master.scss', 'stylesheets/home.scss'])
	.pipe(sass())
	.pipe(cssnano({ autoprefixer: false, zindex: false }))
	.pipe(rename({ suffix: '.min' }))
	.pipe(gulp.dest('dist/css')));

gulp.task('minify-js', [
		'process-master-js', 
		'process-homepage-js', 
		'process-app-js', 
		'move-page-specific-js', 
		'process-featured-events-widget-js'
	], () => {
	return gulp.src([
			'dist/js/**/*.js',
			'!**/*min.js'
		])
		.pipe(uglify())
		.on('error', (err) => { util.log(util.colors.red('[Error]'), err.toString()); })
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/js'));
});

gulp.task('create-featured-events-widget-js', () => {
	const targetFiles = [
		'dist/js/angular/angular.min.js',
		'dist/js/angular/*.js',
		'dist/js/moment/*.js',
		'dist/js/apps/events-page/featuredEventsWidget.min.js'
	];
	return gulp.src(targetFiles)
		.pipe(order([
			'dist/js/moment/*.js',
			'dist/js/angular/angular.min.js',
			'dist/js/angular/angular*.js',
			'dist/js/apps/events-page/featuredEventsWidget.min.js'
		], { base: './' }))
		.pipe(concat('featured-events-widget.min.js'))
		.pipe(gulp.dest('dist/js/featured-events-widget'));
});

gulp.task('process-app-js', () => {
	const appRootFolder = 'js/apps';
	const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
		return fs.statSync(path.join(appRootFolder, file)).isDirectory();
	});

	appFolders.forEach((folder) => {
		gulp.src([
			`js/apps/${folder}/app.js`,
			`js/apps/${folder}/constants.js`,
			`js/apps/${folder}/config.js`,
			`js/apps/${folder}/filters/**/*.js`,
			`js/apps/${folder}/dataServices/**/*.js`,
			`js/apps/${folder}/services/**/*.js`,
			`js/apps/${folder}/controllers/**/*.js`,
			`js/apps/${folder}/directives/**/*.js`
		])
			.pipe(jshint({
				esversion: 6
			}))
			.pipe(jshint.reporter(stylish))
			.pipe(babel({
				presets: ['es2015']
			}))
			.pipe(stripCode({
				start_comment: 'test-code',
				end_comment: 'end-test-code'
			}))
			.pipe(concat('app.js'))
			.pipe(gulp.dest(`dist/js/apps/${folder}`));
	});
});


gulp.task('process-featured-events-widget-js', () => {
	gulp.src(featuredEventsFiles)
		.pipe(jshint({
			esversion: 6
		}))
		.pipe(jshint.reporter(stylish))
		.pipe(babel({
			presets: ['es2015']
		}))
		.pipe(stripCode({
			start_comment: 'test-code',
			end_comment: 'end-test-code'
		}))
		.pipe(concat('featuredEventsWidget.js'))
		.pipe(gulp.dest('dist/js/apps/events-page'));
});

gulp.task('move-app-directive-templates', () => {
	const appRootFolder = 'js/apps';
	const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
		return fs.statSync(path.join(appRootFolder, file)).isDirectory();
	});

	appFolders.forEach((folder) => {
		gulp.src(`js/apps/${folder}/directives/templates/*.html`)
			.pipe(gulp.dest(`dist/js/apps/${folder}/templates`));
		gulp.src(`js/apps/${folder}/partials/*.html`)
			.pipe(gulp.dest(`dist/js/apps/${folder}/partials`));
	});
});


gulp.task('process-master-js', () => gulp.src([
	'js/utility/namespacer.js',
	'js/utility/*.js',
	'js/constants.js',
	'js/**/*.js',
	'!js/vendor/**/*.js',
	'!js/page-specific/**/*.js',
	'!js/apps/**/*'
])
	.pipe(jshint({
		esversion: 6
	}))
	.pipe(jshint.reporter(stylish))
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(stripCode({
		start_comment: 'test-code',
		end_comment: 'end-test-code'
	}))
	.pipe(concat('master.js'))
	.pipe(gulp.dest('dist/js')));

gulp.task('process-homepage-js', () => gulp.src(['js/page-specific/homepage/*.js'])
	.pipe(jshint({
		esversion: 6
	}))
	.pipe(jshint.reporter(stylish))
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(stripCode({
		start_comment: 'test-code',
		end_comment: 'end-test-code'
	}))
	.pipe(concat('homepage.js'))
	.pipe(gulp.dest('dist/js')));

gulp.task('move-page-specific-js', () => gulp.src('js/page-specific/**/*.js')
	.pipe(jshint({
		esversion: 6
	}))
	.pipe(jshint.reporter(stylish))
	.pipe(babel({
		presets: ['es2015']
	}))
	.pipe(gulp.dest('dist/js/page-specific')));

gulp.task('move-vendor-js', () => {
	gulp.src('js/vendor/**/*.js')
		.pipe(gulp.dest('dist/js'));
});

gulp.task('move-images', () => gulp.src('images/**/*')
	.pipe(gulp.dest('dist/images')));

gulp.task('move-fonts', () => gulp.src('fonts/**.*')
	.pipe(gulp.dest('dist/fonts')));

gulp.task('process-pug', () => gulp.src(['mockups/pug/*.pug'])
	.pipe(pug())
	.pipe(gulp.dest('dist')));

gulp.task('move-html', () => gulp.src('mockups/html/**/*.html')
	.pipe(gulp.dest('dist')));

gulp.task('code-coverage', () => gulp.src('/coverage/**/lcov.info')
	.pipe(coveralls()));

gulp.task('rewrite', () => {
	gulp.src('rewrite.config')
		.pipe(rename('web.config'))
		.pipe(gulp.dest('dist'));
});

gulp.task('move-data', () => {
	gulp.src('data/**/*')
		.pipe(gulp.dest('dist/data'));
});

gulp.task('default', ['clean'], callback => runSequence([
	'move-html',
	'process-scss',
	'minify-js',
	'move-app-directive-templates',
	'move-vendor-js',
	'move-images',
	'move-fonts',
	'rewrite',
	'move-data'
], 'create-featured-events-widget-js', 'code-coverage', callback));

gulp.task('watcher', () => {
	gulp.watch('**/*.pug', ['default']);
	gulp.watch('**/*.html', ['default']);
	gulp.watch('**/*.scss', ['default']);
	gulp.watch('js/*.js', ['default']);
	gulp.watch('js/page-specific/*.js', ['default']);
	gulp.watch('js/utility/*.js', ['default']);
});
