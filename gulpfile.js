/**
 * Gulp Packages
 */

var gulp = require('gulp')
  , plumber = require('gulp-plumber')
  , del = require('del')
  , jade = require('gulp-jade')
  , sass = require('gulp-sass')
  , minify = require('gulp-cssnano')
  , watch = require('gulp-watch')
  , livereload = require('gulp-livereload')
  , jshint = require('gulp-jshint')
  , stylish = require('jshint-stylish')
  , concat = require('gulp-concat')
  , uglify = require('gulp-uglify')
  , prefix = require('gulp-autoprefixer')
  , ghPages= require('gulp-gh-pages');

/**
 * Paths to project folders
 */

var paths = {
    input: 'public/**/*'
  , output: 'dist/'

  , views: {
      input: 'public/views/**/*.jade'
    , output: 'dist/'
  }

  , styles: {
      input: 'public/stylesheets/**/*.{scss,sass}'
    , output: 'dist/stylesheets'
  }

  , scripts: {
      input: 'public/scripts/*.js'
    , output: 'dist/scripts'
  }

  , images: {
      input: 'public/images/*'
    , output: 'dist/images'
  }

  , deploy: 'dist/**/*'
}

/**
 * Gulp Taks
 */

gulp.task('build:views', function() {
  return gulp.src(paths.views.input)
    .pipe(plumber())
    .pipe(jade())
    .pipe(gulp.dest(paths.views.output))
});

// Process, lint, and minify Sass files
gulp.task('build:styles', function() {
  return gulp.src(paths.styles.input)
    .pipe(plumber())
    .pipe(sass({
      outputStyle: 'expanded',
      sourceComments: true
    }))
    .pipe(prefix({
      browsers: ['last 2 version', '> 1%'],
      cascade: true,
      remove: true
    }))
    .pipe(minify({
      discardComments: {
        removeAll: true
      }
    }))
    .pipe(gulp.dest(paths.styles.output));
});

// Lint, minify, and concatenate scripts
gulp.task('build:scripts', function() {
  return gulp.src(paths.scripts.input)
    .pipe(plumber())
    .pipe(concat('main.js'))
    .pipe(uglify())
    .pipe(gulp.dest(paths.scripts.output))
});

// Lint scripts
gulp.task('lint:scripts', function () {
  return gulp.src(paths.scripts.input)
    .pipe(plumber())
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

// Copy image files into output folder
gulp.task('build:images', function() {
  return gulp.src(paths.images.input)
    .pipe(plumber())
    .pipe(gulp.dest(paths.images.output));
});

// Spin up livereload server and listen for file changes
gulp.task('listen', function () {
  livereload.listen();
  gulp.watch(paths.input).on('change', function(file) {
    gulp.start('default');
    gulp.start('refresh');
  });
});

// Run livereload after file change
gulp.task('refresh', ['compile'], function () {
  livereload.changed();
});

/**
 * Task Runners
 */

// Compile files
gulp.task('compile', [
    'lint:scripts'
  , 'build:views'
  , 'build:styles'
  , 'build:scripts'
  , 'build:images'
]);

// Compile files and generate docs (default)
gulp.task('default', [
  'compile'
]);

// Compile files and generate docs when something changes
gulp.task('watch', [
    'listen'
  , 'default'
]);

gulp.task('deploy', ['compile'], function () {
  return gulp.src(paths.deploy)
    .pipe(ghPages());
});
