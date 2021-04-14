const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const browserSync = require('browser-sync').create();
const webpack = require('webpack-stream');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const imagemin = require('gulp-imagemin');

let isDev = true;
let isProd = !isDev;

const conf = {
    dest: './build'
};

let webConfig = {
    output: {
        filename: 'all.js'
    },
    module: {
            rules:[
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: '/node_modules'
                }
            ]
        },
    mode: isDev ? 'development' : 'production',
    devtool: isDev ? 'eval-source-map' : 'none'
    };

// const cssFiles = [
//     './node_modules/normalize.css/normalize.css',
//     './src/css/some.css',
//     './src/css/other.css'
// ];


function html(){
    return gulp.src('./src/*.html')
            .pipe(gulp.dest('./build'))
            .pipe(browserSync.stream());
}

function styles(){
    return gulp.src('./src/less/style.less')
            .pipe(gulpif(isDev, sourcemaps.init()))
            .pipe(less())
            .pipe(gulpif(isDev, sourcemaps.write()))
            .pipe(autoprefixer({
                browsers: ['> 0.1%'],
                cascade: false
            }))
            .pipe(gulpif(isProd, cleanCSS({
                level: 2
            })))
            .pipe(gulp.dest('./build/css'))
            .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src('./src/js/some.js')
            .pipe(webpack(webConfig))
            .pipe(gulp.dest(conf.dest + '/js'))
            .pipe(browserSync.stream());
}

function images(){
    return gulp.src('./src/img/**/*')
            .pipe(imagemin())
            .pipe(gulp.dest(conf.dest + '/img'));
}

function fonts(){
    return gulp.src('./src/fonts/**/*')
    
    .pipe(gulp.dest(conf.dest + '/fonts'));
}

function watch(){

    browserSync.init({
        server: {
            baseDir: "./build/"
        },
        tunnel: false
    });

    gulp.watch('./src/less/**/*.less', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch("./src/*.html", html);
}

function clean(){
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);

gulp.task('build', gulp.series(clean, 
                    gulp.parallel(html, fonts, images, styles, scripts))
                    );
gulp.task('dev', gulp.series('build', 'watch'));