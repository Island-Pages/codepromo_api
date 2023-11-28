const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();


gulp.task('start-server', function (done) {
  nodemon({
    script: './src/server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    done: done
  });
});


gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: 'http://localhost:3000', 
    port: 4000
  });
});


gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});


gulp.task('watch', function () {
  gulp.watch(['server.js', './src/server.js'], gulp.series('start-server', 'reload'));
});


gulp.task('default', gulp.parallel('start-server', 'browser-sync', 'watch'));
