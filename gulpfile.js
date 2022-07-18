const gulp = require('gulp');
const header = require('gulp-header');
const del = require('del');

gulp.task('clean', () => {
    return del(['./dist/**']);
})

// see https://github.com/microsoft/TypeScript/issues/38628
gulp.task('addTsNoCheckHeader', () => {
    return gulp.src('./dist/**/*.d.ts')
        .pipe(header('// @ts-nocheck \n'))
        .pipe(gulp.dest('./dist/'))
})
