const babel = require("gulp-babel");
const clean = require("gulp-clean");
const concat = require("gulp-concat");
const coveralls = require("gulp-coveralls");
const cssnano = require("gulp-cssnano");
const download = require("gulp-download");
const fs = require("fs");
const gulp = require("gulp");
const jshint = require("gulp-jshint");
const order = require("gulp-order");
const path = require("path");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const runSequence = require("run-sequence");
const sass = require("gulp-sass")(require("sass"));
const stripCode = require("gulp-strip-code");
const stylish = require("jshint-stylish");
const uglify = require("gulp-uglify");
const util = require("gulp-util");
const eventPageAppFiles = require("./gulp-tasks/events-page-app.files");
const featuredEventsFiles = require("./gulp-tasks/featured-events.files");

function cleanfile() {
  return gulp.src("dist", { read: false, allowEmpty: true }).pipe(clean());
}

function processscss() {
  return gulp
    .src([
      "stylesheets/master.scss",
      "stylesheets/master-high-contrast.scss",
      "stylesheets/home.scss",
      "stylesheets/master-print.scss",
      "stylesheets/ie.scss",
    ])
    .pipe(sass())
    .pipe(cssnano({ autoprefixer: false, zindex: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
}

function minifyjs() {
  return gulp
    .src(["dist/js/**/*.js", "!**/*min.js"])
    .pipe(uglify())
    .on("error", (err) => {
      util.log(util.colors.red("[Error]"), err.toString());
    })
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
}

function createfeaturedeventswidgetjs() {
  const targetFiles = [
    "dist/js/angular/angular.min.js",
    "dist/js/angular/angular-aria.min.js",
    "dist/js/moment/*.js",
    "dist/js/apps/events-page/featuredEventsWidgetApp.min.js",
  ];
  return gulp
    .src(targetFiles, { read: false, allowEmpty: true })
    .pipe(
      order(
        [
          "dist/js/moment/*.js",
          "dist/js/angular/angular.min.js",
          "dist/js/apps/events-page/featuredEventsWidgetApp.min.js",
        ],
        { base: "./" }
      )
    )
    .pipe(concat("featured-events-widget.min.js"))
    .pipe(gulp.dest("dist/js/featured-events-widget"));
}

function processappjs() {
  const appRootFolder = "js/apps";
  const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
    return fs.statSync(path.join(appRootFolder, file)).isDirectory();
  });

  appFolders.forEach((folder) => {
    return gulp
      .src(eventPageAppFiles(folder))
      .pipe(
        jshint({
          esversion: 6,
        })
      )
      .pipe(jshint.reporter(stylish))
      .pipe(
        babel({
          presets: ["es2015"],
        })
      )
      .pipe(
        stripCode({
          start_comment: "test-code",
          end_comment: "end-test-code",
        })
      )
      .pipe(concat("app.js"))
      .pipe(
        gulp.dest(`dist/js/apps/${folder}`, { read: false, allowEmpty: true })
      );
  });
}

function processfeaturedeventswidgetjs() {
  return gulp
    .src(featuredEventsFiles)
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(
      stripCode({
        start_comment: "test-code",
        end_comment: "end-test-code",
      })
    )
    .pipe(concat("featuredEventsWidgetApp.js"))
    .pipe(gulp.dest("dist/js/apps/events-page"));
}

function moveappdirectivetemplates() {
  const appRootFolder = "js/apps";
  const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
    return fs.statSync(path.join(appRootFolder, file)).isDirectory();
  });

  appFolders.forEach((folder) => {
    gulp
      .src(`js/apps/${folder}/directives/templates/*.html`)
      .pipe(gulp.dest(`dist/js/apps/${folder}/templates`));
    gulp
      .src(`js/apps/${folder}/partials/*.html`)
      .pipe(gulp.dest(`dist/js/apps/${folder}/partials`));
  });
}

function createConstantsTemplate() {
  return gulp
    .src(["js/utility/namespacer.js", "js/constants.js"])
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(concat("constants.js"))
    .pipe(gulp.dest("dist/js"));
}

function processmasterjs() {
  return gulp
    .src([
      "js/utility/*.js",
      "js/**/*.js",
      "!js/vendor/**/*.js",
      "!js/pagespecific/**/*.js",
      "!js/apps/**/*",
      "!js/constants.js",
    ])
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(
      stripCode({
        start_comment: "test-code",
        end_comment: "end-test-code",
      })
    )
    .pipe(concat("master.js"))
    .pipe(gulp.dest("dist/js"));
}
exports.processmasterjs = processmasterjs;

function processhomepagejs() {
  return gulp
    .src("js/page-specific/homepage/*.js")
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(
      stripCode({
        start_comment: "test-code",
        end_comment: "end-test-code",
      })
    )
    .pipe(concat("homepage.js"))
    .pipe(gulp.dest("dist/js"));
}

function movepagespecificjs() {
  return gulp
    .src("js/page-specific/**/*.js")
    .pipe(
      jshint({
        esversion: 6,
      })
    )
    .pipe(jshint.reporter(stylish))
    .pipe(
      babel({
        presets: ["es2015"],
      })
    )
    .pipe(gulp.dest("dist/js/page-specific"));
}

function movevendorjs() {
  return gulp.src("js/vendor/**/*.js").pipe(gulp.dest("dist/js"));
}

function moveimages() {
  return gulp.src("images/**/*").pipe(gulp.dest("dist/images"));
}

function movefonts() {
  return gulp.src("fonts/**.*").pipe(gulp.dest("dist/fonts"));
}

function processpug() {
  return gulp.src("mockups/pug/*.pug").pipe(pug()).pipe(gulp.dest("dist"));
}

function movehtml() {
  return gulp.src("mockups/html/**/*.html").pipe(gulp.dest("dist"));
}

function codecoverage() {
  return gulp.src("/coverage/**/lcov.info").pipe(coveralls());
}

function rewrite() {
  return gulp
    .src("rewrite.config", { read: false, allowEmpty: true })
    .pipe(rename("web.config"))
    .pipe(gulp.dest("dist"));
}

function movedata() {
  return gulp.src("data/**/*").pipe(gulp.dest("dist/data"));
}

const watchPug = () => gulp.watch("**/*.pug", gulp.series(processpug));
const watchHTML = () => gulp.watch("**/*.html", gulp.series(movehtml));
const watchSCSS = () => gulp.watch("**/*.scss", gulp.series(processscss));
const watchJS = () => gulp.watch("js/*.js", gulp.series(minifyjs));
const watchPageSpecific = () =>
  gulp.watch("js/page-specific/*.js", gulp.series(movepagespecificjs));
const watchUtility = () => gulp.watch("js/utility/*.js", gulp.series(util));
const watchMasterJS = () =>
  gulp.watch("**/*.min.js", gulp.series(moveappdirectivetemplates));

const defaultTask = gulp.series(
  cleanfile,
  gulp.parallel(
    processmasterjs,
    processhomepagejs,
    //processappjs,
    movepagespecificjs,
    createConstantsTemplate,
    processfeaturedeventswidgetjs
  ),
  gulp.parallel(
    movehtml,
    processscss,
    minifyjs,
    moveappdirectivetemplates,
    movevendorjs,
    moveimages,
    movefonts,
    rewrite,
    movedata,
    createfeaturedeventswidgetjs,
    codecoverage
  ),
  gulp.parallel(
    watchPug,
    watchHTML,
    watchSCSS,
    watchJS,
    watchPageSpecific,
    watchUtility,
    watchMasterJS
  )
);

exports.default = defaultTask;
