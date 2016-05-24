import gulp from "gulp";
import nodemon from "gulp-nodemon";
import childProcess from "child_process";
import "babel-core/register";
import mocha from "gulp-mocha";
import babel from "gulp-babel";
import eslint from "gulp-eslint";

const paths = {
    client_scripts: ["client_app/**/*.js"],
    client_js_dest: "public/",
};

gulp.task("develop", () => {
    nodemon({
        script: "server.js",
        execMap: {
            js: "./node_modules/babel-cli/bin/babel-node.js",
        },
        ignore: [
            "node_modules/",
            "public/",
        ],
        tasks: ["lint", "compile"],
    });
});

gulp.task("compile", () => {
    gulp.src(paths.client_scripts)
        .pipe(babel({
            presets: ["es2015"],
        }))
        .pipe(gulp.dest(paths.client_js_dest));
});

gulp.task("lint", () =>
    // ESLint ignores files with "node_modules" paths.
    // So, it's best to have gulp ignore the directory as well.
    // Also, Be sure to return the stream from the task;
    // Otherwise, the task may end before the stream has finished.
    gulp.src(["**/*.js", "!node_modules/**", "!bower_components/**", "!public/js/**"])
    // eslint() attaches the lint output to the "eslint" property
    // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failAfterError last.
        .pipe(eslint.failAfterError()));

gulp.task("test", () =>
    gulp.src("test/**/*.js")
        .pipe(mocha()));

gulp.task("default", ["lint", "compile", "test"], () => {
    childProcess.exec("./node_modules/babel-cli/bin/babel-node.js server.js");
});
