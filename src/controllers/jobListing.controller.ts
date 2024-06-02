import prisma from "../utils/Db";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { NextFunction, Request, Response } from "express";
import { IGetUserAuthInfoRequest } from "../utils/Request.js";
import { jobListingCreate } from "../schemas/joblisting";
import { z } from "zod";

export const getAllListings = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const listings = await prisma.jobListing.findMany({
      include: { company: true },
    });
    res.status(200).json(
      new ApiResponse(200, "Listings fetched successfully", {
        listings,
      })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const createListing = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const {
      title,
      description,
      skills_required,
      salary,
      experience,
      startDate,
      location,
    } = req.body;
    if (
      !title &&
      !description &&
      !skills_required &&
      !salary &&
      !experience &&
      !startDate &&
      !location
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const startDate_inForm = new Date(req.body.startDate);

    if (
      !jobListingCreate.parse({
        title,
        description,
        skills_required,
        salary,
        experience,
        startDate: startDate_inForm,
        location,
      })
    ) {
      throw new ApiError(400, "Invalid credentials");
    }

    const companyid = req.user?.company?.id;
    const company = await prisma.company.findFirst({
      where: {
        id: companyid,
      },
    });
    if (!company) {
      throw new ApiError(400, "Company not found");
    }

    const listing = await prisma.jobListing.create({
      data: {
        title,
        description,
        skills_required,
        salary,
        experience,
        startDate,
        location,
        company: {
          connect: {
            id: company?.id,
          },
        },
      },
      include: {
        company: true,
      },
    });
    if (!listing) {
      throw new ApiError(400, "Listing can not created");
    }
    res.status(200).json(new ApiResponse(200, "Lisitng created", { listing }));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const getListing = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const { id } = req.params;
    const listingId = Number(id);
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
    const idSchema = z.string();
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Invalid Id");
    }

    const listing = await prisma.jobListing.findUnique({
      where: { id: listingId },
      include: {
        company: true,
      },
    });
    if (!listing) {
      throw new ApiError(400, "Listing not found");
    }
    res
      .status(200)
      .json(new ApiResponse(200, "Listing fetched successfully", { listing }));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const updateListing = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const listingId = Number(id);
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
    const idSchema = z.string();
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Invalid Id");
    }

    const {
      title,
      description,
      skills_required,
      salary,
      experience,
      startDate,
      location,
    } = req.body;
    if (
      !title &&
      !description &&
      !skills_required &&
      !salary &&
      !experience &&
      !startDate &&
      !location
    ) {
      throw new ApiError(400, "All fields are required");
    }

    const startDate_inForm = new Date(req.body.startDate);

    if (
      !jobListingCreate.parse({
        title,
        description,
        skills_required,
        salary,
        experience,
        startDate: startDate_inForm,
        location,
      })
    ) {
      throw new ApiError(400, "Invalid credentials");
    }
    const companyid = req.user.company.id;
    const company = await prisma.company.findFirst({
      where: {
        id: companyid,
      },
    });
    if (!company) {
      throw new ApiError(400, "Company not found");
    }

    const listing = await prisma.jobListing.findFirst({
      where: {
        id: listingId,
      },
    });
    if (listing?.company_id !== companyid) {
      throw new ApiError(400, "You are not authorize to update this listing");
    }
    const updatedListing = await prisma.jobListing.update({
      where: {
        id: listingId,
      },
      data: {
        title,
        description,
        skills_required,
        salary,
        experience,
        startDate,
        location,
      },
      include: {
        company: true,
      },
    });
    if (!updateListing) {
      throw new ApiError(400, "Listing can not be  updated");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Listing updated", { listing: updatedListing })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const deleteListing = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const listingId = Number(id);
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
    const idSchema = z.string();
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Invalid Id");
    }
    const listing = await prisma.jobListing.findFirst({
      where: {
        id: listingId,
      },
      include: {
        company: true,
      },
    });
    if (!listing) {
      throw new ApiError(400, "Listing not found");
    }
    const companyid = req.user.company.id;
    const company = await prisma.company.findFirst({
      where: {
        id: companyid,
      },
    });
    if (!company) {
      throw new ApiError(400, "Company not found");
    }
    if (listing?.company.id !== company?.id) {
      throw new ApiError(400, "You are not authorize to delete this listing");
    }

    const deletedListing = await prisma.jobListing.delete({
      where: {
        id: listingId,
      },
    });

    if (!deletedListing) {
      throw new ApiError(400, "Listing cannot be deleted");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, "Listing deleted", { listing: deletedListing })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const getAllMyJobListings = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const listings = await prisma.jobListing.findMany({
      where: { company_id: req.user.company.id },
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
        jobApplication: {
          select: {
            jobSeeker: true,
          },
        },
      },
    });
    if (!listings) {
      throw new ApiError(400, "Listing not found");
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, "Listings fetched successfully", { listings })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
