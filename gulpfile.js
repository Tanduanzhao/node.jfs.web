var gulp = require('gulp'),
    less = require('gulp-less');
    minifycss = require('gulp-minify-css');

gulp.task('less', function () {
    gulp.src('less/index.less')
        .pipe(less())
        .pipe(minifycss())
        .pipe(gulp.dest('./public/stylesheets'));
});
gulp.task('watch', function () {
    gulp.watch('less/*.less', ['less']);
});
