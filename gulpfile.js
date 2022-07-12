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

sass.compiler = require("sass");

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
    .pipe(sass().on("error", sass.logError))
    .pipe(cssnano({ autoprefixer: false, zindex: false }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/css"));
}

exports.processscss = processscss;

const minifyjs = (done) => {
  gulp
    .src(["dist/js/**/*.js", "!**/*min.js"])
    .pipe(uglify())
    .on("error", (err) => {
      util.log(util.colors.red("[Error]"), err.toString());
    })
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("dist/js"));
  done();
};

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

function processappjs(done) {
  const appRootFolder = "js/apps";
  const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
    return fs.statSync(path.join(appRootFolder, file)).isDirectory();
  });

  appFolders.forEach((folder) => {
    return gulp
      .src(eventPageAppFiles(folder), { read: false, allowEmpty: true })
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
      .pipe(gulp.dest(`dist/js/apps/${folder}`));
  });
  done();
}
exports.processappjs = processappjs;

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

function moveappdirectivetemplates(done) {
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

  done();
}

exports.moveappdirectivetemplates = moveappdirectivetemplates;

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
exports.createConstantsTemplate = createConstantsTemplate;
function processmasterjs() {
  return gulp
    .src([
      "dist/js/constants.js",
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

const movevendorjs = (done) => {
  gulp.src("js/vendor/**/*.js").pipe(gulp.dest("dist/js"));
  done();
};

const moveimages = (done) => {
  gulp.src("images/**/*").pipe(gulp.dest("dist/images"));
  done();
};

const movefonts = (done) => {
  gulp.src("fonts/**.*").pipe(gulp.dest("dist/fonts"));
  done();
};

const processpug = (done) => {
  gulp.src("mockups/pug/*.pug").pipe(pug()).pipe(gulp.dest("dist"));
  done();
};

const movehtml = (done) => {
  gulp.src("mockups/html/**/*.html").pipe(gulp.dest("dist"));
  done();
};

const codecoverage = (done) => {
  gulp.src("/coverage/**/lcov.info").pipe(coveralls());
  done();
};

function rewrite() {
  return gulp
    .src("rewrite.config", { read: false, allowEmpty: true })
    .pipe(rename("web.config"))
    .pipe(gulp.dest("dist"));
}

const movedata = (done) => {
  gulp.src("data/**/*").pipe(gulp.dest("dist/data"));
  done();
};

const watchPug = (done) =>
  gulp.watch("**/*.pug", gulp.series(processpug), done());
const watchHTML = (done) =>
  gulp.watch("**/*.html", gulp.series(movehtml), done());
const watchSCSS = (done) =>
  gulp.watch("**/*.scss", gulp.series(processscss), done());
const watchJS = (done) => gulp.watch("js/*.js", gulp.series(minifyjs), done());
const watchPageSpecific = (done) =>
  gulp.watch("js/page-specific/*.js", gulp.series(movepagespecificjs), done());
const watchUtility = (done) =>
  gulp.watch("js/utility/*.js", gulp.series(createConstantsTemplate), done());
const watchMasterJS = (done) =>
  gulp.watch("**/*.min.js", gulp.series(minifyjs), done());

const watch = gulp.parallel(
  watchPug,
  watchHTML,
  watchSCSS,
  watchJS,
  watchPageSpecific,
  watchUtility,
  watchMasterJS
);
watch.description = "watch for changes to all source";
exports.watch = watch;

const process = gulp.series(
  processhomepagejs,
  createfeaturedeventswidgetjs,
  processappjs,
  processmasterjs,
  processfeaturedeventswidgetjs,
  processscss,
  minifyjs
);
exports.process = process;

const copy = gulp.parallel(
  createConstantsTemplate,
  movehtml,
  moveappdirectivetemplates,
  movepagespecificjs,
  movevendorjs,
  moveimages,
  movefonts,
  rewrite,
  movedata,
  createfeaturedeventswidgetjs,
  codecoverage
);
exports.copy = copy;

const defaultTask = gulp.series(cleanfile, copy, process); //gulp.parallel(watch));

exports.default = defaultTask;
