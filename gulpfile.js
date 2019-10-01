//Packages
const {src, dest, watch, series, parallel} = require("gulp")
const concat = require("gulp-concat");                  //Konkatinerar/sammanslår filer
const uglify = require("gulp-uglify-es").default;       // Minifierar javascript-filer
const cleanCSS = require("gulp-clean-css");             // Minifierar css-filer
const imagemin = require('gulp-imagemin')               // Minifierar images

const sass = require("gulp-sass");              
sass.compiler = require("node-sass");                   //Sammanställa/Compile sass-files

const browserSync = require('browser-sync').create()


//Search
const files = {
    htmlPath: "src/**/*.html",
    sassPath: "src/**/*.scss",
    jsPath: "src/**/*.js",
    imgPath: "src/images/**"
}

//Copy Html-files
function htmlTask() {
    return src(files.htmlPath)
        .pipe(dest("pub"))
        .pipe(browserSync.stream())
}

// Task - Convert Scss to Css, minify, concat 
function sassTask() {
    return src(files.sassPath)
        .pipe(sass().on("error", sass.logError))
        .pipe(concat("style.css"))
        .pipe(cleanCSS())
        .pipe(dest("pub/css"))
        .pipe(browserSync.stream())
}

//Task - Concat, minify copy js-files
function jsTask() {
    return src(files.jsPath)
        .pipe(concat("main.js"))
        .pipe(uglify())
        .pipe(dest("pub/js"))
        .pipe(browserSync.stream())
}

// Task - Copy, minify Images
function imgTask() {
    return src(files.imgPath)
    .pipe(imagemin())      
    .pipe(dest("pub/images/"))
    .pipe(browserSync.stream())
}

//Task watcher
function watchTask() {
    browserSync.init({
        server: {
            baseDir: 'pub/'
        }
    });
    watch([files.htmlPath, files.sassPath, files.jsPath, files.imgPath],
        parallel(
            htmlTask, 
            sassTask, 
            jsTask, 
            imgTask),
    )
}

// Make the functions public 
exports.default = series(
    parallel(
        htmlTask, 
        sassTask, 
        jsTask, 
        imgTask),
        watchTask
);