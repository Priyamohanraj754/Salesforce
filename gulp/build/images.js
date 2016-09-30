var gulp = require('gulp'),
    config = require('../../gulp.config'),
    imagemin = require('gulp-imagemin'),
    del = require('del');

gulp.task('clean:build:images', function() {
    return del(config.build + config.appImages);
});

gulp.task('build:images', ['clean:build:images'], function() {
    return gulp
        .src(config.src + config.appImages + '**/*')
        .pipe(imagemin())
        .pipe(gulp.dest(config.build + config.appImages));
});