var gulp = require('gulp');
var del = require('del')
var tsc = require('gulp-typescript');
var eventStream = require('event-stream');
var uglify = require('gulp-uglifyjs');

gulp.task('clean', function(done) {
    del('dist', done);
});

gulp.task('build', function() {
    var ts = gulp.src('src/logtank.ts')
        .pipe(tsc({
            declarationFiles: true,
            noExternalResolve: true
        }));

    return eventStream.merge(
        ts.dts.pipe(gulp.dest('dist')),
        ts.js.pipe(gulp.dest('dist'))
    );
});

gulp.task('minify', ['build'], function() {
    return gulp.src(['dist/*.js', '!dist/*.min.js'])
        .pipe(uglify('logtank.min.js', {
            outSourceMap: true
        }))
        .pipe(gulp.dest('dist'));
});

gulp.task('default', ['clean'], function() {
    gulp.start('minify');
})