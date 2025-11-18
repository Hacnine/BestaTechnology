import express from "express";
import { updateDHLTracking } from "../controllers/dhlTrackingController.js";

const dhlTrackingRoute = express.Router();

dhlTrackingRoute.post("/create", updateDHLTracking);

export default dhlTrackingRoute;
