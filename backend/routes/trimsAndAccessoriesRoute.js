import express from "express";
import {
  createTrimsAndAccessories,
  updateTrimsAndAccessories,
  allTrimsAndAccessories,
  trimsAndAccessoriesById,
} from "../controllers/trimsAndAccessoriesController.js";
import { requireAuth } from "../middlewares/authMiddleware.js";

const trimsRoute = express.Router();
trimsRoute.use(requireAuth);

trimsRoute.post("/", createTrimsAndAccessories);
trimsRoute.get("/", allTrimsAndAccessories);
trimsRoute.get("/:id", trimsAndAccessoriesById);
trimsRoute.put("/update/:id", updateTrimsAndAccessories);

export default trimsRoute;
