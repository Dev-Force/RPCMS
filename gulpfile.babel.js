import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import gutil from 'gulp-util';
import child_process from 'child_process';

let spawn = child_process.spawn;
let node;

/**
 * $ gulp server
 * description: launch the server. If there's a server already running, kill it.
 */
gulp.task('server', ['build'], () => {
    if (node) node.kill();
    node = spawn('node', ['dist/app.js'], { stdio: 'inherit' })
    node.on('close', (code) => {
        if (code === 8) {
            gulp.log('Error detected, waiting for changes...');
        }
    });
})

gulp.task('sass', () => {
    return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('./dist/assets/css'));
});

/**
 * $ gulp
 * description: start the development environment
 */
gulp.task('default', ['server'], () => {

    gulp.watch(['./app.js', './app/**/*.js', './config/**/*.js', './app/views/**/*', './assets/js/**/*.js'], ['server']);

    gulp.watch(['./assets/scss/**/*.scss'], ['sass']);

    // Need to watch for sass changes too? Just add another watch call!
})

// clean up if an error goes unhandled.
process.on('exit', () => {
    if (node) node.kill()
})

gulp.task('build', ['sass'], () => {

    gulp.src('./app/views/**/*', { "base": "." })
    .pipe(gulp.dest('./dist/'));

    gulp.src('./assets/**/*', { "base": "." })
    .pipe(gulp.dest('./dist/'));

    return gulp.src(['./app/**/*.js', './config/**/*.js', './app.js', './assets/js/**/*.js'], { "base": "." })
    .pipe(babel({
        presets: ['es2015', 'stage-0']
    }).on('error', gutil.log))
    .pipe(gulp.dest('./dist/'));
});

