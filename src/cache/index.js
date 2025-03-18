const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 30 * 24 * 60 * 60, checkperiod: 86400 });
module.exports = cache;
