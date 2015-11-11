'use strict';


var gulp = require('gulp'),
    rimraf = require('rimraf'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),

    fs = require('fs');


/**
 * DEV:
 * ****
 */
gulp.task('clean', function() {
  rimraf.sync('./app.css');
  rimraf.sync('./discover.html');
});


gulp.task('less', ['clean'], function() {
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

gulp.task('html', ['clean'], function(done) {
  var content = require('./content.json');

  fs.readFile('./app.html', function(err, data) {
    fs.writeFile(
      'discover.html',
      textReplace(content, 'html', data.toString()),
      done
      );
  });
});

gulp.task('build', ['clean', 'less', 'html']);

function textReplace(txt, path, str) {
  if (typeof txt === 'object') {
    str = Object.keys(txt).reduce(function(tempStr, key) {
      return textReplace(txt[key], path + '_' + key, tempStr);
    }, str);
  }
  else {
    str = str.replace(new RegExp('\\[' + path.toUpperCase() + '\\]', 'g'), txt);
  }

  return str;
}
