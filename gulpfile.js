var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    sourcemaps = require("gulp-sourcemaps"),
    babel = require("gulp-babel"),
    concat = require("gulp-concat")
    autoprefixer = require('gulp-autoprefixer');

var tinylr;
var es6OutDir = 'dist/js/out';
var es6Pattern = 'public/js/**';
var cssOutDir = 'dist/css/out';
var cssPattern = 'public/css/**';
var viewPattern = 'views/**';
var scssPattern = 'sass/*.scss';

function notifyLiveReload(event) {
    var fileName = require('path').relative(__dirname, event.path);
    tinylr.changed({
        body: {
            files: [fileName]
        }
    });
}
gulp.task('livereload', function() {
    tinylr = require('tiny-lr')();
    tinylr.listen(35729);
});

gulp.task("es6", function () {
  return gulp.src(es6Pattern)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(concat("all.js"))
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest(es6OutDir));
});

gulp.task('styles', function() {
    gulp.src(scssPattern)
        .pipe(plumber())
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest(cssOutDir))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(clean({
            compatibility: 'ie8'
        }))
        .pipe(gulp.dest(cssOutDir))
});

gulp.task('watch', function() {
    gulp.watch(es6Pattern, ['es6']);
    gulp.watch(scssPattern, ['styles']);
    gulp.watch(cssOutDir, notifyLiveReload);
    gulp.watch(es6OutDir, notifyLiveReload);
    gulp.watch(viewPattern, notifyLiveReload);
});

gulp.task('default', [
    'styles',
    'livereload',
    'watch'
]);