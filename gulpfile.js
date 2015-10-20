"use strict";

let gulp = require('gulp'),
    path = require('path'),
    gutil = require('gulp-util'),
    rename = require('gulp-rename'),
    gulpJSDoc2MD = require('gulp-jsdoc-to-markdown');

gulp.task('docs', function() {
    return gulp.src('index.js')
        .pipe(gulpJSDoc2MD())
        .on('error', function(err) {
            gutil.log(gutil.colors.red('documentation generation failed'), err.message);
        })
        .pipe(rename(function(path) {
            path.basename = 'README';
            path.extname = '.md';
        }))
        .pipe(gulp.dest('.'));
});

gulp.task('watch', function() {
    gulp.watch('index.js', ['docs']);
});

gulp.task('default', ['docs']);