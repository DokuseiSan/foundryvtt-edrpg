const gulp = require("gulp");
const yaml = require('gulp-yaml');

const LANG_YAML = ["yaml/i18n/*.yaml"];

function compileLangs() {
  return gulp.src(LANG_YAML)
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest("./edrpg/i18n"))
}

exports.langs = compileLangs;
