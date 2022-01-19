"use strict";

const eslint = require("gulp-eslint-new");
const gulp   = require("gulp");
const gulpIf = require("gulp-if");
const sass   = require("gulp-sass")(require("sass"));
const yaml   = require("gulp-yaml");

const mergeStream = require("merge-stream");
const parsedArgs  = require("yargs").argv;

const LINT_PATHS = ["./edrpg/edrpg.js", "./edrpg/module/"];
const LANG_PATHS = ["yaml/i18n/*.yaml"];

// transform all the i18n language YAML files into JSON within the main system
// directory
//
function buildLangs(cb) {
	gulp.src(LANG_PATHS)
		.pipe(yaml({ space: 2 }))
		.pipe(gulp.dest("./edrpg/i18n"));

	cb();
}

function buildStyles(cb) {
	gulp.src("./scss/**/*.scss")
		.pipe(sass.sync().on("error", sass.logError))
		.pipe(gulp.dest("./edrpg/css"));

	cb();
}

function lintJavascript(cb) {
	const applyFixes = !!parsedArgs.fix;

	const tasks = LINT_PATHS.map(path => {
		const src = path.endsWith("/")
			? `${path}**/*.js`
			: path;

		const dest = path.endsWith("/")
			? path
			: `${path.split("/").slice(0, -1).join("/")}/`;

		return gulp
			.src(src)
			.pipe(eslint({ fix: applyFixes }))
			.pipe(eslint.format())
			.pipe(gulpIf(file => file.eslint != null && file.eslint.fixed, gulp.dest(dest)));
	});

	mergeStream(tasks);

	cb();
}

const defaultTask = gulp.parallel(
	lintJavascript,
	buildStyles,
	buildLangs,
);

exports.default = defaultTask;

exports.buildLangs     = buildLangs;
exports.buildStyles    = buildStyles;
exports.lintJavascript = lintJavascript;

exports.watch = function() {
	gulp.watch("./scss/**/*.scss", buildStyles);
};
