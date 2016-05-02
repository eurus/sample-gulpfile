var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    clean = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer');

var tinylr;
var cssOutDir = 'public/css/out';
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
})
gulp.task('watch', function() {
    gulp.watch(scssPattern, ['styles']);
    gulp.watch(cssPattern, notifyLiveReload);
    gulp.watch(viewPattern, notifyLiveReload);
});
gulp.task('default', [
    'styles',
    'livereload',
    'watch'
]);
