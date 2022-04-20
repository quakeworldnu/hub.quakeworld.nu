/**
 * Define paths for gulpfile.
 */

const fileGlobs = {
  data: "**/*.+(json|yml|csv)",
  images: "**/*.+(jpg|jpeg|png|svg|gif|webp|tif)",
  sass: "**/*.scss",
};

const jekyllDir = "jekyll/";
const sourceDir = "src/";
const publicDir = "public/";

export default {
  jekyll: {
    baseDir: jekyllDir,
    dataDir: jekyllDir + "_data/",
    dataFilesGlob: jekyllDir + fileGlobs.data,
  },
  src: {
    baseDir: sourceDir,
    sassFilesGlob: sourceDir + fileGlobs.sass,
    imageFilesGlob: sourceDir + fileGlobs.images,
  },
  public: {
    baseDir: publicDir,
    assetsDir: publicDir + "assets/",
  },
};
