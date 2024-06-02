import { NextFunction, Request, Response } from "express";
import prisma from "../utils/Db";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { IGetUserAuthInfoRequest } from "../utils/Request.js";
import { z } from "zod";

export const getAllMyJobApplications = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const applications = await prisma.jobApplication.findMany({
      where: { jobSeeker_id: req.user.jobSeeker.id },
      include: {
        jobSeeker: {
          select: {
            id: true,
            resume: true,
            education: true,
            experience: true,
            skills: true,
          },
        },
        jobListing: {
          select: {
            id: true,
            title: true,
            description: true,
            skills_required: true,
            salary: true,
            experience: true,
            startDate: true,
            createdAt: true,
            location: true,
            company: {
              select: {
                id: true,
                company_name: true,
                location: true,
                website: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!applications) {
      throw new ApiError(404, "Applications not found");
    }
    res.status(200).json(
      new ApiResponse(200, "Applications fetched successfully", {
        applications,
      })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const createJobApplication = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const listingId = Number(id);
    const idSchema = z.string();
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Invalid Id");
    }
    const listing = await prisma.jobListing.findFirst({
      where: { id: listingId },
    });
    if (!listing) {
      throw new ApiError(400, "Listing not found");
    }
    const user = await prisma.user.findFirst({ where: { id: req.user.id } });
    if (!user) {
      throw new ApiError(400, "User not found");
    }
    const isApplicationExist = await prisma.jobApplication.findFirst({
      where: {
        AND: {
          jobSeeker: {
            id: req.user.jobSeeker.id,
          },
          jobListing: {
            id: listingId,
          },
        },
      },
    });

    if (isApplicationExist) {
      throw new ApiError(400, "Application already exists");
    }

    const application = await prisma.jobApplication.create({
      data: {
        jobSeeker: {
          connect: {
            id: req.user.jobSeeker.id,
          },
        },
        jobListing: {
          connect: {
            id: listingId,
          },
        },
      },
      include: {
        jobSeeker: {
          select: {
            id: true,
            resume: true,
            education: true,
            experience: true,
            skills: true,
          },
        },
        jobListing: true,
      },
    });
    if (!application) {
      throw new ApiError(400, "Application can not be created");
    }

    res.json(
      new ApiResponse(200, "Application created successfully", { application })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const getJobApplication = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new ApiError(400, "id is required");
    }
    const idSchema = z.string();
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Invalid Id");
    }
    const applicationId = Number(id);

    const application = await prisma.jobApplication.findFirst({
      where: { id: applicationId },
      select: {
        jobSeeker: {
          select: {
            id: true,
            resume: true,
            education: true,
            experience: true,
            skills: true,
          },
        },
        jobListing: {
          select: {
            id: true,
            title: true,
            description: true,
            skills_required: true,
            salary: true,
            experience: true,
            startDate: true,
            location: true,
            company: {
              select: {
                id: true,
                company_name: true,
                location: true,
                website: true,
                description: true,
              },
            },
          },
        },
      },
    });
    if (!application) {
      throw new ApiError(404, "Application not found");
    }
    res.status(200).json(
      new ApiResponse(200, "Application fetched successfully", {
        application,
      })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
