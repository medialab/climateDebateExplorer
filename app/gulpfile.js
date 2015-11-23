'use strict';


var gulp = require('gulp'),
    rimraf = require('rimraf'),
    less = require('gulp-less'),
    rename = require('gulp-rename'),
    minifyCss = require('gulp-minify-css'),
    autoprefixer = require('gulp-autoprefixer'),

    reactify = require('reactify'),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    runSequence = require('run-sequence'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),

    symlink = require('gulp-symlink'),

    fs = require('fs');



/**
 * DISCOVER
 * ********
 */
gulp.task('discover-build-img', function() {
  return gulp.src(['./discover/assets/img/*'])
    .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('discover-less', function() {
  return gulp.src('./discover/less/app.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(rename('discover.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('./build/assets/style'));
});

gulp.task('discover-build-src', function() {
  return gulp.src(['./discover/assets/src/*', './discover/dist/*'])
    .pipe(gulp.dest('./build/assets/src'));
});

gulp.task('discover-html', function(done) {
  var content = require('./discover/content.json');

  fs.readFile('./discover/app.html', function(err, data) {
    fs.writeFile(
      'build/index.html',
      textReplace(content, 'html', data.toString()),
      done
      );
  });
});

gulp.task('discover-build', function() {
  runSequence('discover-build-img', 'discover-less', 'discover-build-src', 'discover-html');
});

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


/**
 * EXPLORER
 * ********
 */

gulp.task('explorer-build-img', function() {
  return gulp.src(['./explorer/assets/*.svg'])
    .pipe(gulp.dest('./build/assets/img'));
});

gulp.task('explorer-build-fonts', function() {
  return gulp.src(['./explorer/assets/fonts/*'])
    .pipe(gulp.dest('./build/assets/fonts'));
});

gulp.task('explorer-build-assets', ['explorer-build-img', 'explorer-build-fonts']);

gulp.task('explorer-build-style', function() {
  return gulp.src('./explorer/style/app.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: [ 'last 2 versions' ],
      cascade: false
    }))
    .pipe(rename('explorer.css'))
    .pipe(gulp.dest('./build/assets/style'));
});

gulp.task('explorer-build-src', function() {
  return browserify({
      entries: './explorer/src/app.jsx',
      standalone: 'app',
      debug: true
    })
    .transform(reactify)
    .bundle()
    .pipe(source('explorer.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./build/assets/src'));
});

gulp.task('explorer-build-analytics', function() {
  return gulp.src(['./explorer/assets/analytics.js'])
    .pipe(gulp.dest('./build/assets/src'));
});

gulp.task('explorer-build-html', function() {
  return gulp.src('./explorer/app.html')
    .pipe(rename('index.html'))
    .pipe(gulp.dest('./build/explore'));
});

gulp.task('explorer-build', function() {
  runSequence(
    'explorer-build-assets',
    'explorer-build-style',
    'explorer-build-src',
    'explorer-build-analytics',
    'explorer-build-html'
  );
});

/**
 * DATA
 * ********
 */
gulp.task('data-build-csv', function() {
  return gulp.src(['../ENB-data/metadata_overview/sections_metadata.csv'])
    .pipe(rename('data.csv'))
    .pipe(gulp.dest('./build/assets/data'));
});

gulp.task('data-build-csv-full', function() {
  return gulp.src(['../ENB-data/metadata_overview/sections_fulldata.csv.zip'])
    .pipe(rename('ClimateNegtationsBrowser-ENB-verbatims.csv.zip'))
    .pipe(gulp.dest('./build/assets/data'));
});

gulp.task('data-build-htaccess', function() {
  return gulp.src(['./data/.htaccess'])
    .pipe(gulp.dest('./build/assets/data'));
});

gulp.task('data-build-glossary', function() {
  return gulp.src(['./data/glossary.csv'])
    .pipe(gulp.dest('./build/assets/data'));
});

gulp.task('data-build-html', function () {
  return gulp.src('../ENB-data/enb_pages/')
    .pipe(symlink('./build/bulletin'));
});

gulp.task('data-build-style', function() {
  return gulp.src('../ENB-data/bulletin.css')
    .pipe(gulp.dest('./build/assets/style'));
});

gulp.task('data-build-src', function() {
  return gulp.src('../ENB-data/bulletin.js')
    .pipe(gulp.dest('./build/assets/src'));
});

gulp.task('data-build', function() {
  runSequence(
    'data-build-style',
    'data-build-src',
    'data-build-csv',
    'data-build-htaccess',
    'data-build-glossary',
    'data-build-html'
  );
});


/**
 * APPENDICE PAGES
 * ********
 */
gulp.task('appendice-build-about', function() {
  return gulp.src('../ENB-data/about.html')
    .pipe(gulp.dest('./build'));
});

gulp.task('appendice-build', function() {
  runSequence(
    'appendice-build-about'
  );
});


/**
 * MAIN
 * ********
 */
gulp.task('clean', function() {
  rimraf.sync('./build');
});


gulp.task('build', function() {
  runSequence('clean', 'data-build', 'discover-build', 'explorer-build', 'appendice-build');
});
