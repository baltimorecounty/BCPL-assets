const babel = require("gulp-babel");
const concat = require("gulp-concat");
const coveralls = require("gulp-coveralls");
const cssnano = require("gulp-cssnano");
const fs = require("fs");
const gulp = require("gulp");
const jshint = require("gulp-jshint");
const order = require("gulp-order");
const path = require("path");
const pug = require("gulp-pug");
const rename = require("gulp-rename");
const runSequence = require("gulp4-run-sequence");
const sass = require("gulp-sass")(require("sass"));
const stripCode = require("gulp-strip-code");
const stylish = require("jshint-stylish");
const uglify = require("gulp-uglify");
const util = require("gulp-util");
const eventPageAppFiles = require("./gulp-tasks/events-page-app.files");
const featuredEventsFiles = require("./gulp-tasks/featured-events.files");

gulp.task("clean", (done) => {
  del.sync("dist/*");
  done();
});

gulp.task("process-scss", () =>
  gulp
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
    .pipe(gulp.dest("dist/css"))
);

gulp.task("create-featured-events-widget-js", () => {
  const targetFiles = [
    "dist/js/angular/angular.min.js",
    "dist/js/angular/angular-aria.min.js",
    "dist/js/moment/*.js",
    "dist/js/apps/events-page/featuredEventsWidgetApp.min.js",
  ];
  return gulp
    .src(targetFiles, { allowEmpty: true })
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
});

gulp.task("process-featured-events-widget-js", async function () {
  () => {
    gulp
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
  };
});

gulp.task("process-app-js", async function () {
  () => {
    const appRootFolder = "js/apps";
    const appFolders = fs.readdirSync(appRootFolder).filter((file) => {
      return fs.statSync(path.join(appRootFolder, file)).isDirectory();
    });

    appFolders.forEach((folder) => {
      gulp
        .src(eventPageAppFiles(folder), { allowEmpty: true })
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
  };
});

gulp.task("move-app-directive-templates", async function () {
  () => {
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
  };
});

gulp.task("createConstantsTemplate", async function () {
  () => {
    gulp
      .src(["js/utility/namespacer.js", "js/constants.js"])
      .pipe(
        babel({
          presets: ["es2015"],
        })
      )
      .pipe(concat("constants.js"))
      .pipe(gulp.dest("dist/js"));
  };
});

gulp.task("process-master-js", () =>
  gulp
    .src([
      "js/utility/namespacer.js",
      "js/constants.js",
      "js/utility/*.js",
      "js/**/*.js",
      "!js/vendor/**/*.js",
      "!js/page-specific/**/*.js",
      "!js/apps/**/*",
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
    .pipe(gulp.dest("dist/js"))
);

gulp.task("process-homepage-js", () =>
  gulp
    .src(["js/page-specific/homepage/*.js"])
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
    .pipe(gulp.dest("dist/js"))
);

gulp.task("move-page-specific-js", () =>
  gulp
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
    .pipe(gulp.dest("dist/js/page-specific"))
);

gulp.task("move-vendor-js", async function () {
  () => {
    gulp.src("js/vendor/**/*.js").pipe(gulp.dest("dist/js"));
  };
});

gulp.task("move-images", () =>
  gulp.src("images/**/*").pipe(gulp.dest("dist/images"))
);

gulp.task("move-fonts", () =>
  gulp.src("fonts/**.*").pipe(gulp.dest("dist/fonts"))
);

gulp.task("process-pug", () =>
  gulp.src(["mockups/pug/*.pug"]).pipe(pug()).pipe(gulp.dest("dist"))
);

gulp.task("move-html", () =>
  gulp.src("mockups/html/**/*.html").pipe(gulp.dest("dist"))
);

gulp.task("code-coverage", () =>
  gulp.src("/coverage/**/lcov.info").pipe(coveralls())
);

gulp.task("rewrite", async function () {
  () => {
    gulp
      .src("rewrite.config", { allowEmpty: true })
      .pipe(rename("web.config"))
      .pipe(gulp.dest("dist"));
  };
});

gulp.task("move-data", async function () {
  () => {
    gulp.src("data/**/*").pipe(gulp.dest("dist/data"));
  };
});

gulp.task("minify-js", async function () {
  runSequence(
    [
      "createConstantsTemplate",
      "process-master-js",
      "process-homepage-js",
      "process-featured-events-widget-js",
      "process-app-js",
      "move-page-specific-js",
    ],
    () => {
      return gulp
        .src(["dist/js/**/*.js", "!**/*min.js"], { allowEmpty: true })
        .pipe(uglify())
        .on("error", (err) => {
          util.log(util.colors.red("[Error]"), err.toString());
        })
        .pipe(rename({ suffix: ".min" }))
        .pipe(gulp.dest("dist/js"));
    }
  );
});

gulp.task("default", async function () {
  runSequence([
    "move-vendor-js",
    "move-html",
    "process-scss",
    "create-featured-events-widget-js",
    "move-app-directive-templates",
    "move-images",
    "move-fonts",
    "rewrite",
    "move-data",
    "code-coverage",
    "minify-js",
  ]);
});

gulp.task("watcher", () => {
  gulp.watch("**/*.pug", ["default"]);
  gulp.watch("**/*.html", ["default"]);
  gulp.watch("**/*.scss", ["default"]);
  gulp.watch("js/*.js", ["default"]);
  gulp.watch("js/page-specific/*.js", ["default"]);
  gulp.watch("js/utility/*.js", ["default"]);
});
