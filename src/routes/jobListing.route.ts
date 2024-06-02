import express from "express";
import {
  createListing,
  deleteListing,
  getAllListings,
  getAllMyJobListings,
  getListing,
  updateListing,
} from "../controllers/jobListing.controller.js";
import { verifyJWT } from "../middlewares/authentication.middleware.js";
import { authorizeCompany } from "../middlewares/authorization.middleware.js";
export const jobListingRouter = express.Router();

jobListingRouter.get(
  "/my_listings",
  // @ts-ignore
  verifyJWT,
  authorizeCompany,
  getAllMyJobListings
);

jobListingRouter.get("/", getAllListings);
// @ts-ignore
jobListingRouter.post("/create", verifyJWT, authorizeCompany, createListing);
jobListingRouter.route("/:id").get(getListing);
jobListingRouter
  .route("/update/:id")
  // @ts-ignore
  .patch(verifyJWT, authorizeCompany, updateListing);
jobListingRouter
  .route("/delete/:id")
  // @ts-ignore
  .delete(verifyJWT, authorizeCompany, deleteListing);
