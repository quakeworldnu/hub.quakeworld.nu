import changed from "gulp-changed";
import childProcess from "child_process";
import concat from "gulp-concat";
import gulpPkg from "gulp";
import gulpSass from "gulp-sass";
import imagemin from "gulp-imagemin";
import rev from "gulp-rev";
import sassCompiler from "sass";

// paths
import paths from "./gulpfile.paths.js";

// commonJS/instances
const sass = gulpSass(sassCompiler);
const {dest, parallel, series, src, task, watch} = gulpPkg;

// errors
const handleError = (e) => {
  console.error(e.toString());
  this.emit("end");
};

// styles
task("styles:dev", () => {
  return src(paths.src.sassFilesGlob)
    .pipe(sass({outputStyle: "expanded"}).on("error", handleError))
    .pipe(concat("styles.css"))
    .pipe(
      changed(paths.public.assetsDir, {hasChanged: changed.compareContents})
    )
    .pipe(dest(paths.public.assetsDir))
    .on("error", handleError);
});

task("styles:prod", () => {
  return src(paths.src.sassFilesGlob)
    .pipe(sass({outputStyle: "compressed"}).on("error", handleError))
    .pipe(concat("styles.min.css"))
    .pipe(rev())
    .pipe(dest(paths.public.assetsDir))
    .pipe(rev.manifest())
    .pipe(dest(paths.jekyll.dataDir))
    .on("error", handleError);
});

// images
task("images:prod", () => {
  return src(paths.src.imageFilesGlob)
    .pipe(imagemin())
    .pipe(dest(paths.public.assetsDir))
    .on("error", handleError);
});

task("images:dev", () => {
  return src(paths.src.imageFilesGlob)
    .pipe(
      changed(paths.public.assetsDir, {hasChanged: changed.compareContents})
    )
    .pipe(dest(paths.public.assetsDir))
    .on("error", handleError);
});

// jekyll
task("jekyll:dev", (callback) => {
  const command = "yarn";
  const params = ["run", "dev:jekyll"];
  const options = {stdio: "inherit"};
  return childProcess.spawn(command, params, options).on("close", callback);
});

// composite
task("assets:prod", parallel("images:prod", "styles:prod"));
task("assets:dev", parallel("images:dev", "styles:dev"));

task("watch", () => {
  watch([paths.jekyll.dataFilesGlob], series("jekyll:dev"));
  watch(
    [paths.src.imageFilesGlob],
    {ignoreInitial: false},
    series("images:dev")
  );
  watch(
    [paths.src.sassFilesGlob],
    {ignoreInitial: false},
    series("styles:dev")
  );
});
