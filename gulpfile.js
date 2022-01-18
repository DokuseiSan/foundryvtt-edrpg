const eslint      = require("gulp-eslint7");
const gulp        = require("gulp");
const gulpIf      = require("gulp-if");
const mergeStream = require("merge-stream");
const yaml        = require('gulp-yaml');

const parsedArgs  = require("yargs").argv;

const LINTER_PATHS    = ["./edrpg/edrpg.js", "./edrpg/module/"];
const YAML_LANG_PATHS = ["yaml/i18n/*.yaml"];

function linterTask() {
	const applyFixes = !!parsedArgs.fix;

	const tasks = LINTER_PATHS.map(path => {
		const src = path.endsWith("/")
			? `${path}**/*.js`
			: path;

		const dest = path.endsWith("/")
			? path
			: `${path.split("/").slice(0, -1).join("/")}/`;

		return gulp
			.src(src)
			.pipe(eslint({fix: applyFixes}))
			.pipe(eslint.format())
			.pipe(gulpIf(file => file.eslint != null && file.eslint.fixed, gulp.dest(dest)));
	});

	return mergeStream.call(null, tasks);
}

function yamlLangTask() {
  return gulp.src(YAML_LANG_PATHS)
    .pipe(yaml({ space: 2 }))
    .pipe(gulp.dest("./edrpg/i18n"))
}

const defaultTask = gulp.series(
	linterTask,
	yamlLangTask,

);

exports.default = defaultTask;

exports.lint = gulp.series(linterTask);
exports.langs = gulp.series(yamlLangTask)
