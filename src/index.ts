import "dotenv/config";

import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import openapiSpec from "./swagger/openapispec";
import { companyRouter } from "./routes/company.route.js";
import { jobSeekerRouter } from "./routes/jobSeeker.route.js";
import { jobListingRouter } from "./routes/jobListing.route.js";
import { jobApplicationRouter } from "./routes/jobApplication.route.js";
export const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/api/v1/job_seeker", jobSeekerRouter);
app.use("/api/v1/company", companyRouter);
app.use("/api/v1/job_listing", jobListingRouter);
app.use("/api/v1/job_application", jobApplicationRouter);

app.get("/health", (req, res) => {
  res.status(200).json({ message: "Health is ok" });
});
const swaggerDocument = openapiSpec;
app.use("/documentation", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.listen(PORT, () => {
  console.log(`Server is running on PORT:- ${PORT}`);
  console.log(`View Documentation :- http://localhost:${PORT}/documentation`);
});

app.listen(4000);
