import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllCostSheets,
  getCostSheetById,
  createCostSheet,
  updateCostSheet,
  deleteCostSheet,
  checkStyle,
} from "../controllers/costSheetController.js";
import { requireAuth } from '../middlewares/authMiddleware.js';

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'uploads', 'images'));
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'costsheet-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check if file is an image
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

const costSheetRoutes = express.Router();
costSheetRoutes.use(requireAuth);
costSheetRoutes.get("/check-style", checkStyle);
costSheetRoutes.get("/", getAllCostSheets);
costSheetRoutes.get("/:id", getCostSheetById);
costSheetRoutes.post("/", upload.single('image'), createCostSheet);
costSheetRoutes.put("/:id", upload.single('image'), updateCostSheet);
costSheetRoutes.delete("/:id", deleteCostSheet);

export default costSheetRoutes;
