import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import gutil from 'gulp-util';
import plumber from 'gulp-plumber';
import del from 'del';
import runSequence from 'run-sequence';
import nodemon from 'gulp-nodemon';


gulp.task('sass', () => {
    return gulp.src('./assets/scss/**/*.scss')
    .pipe(plumber())
    .pipe(sass())
    .pipe(gulp.dest('./dist/assets/css'));
});


gulp.task('del', () => {
    return del(['dist/**/*.*', 'dist/**'], {
        'force': true
    });
})

gulp.task('build:clean', ['del'], (cb)=> {
    runSequence('build', cb);
});

gulp.task('js', () => {
    return gulp.src(['./app/**/*.js', './config/**/*.js', './app.js', './assets/js/**/*.js'], { "base": "." })
    .pipe(plumber())
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
    return nodemon({
        script: './dist/app.js', // run ES5 code
        ext: 'js',
        // watch: ['./app.js', './app', './config'], // watch ES2015 code
        ignore: ['./dist'],
        tasks: ['build'] // compile synchronously onChange
    });
}); 