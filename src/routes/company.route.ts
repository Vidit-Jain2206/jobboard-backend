import express from "express";
import { verifyJWT } from "../middlewares/authentication.middleware";
import {
  getCurrentCompany,
  loginCompany,
  logoutCompany,
  registerCompany,
  updateCompanyDetails,
} from "../controllers/company.controller";
import { authorizeCompany } from "../middlewares/authorization.middleware";
export const companyRouter = express.Router();

companyRouter.post("/login", loginCompany);
companyRouter.post("/register", registerCompany);
// @ts-ignore
companyRouter.post("/logout", verifyJWT, authorizeCompany, logoutCompany);

companyRouter.get(
  "/current_company",
  // @ts-ignore
  verifyJWT,
  authorizeCompany,
  getCurrentCompany
);

companyRouter.patch(
  "/update_company_details/:id",
  // @ts-ignore
  verifyJWT,
  authorizeCompany,
  updateCompanyDetails
);
