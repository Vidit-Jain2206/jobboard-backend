import express from "express";
import {
  createJobApplication,
  getAllMyJobApplications,
  getJobApplication,
} from "../controllers/jobApplication.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { authorizeJobSeeker } from "../middlewares/authorization.middleware.js";

export const jobApplicationRouter = express.Router();

jobApplicationRouter.get(
  "/my_applications",
  // @ts-ignore
  verifyJWT,
  authorizeJobSeeker,
  getAllMyJobApplications
);
jobApplicationRouter.post(
  "/create/:id",
  // @ts-ignore
  verifyJWT,
  authorizeJobSeeker,
  createJobApplication
);

jobApplicationRouter.route("/:id").get(getJobApplication);
