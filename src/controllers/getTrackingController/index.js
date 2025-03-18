const model = require("../../models/trackingRoute");
const logger = require("../../custom/logger");

module.exports = {
  async handle(req, res) {
    try {
      const params = req.body;
      const response = await model.execute(params);
      logger.info("request test successfully");

      return res.status(200).json(response);
    } catch (error) {
      if (!error.path) {
        error.path = "/controller/easyMaps/testController";
      }
      throw error;
    }
  },
};
