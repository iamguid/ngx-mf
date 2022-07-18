const gulp = require('gulp');
const header = require('gulp-header');

// see https://github.com/microsoft/TypeScript/issues/38628
function addTsNoCheckHeader() {
    return gulp.src('./dist/**/*.d.ts')
        .pipe(header('// @ts-nocheck \n'))
        .pipe(gulp.dest('./dist/'))
}

exports.default = addTsNoCheckHeader