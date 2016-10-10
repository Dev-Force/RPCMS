import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import gutil from 'gulp-util';
import child_process from 'child_process';
import del from 'del';
import runSequence from 'run-sequence';
import nodemon from 'gulp-nodemon';

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

    

    // Need to watch for sass changes too? Just add another watch call!
})

// clean up if an error goes unhandled.
process.on('exit', () => {
    if (node) node.kill()
})

gulp.task('build:clean', ()=> {
    del.sync(['dist/**/*.*', 'dist/**'], {
        'force': true
    });
    runSequence('build');
});

gulp.task('js', () => {
    return gulp.src(['./app/**/*.js', './config/**/*.js', './app.js', './assets/js/**/*.js'], { "base": "." })
    .pipe(babel({
        presets: ['es2015', 'stage-0']
    }).on('error', gutil.log))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('views', () => {
    return gulp.src('./app/views/**/*', { "base": "." })
    .pipe(gulp.dest('./dist/'));
});

gulp.task('assets', () => {
    return gulp.src('./assets/**/*', { "base": "." })
    .pipe(gulp.dest('./dist/'));
});

gulp.task('build', ['assets', 'views', 'js', 'sass']);

gulp.task('watch', ['build:clean'], () => {
    // gulp.watch(['./app.js', './app/**/*.js', './config/**/*.js', './app/views/**/*', './assets/js/**/*.js'], ['server']);
    // gulp.watch(['./assets/scss/**/*.scss'], ['sass']);

    return nodemon({
                 script: './dist/app.js' // run ES5 code
               , watch: ['./app.js', './app', './config'] // watch ES2015 code
               , tasks: ['build'] // compile synchronously onChange
               });
}); 