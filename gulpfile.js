const babel = require('gulp-babel');
const clean = require('gulp-clean');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const runSequence = require('run-sequence');
const sass = require('gulp-sass');
const stripCode = require('gulp-strip-code');
const stylish = require('jshint-stylish');
const uglify = require('gulp-uglify');
const util = require('gulp-util');

gulp.task('clean', () => gulp.src('dist')
		.pipe(clean()));

gulp.task('process-scss', () => gulp.src(['stylesheets/master.scss', 'stylesheets/home.scss'])
		.pipe(sass())
		.pipe(cssnano({ autoprefixer: false }))
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/css')));

gulp.task('minify-js', ['process-master-js', 'process-homepage-js', 'move-page-specific-js'], () => gulp.src(['dist/js/**/*.js'])
		.pipe(uglify())
		.on('error', (err) => { util.log(util.colors.red('[Error]'), err.toString()); })
		.pipe(rename({ suffix: '.min' }))
		.pipe(gulp.dest('dist/js')));

gulp.task('process-master-js', () => gulp.src(['js/utility/namespacer.js', 'js/utility/*.js', 'js/**/*.js', '!js/vendor/**/*.js', '!js/page-specific/**/*.js'])
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

gulp.task('move-html', () => gulp.src('mockups/html/*.html')
	.pipe(gulp.dest('dist')));

gulp.task('default', ['clean'], callback => runSequence(['move-html', 'process-scss', 'minify-js', 'move-vendor-js', 'move-images', 'move-fonts'], callback));

gulp.task('watcher', () => {
	gulp.watch('**/*.pug', ['default']);
	gulp.watch('**/*.html', ['default']);
	gulp.watch('**/*.scss', ['default']);
	gulp.watch('js/*.js', ['default']);
	gulp.watch('js/page-specific/*.js', ['default']);
	gulp.watch('js/utility/*.js', ['default']);
});
