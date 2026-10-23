/**
 * import rules (pages -> features -> shared), see docs: https://github.com/sverweij/dependency-cruiser
 * - features never import other features (compose them in pages)
 * - shared code (components, hooks, lib, utils, stores, types, config) never imports features or pages
 */
/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-cross-feature-imports",
      comment: "features must not import other features, compose them in a page instead",
      severity: "error",
      from: { path: "^src/features/([^/]+)/" },
      to: { path: "^src/features/", pathNot: "^src/features/$1/" },
    },
    {
      name: "shared-not-to-features-or-pages",
      comment: "shared code must not depend on features or pages",
      severity: "error",
      from: { path: "^src/(components|hooks|lib|utils|stores|types|config)/" },
      to: { path: "^src/(features|pages)/" },
    },
    {
      name: "features-not-to-pages",
      severity: "error",
      from: { path: "^src/features/" },
      to: { path: "^src/pages/" },
    },
    {
      name: "no-circular",
      severity: "error",
      from: {},
      to: { circular: true },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    parser: "swc",
    tsConfig: { fileName: "tsconfig.json" },
    tsPreCompilationDeps: true,
  },
};
