const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

gulp.task('start-server', function (done) {
  nodemon({
    script: 'server.js',
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    done: done
  });
});

gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: 'http://localhost:3000',
    port: 4001
  });
});

gulp.task('watch', function () {
  gulp.watch(['server.js', 'server.js'], gulp.series('start-server', browserSync.reload));
});

gulp.task('default', gulp.parallel('start-server', 'browser-sync', 'watch'));
