const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();

// Tarefa para iniciar o servidor Node.js com nodemon
gulp.task('start-server', function (done) {
  nodemon({
    script: './src/server.js', // Atualize com o nome do seu arquivo de servidor
    ext: 'js',
    env: { 'NODE_ENV': 'development' },
    done: done
  });
});

// Tarefa para iniciar o BrowserSync
gulp.task('browser-sync', function () {
  browserSync.init({
    proxy: 'http://localhost:3000', // Atualize com a URL do seu servidor Node.js
    port: 4000
  });
});

// Tarefa para recarregar o navegador quando arquivos estáticos são alterados
gulp.task('reload', function (done) {
  browserSync.reload();
  done();
});

// Tarefa para assistir a alterações nos arquivos do servidor e reiniciar o servidor
gulp.task('watch', function () {
  gulp.watch(['seu-arquivo-de-servidor.js', 'caminho-para-suas-rotas/**/*.js'], gulp.series('start-server', 'reload'));
});

// Tarefa padrão que inicia todas as tarefas
gulp.task('default', gulp.parallel('start-server', 'browser-sync', 'watch'));
