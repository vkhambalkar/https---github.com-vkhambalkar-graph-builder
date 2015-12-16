var gulp = require('gulp'),
  connect = require('gulp-connect');
 
gulp.task('connectDev', function () {
  connect.server({
    root: ['app'],
    port: 8080,
    livereload: true
  });
});
 


gulp.task('default', [ 'connectDev']);
 