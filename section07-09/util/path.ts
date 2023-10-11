import path from "path";

export const mainPath = require.main && path.dirname(require.main.filename);
