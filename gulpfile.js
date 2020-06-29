var gulp = require('gulp');
var rename = require('gulp-rename');
var sass = require('gulp-sass');
var autoPrefixer = require('gulp-autoprefixer');
var sourcemaps = require('gulp-sourcemaps');
var browserify = require('browserify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
// const { src } = require('gulp');

var svgSRC = './src/images/*.svg';
var svgDEST = './dist/images';

var imgSRC = './src/images/*';
var imgDEST = './dist/images';

var styleSRC = './src/scss/style.scss';
var styleDist = './dist/css';

var jsSRC = './src/js/script.js';
var jsDIST = './dist/js/';

var styleWatch = './src/scss/**/*.scss';
var jsWatch = './src/js/**/*.js';

var jsFiles = [jsSRC];

gulp.task('style', function(done) {
    gulp.src(styleSRC)
    .pipe(sourcemaps.init())
    .pipe(sass({
        errLogToConsole: true,
        outputStyle: "compressed"
    }))
    .on('error', console.error.bind(console))
    .pipe(autoPrefixer({
        cascade: false,
    }))
    .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(styleDist));
    done();
});

gulp.task('js', function(done) {
    jsFiles.map((entry) => {
        return browserify({
            entries: entry
        })
        .transform(babelify, {presets: ['env']})
        .bundle()
        .pipe(source(entry))
        .pipe(rename({extname: ".min.js"}))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(jsDIST))
    });
    done();
    //browserify
    //transform using babelify[env]
    //bundle(one single file)
    //source
    //rename .min
    //buffer
    //init sourcemap
    //uglify js file / minify
    //write sourcemaps
    //save in dist
    // gulp.src(jsSRC)
    // .pipe(gulp.dest(jsDIST));
});

gulp.task('watch', function() {
    gulp.watch(styleWatch, gulp.series('style'));
    gulp.watch(jsWatch, gulp.series('js'));
});

gulp.task('image', function(done) {
    gulp.src(imgSRC)
    .pipe(imagemin())
    .pipe(gulp.dest(imgDEST));
    done();
});

gulp.task('icon-gen', function(done) {
    return gulp.src(svgSRC)
    .pipe(svgmin())
    // .pipe(svgstore({inlineSvg: true}))
    .pipe(rename('icon.svg'))
    .pipe(gulp.dest(svgDEST));
        
});

gulp.task('default', gulp.parallel('style', 'js'), function() {

});