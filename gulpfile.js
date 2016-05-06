var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var browserify = require('browserify');
var watchify = require('watchify');
var babel = require('babelify');
var less = require('gulp-less');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var reload      = browserSync.reload;

gulp.task('build-less', function(){
    return gulp.src('client/less/index.less')
        .pipe(less())
        .pipe(rename('roundup-dashboard.css'))
        .pipe(gulp.dest('./public/stylesheets'));
});

gulp.task('build-js', function(){
    return browserify('./client/js/index.js',
        {
            debug: true,
            paths: ['./node_modules','./client/js']
        })
        .transform(babel, {presets: ["es2015", "react"]})
        .bundle()
        .on('error', function(err) { console.error(err); this.emit('end'); })
        .pipe(source('build.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({ loadMaps: true }))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest('./build'))
        .pipe(gulp.dest('./public/javascripts'))

});

gulp.task('watch', function(){
    gulp.watch('./client/less/*.less', ['build-less']);
    gulp.watch('./client/**/*.js', ['build-js']);
});

gulp.task('reload-js-watch', ['build-js'], browserSync.reload);

gulp.task('default', ['build-less','build-js', 'watch']);`