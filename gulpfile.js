const {
    series,
    parallel,
    src,
    dest,
    watch
} = require('gulp');

const gulpClean = require("gulp-clean");

var sass = require('gulp-sass');

sass.compiler = require('node-sass');

// The `clean` function is not exported so it can be considered a private task.
// It can still be used within the `series()` composition.
function clean(cb) {
    // body omitted
    return src('./dist', {
            read: false
        })
        .pipe(gulpClean());
    //cb();
}

function buildHtml() {
    return src('src/**/*.html')
        .pipe(dest('./dist'));
}
// The `build` function is exported so it is public and can be run with the `gulp` command.
// It can also be used within the `series()` composition.
const build = series(parallel(buildHtml, buildCSS, buildJavaScript, buildImage), function (cb) {
    // body omitted
    cb();
});

function buildCSS() {
    return src('./src/**/*.scss')
        .pipe(sass().on('error', sass.logError))

        .pipe(dest('./dist'));
};

function buildImage() {
    return src(['./src/**/*.jpg', './src/**/*.png'])
        .pipe(dest('./dist'));
};

function buildJavaScript() {
    return src('./src/**/*.js')
        .pipe(dest('./dist'));
};

function watchCSS(cb) {
    return watch('./src/**/*.scss', buildCSS);
    cb();
}

function watchImage(cb) {
    return watch('./src/**/*.jpg', buildImage);
    cb();
}

function watchHTML(cb) {
    return watch('./src/**/*.html', buildHtml);
    cb();
}

function watchJavaScript(cb) {
    return watch('./src/**/*.js', buildJavaScript);
    cb();
}

const watchAll = parallel(watchCSS, watchHTML, watchJavaScript, watchImage);

exports.buildCSS = buildCSS;
exports.build = build;
exports.default = series(clean, build);
exports.watch = watch
exports.dev = series(build, watchAll);