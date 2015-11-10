'use strict';


var gulp = require('gulp'),
    rimraf = require('rimraf'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer');


/**
 * DEV:
 * ****
 */
gulp.task('less-clean', function() {
  rimraf.sync('./app.css');
});


gulp.task('less', ['less-clean'], function() {
  return gulp.src('./less/app.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename('app.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./'));
});

