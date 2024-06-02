import { NextFunction } from "express";

import { ApiError } from "../utils/ApiError.js";
import { IGetUserAuthInfoRequest } from "../utils/Request.js";
import prisma from "../utils/Db.js";

export const authorizeJobSeeker = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role_id !== 1) {
      throw new ApiError(401, "Only JobSeekers can access ");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        jobSeeker: {
          select: {
            id: true,
            resume: true,
            education: true,
            experience: true,
            skills: true,
          },
        },
      },
    });
    if (!user) {
      throw new ApiError(404, "Job seeker not found");
    }
    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(400, error.message || "Unauthorized");
  }
};

export const authorizeCompany = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.user.role_id !== 2) {
      throw new ApiError(401, "Only Company can access ");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: req.user.id,
      },
      select: {
        id: true,
        username: true,
        email: true,
        company: {
          select: {
            id: true,
            company_name: true,
            description: true,
            website: true,
            location: true,
          },
        },
      },
    });
    if (!user) {
      throw new ApiError(404, "company not found");
    }
    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(400, error.message || "Unauthorized");
  }
};
