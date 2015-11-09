'use strict';

var gulp = require('gulp');
var lint = require('gulp-jshint');

var gutil = require('gulp-util');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var hbsfy = require('hbsfy');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');

// Add your require statements and gulp tasks here

//----------------- Lint -------------------//
// For the lint task, you will need to use the "gulp-jshint" package from npm. Add the "lint" task as a dependency for the "default" task. Use the 'default' reporter for JSHint.


gulp.task('lint', function() {
    return gulp.src('./js/*.js')
            .pipe(lint())
            .pipe(lint.reporter('default'));
});

gulp.task('default', ['lint'], function(){
    gulp.watch('./js/*.js', ['lint'])
});

// ----------------- Clean (rimraf) -----------------//
// For the clean task, simply delete the js/bundle.js file to "clean up" your project files. Use the "del" npm package.

gulp.task('clean', function() {
return gulp.src('./js/bundle.js', { read: false }) // much faster
  .pipe(ignore('node_modules/**'))
  .pipe(rimraf());
});


// Browserify


var bundler = browserify({
  entries: ['./js/index.js'],
  debug: true
});

bundler.transform(hbsfy);
bundler.on('log', gutil.log); // output build logs to terminal

gulp.task('build', ['clean'], function () {
  return bundler.bundle()
    // log errors if they happen
    .on('error', gutil.log.bind(gutil, 'Browserify Error'))
    // set output filename
    .pipe(source('bundle.js'))
    .pipe(gulp.dest('js'))
});

// API Server
var jsonServer = require('json-server');

var apiServer = jsonServer.create();
var router = jsonServer.router('db.json');

apiServer.use(jsonServer.defaults);
apiServer.use(router);

gulp.task('serve:api', function (cb) {
  apiServer.listen(3000);
  cb();
});

// Web Server
var serve = require('gulp-serve');

gulp.task('serve:web', serve({
  root: ['.'],
  port: 8000
}));

gulp.task('serve', ['serve:api', 'serve:web'])
