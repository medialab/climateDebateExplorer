var gulp = require('gulp'),
    rimraf = require('rimraf'),
    less = require('gulp-less'),
    reactify = require('reactify'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    runSequence = require('run-sequence'),
    minifyCss = require('gulp-minify-css'),
    transform = require('vinyl-transform'),
    source = require('vinyl-source-stream'),
    autoprefixer = require('gulp-autoprefixer');




/********************
 * DEV TASK:
 * ******************
 */
gulp.task('dev-clean', function() {
  rimraf.sync('./dev');
});
gulp.task('dev-build-assets', function() {
  return gulp.src([ './assets/*', './assets/**/*' ])
    .pipe(gulp.dest('./dev/assets'));
});
gulp.task('dev-build-style', function() {
  return gulp.src('./style/app.less')
    .pipe(less())
    .pipe(autoprefixer({
      browsers: [ 'last 2 versions' ],
      cascade: false
    }))
    .pipe(rename('app.css'))
    .pipe(gulp.dest('./dev'));
});
gulp.task('dev-build-src', function() {
  return browserify({
      entries: './src/app.jsx',
      standalone: 'app',
      debug: true
    })
    .transform(reactify)
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(gulp.dest('./dev'));
});
gulp.task('dev-build-html', function() {
  return gulp.src('./app.html')
    .pipe(gulp.dest('./dev'));
});
gulp.task('dev-build', function() {
  runSequence(
    'dev-clean',
    'dev-build-assets',
    'dev-build-style',
    'dev-build-src',
    'dev-build-html'
  );
});


/********************
 * DEFAULT TASK:
 * ******************
 */
gulp.task('default', ['dev-build']);
