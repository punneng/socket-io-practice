const gulp       = require('gulp')
const browserify = require('gulp-browserify')
const nodemon    = require('gulp-nodemon')

gulp.task('backend', () => {
  nodemon({
    script: 'index.js',
    ext: 'js',
    ignore: [
      'app/**',
      'node_modules/**',
      'test/**',
      'bundle/**'
    ]
  })
  .on('restart', () => { console.log(`Server restarted!`) })
})

gulp.task('build-client', () => {
  return gulp.
    src('app/index.js').
    pipe(browserify()).
    pipe(gulp.dest('./bundle'))
})

gulp.task('watch', ['build-client'], () => {
  gulp.watch(['./app/*.js'], ['build-client'])
})

gulp.task('dev', ['backend', 'watch'])
