const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');


/*Browser sync compile*/
gulp.task('server', function () {
    browserSync.init({
        server: {
            port: 3000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});
/*HTML compile*/
gulp.task('templates:compile', function buildHTML() {
    return gulp.src('src/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'));
});

/*Styles compile*/
gulp.task('styles:compile', function () {
    return gulp.src('src/styles/main.scss')
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
        overrideBrowserslist: ['last 2 versions'],
        cascade: false
    }))
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('build/css'));
});

/*Sprite*/

gulp.task('sprite', function (cb) {
    const spriteData = gulp.src('src/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imgPath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('src/styles/global/'));
    cb();
});

/*Clean*/

gulp.task('clean', function del(cb) {
    return rimraf('build', cb);
});

/* Copy fonts*/
gulp.task('copy:fonts', function () {
    return gulp.src('./src/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});

/* Copy img*/
gulp.task('copy:images', function () {
    return gulp.src('./src/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

gulp.task('copy', gulp.parallel('copy:images', 'copy:fonts'));

/*Watchers*/
gulp.task('watch', function () {
    gulp.watch('src/template/**/*.pug', gulp.series('templates:compile'));
    gulp.watch('src/styles/**/*.scss', gulp.series('styles:compile'));

});

gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('templates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));