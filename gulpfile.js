var gulp  = require('gulp'),
uglify    = require('gulp-uglify'),
rename    = require('gulp-rename'),
concat    = require('gulp-concat'),
concatCSS = require('gulp-concat-css'),
uglifyCSS = require('gulp-minify-css');

// Copy JS
gulp.task('copyJS', function() {
  return gulp.src([
      'bower_components/jquery/dist/jquery.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/bootstrap-growl/jquery.bootstrap-growl.js',
      'bower_components/videojs/dist/video-js/video.js',
      'bower_components/underscore/underscore.js'
    ])
    .pipe(gulp.dest('public/js/libs/'));
});

// Copy CSS
gulp.task('copyCSS', function() {
  return gulp.src([
      'bower_components/bootstrap/dist/css/bootstrap.css',
      'bower_components/bootstrap/dist/css/bootstrap.css.map',
      'bower_components/font-awesome/css/font-awesome.css',
      'bower_components/videojs/dist/video-js/video-js.css'
    ])
    .pipe(gulp.dest('public/css/'));
});

// Copy Fonts
gulp.task('copyFonts', function() {
  return gulp.src([
      'bower_components/font-awesome/fonts/fontawesome-webfont.eot',
      'bower_components/font-awesome/fonts/fontawesome-webfont.svg',
      'bower_components/font-awesome/fonts/fontawesome-webfont.ttf',
      'bower_components/font-awesome/fonts/fontawesome-webfont.woff',
      'bower_components/font-awesome/fonts/FontAwesome.otf',
      'bower_components/videojs/dist/video-js/font/vjs.eot',
      'bower_components/videojs/dist/video-js/font/vjs.svg',
      'bower_components/videojs/dist/video-js/font/vjs.ttf',
      'bower_components/videojs/dist/video-js/font/vjs.woff'
    ])
    .pipe(gulp.dest('public/fonts/'));
});

// Libraries
gulp.task('libs', function() {
  return gulp.src([
      'public/js/libs/jquery.js',
      'public/js/libs/bootstrap.js',
      'public/js/libs/jquery.bootstrap-growl.js'
    ])
    .pipe(concat('libs.all.js'))
    .pipe(uglify())
    .pipe(rename('libs.min.js'))
    .pipe(gulp.dest('/build/js/libs/'));
});

// Styles
gulp.task('styles', function() {
  return gulp.src('public/css/*.css')
    .pipe(concatCSS('main.all.css'))
    .pipe(uglifyCSS())
    .pipe(rename('main.min.css'))
    .pipe(gulp.dest('/build/css/'));
});

// Fonts
gulp.task('fonts', function() {
  return gulp.src('public/fonts/*')
    .pipe(gulp.dest('/build/fonts/'));
});

// Uglify JS
gulp.task('scripts', function() {
  return gulp.src('public/js/*.js')
    .pipe(uglify())
    .pipe(rename('main.min.js'))
    .pipe(gulp.dest('/build/js/'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(['public/js/**/*.js', 'public/css/**/*.css'], ['libs', 'styles', 'fonts', 'scripts']);
});

// Bower Copy
gulp.task('bowercopy', ['copyJS', 'copyCSS', 'copyFonts']);

// Build
gulp.task('build', ['libs', 'styles', 'fonts', 'scripts']);

// Default Task
gulp.task('default', ['watch']);