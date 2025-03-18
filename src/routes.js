const { Router } = require("express");


const trackingController = require("./controllers/getTrackingController");
const trackingPlateController = require("./controllers/getTrackingPlateController");
const plateController = require("./controllers/getPlatesController");
const routes = Router();

routes.get("/tracking",trackingController.handle);
routes.post("/trackingPlate",trackingPlateController.handle);
routes.get("/plates",plateController.handle);
module.exports = routes;

