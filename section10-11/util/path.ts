import path from "path";

const mainPath = require.main && path.dirname(require.main.filename);

export default mainPath;
