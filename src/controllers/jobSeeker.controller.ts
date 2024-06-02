import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../utils/Request.js";
import prisma from "../utils/Db.js";
import { uploadOnS3 } from "../utils/AWSS3Upload.js";
import { z } from "zod";
import {
  jobseekerLoginSchema,
  jobseekerRegisterSchema,
  jobseekerUpdateSchema,
} from "../schemas/jobseeker.js";
import { getUrl } from "../utils/AWSS3GetUrl.js";
import { deleteObj } from "../utils/AWSS3Delete.js";

export const loginJobSeeker = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    if (
      !jobseekerLoginSchema.parse({
        email,
        password,
      })
    ) {
      throw new ApiError(400, "Invalid credentials");
    }
    if (!email && !password) {
      throw new ApiError(400, "All fields are required");
    }
    const isUserExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!isUserExists) {
      throw new ApiError(400, "Invalid credentials");
    }
    const isPasswordMatch = bcryptjs.compare(
      password,
      isUserExists?.password || " "
    );
    if (!isPasswordMatch) {
      throw new ApiError(400, "Invalid credentials");
    }

    const payload = {
      id: isUserExists?.id,
    };
    if (!process.env.JWT_SECRET_ACCESS_TOKEN) {
      throw new ApiError(400, "JWT_SECRET_ACCESS_TOKEN is not set");
    }

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS_TOKEN || " ",
      {
        expiresIn: process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRY,
      }
    );

    const user = await prisma.user.findFirst({
      where: { email },
      include: { jobSeeker: true },
    });
    if (!user || !user.jobSeeker) {
      throw new ApiError(400, "Unable to find user");
    }

    const resumeLink = await getUrl({
      Key: user.jobSeeker.resume,
      ContentType: "application/pdf",
    });

    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(
        new ApiResponse(200, "User loggedin successfully", {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            jobSeeker: {
              id: user.jobSeeker.id,
              resume: resumeLink,
              experience: user.jobSeeker.experience,
              education: user.jobSeeker.education,
              skills: user.jobSeeker.skills,
            },
          },
          accessToken,
        })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
export const registerJobSeeker = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const { username, email, password, education, experience, skills } =
      req.body;

    console.log(skills);

    if (
      !jobseekerRegisterSchema.parse({
        username,
        email,
        password,
        education,
        experience,
        skills,
      })
    ) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (
      !username &&
      !email &&
      !password &&
      !education &&
      !experience &&
      !skills
    ) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (!req.file) {
      throw new ApiError(400, "File is required");
    }
    const s3Payload = {
      Key: `${email}/${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    await uploadOnS3(s3Payload);
    const resume = `${email}/${req.file?.originalname}`;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      throw new ApiError(400, "User already exists");
    }
    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: {
          connect: {
            id: 1,
          },
        },
      },
    });

    const jobseeker = await prisma.jobSeeker.create({
      data: {
        education,
        experience,
        skills,
        resume,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    if (!jobseeker) {
      throw new ApiError(400, "JobSeeker cannot be created");
    }
    const payload = {
      id: user.id,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS_TOKEN || "",
      {
        expiresIn: process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRY,
      }
    );

    const resumeLink = await getUrl({
      Key: jobseeker.resume,
      ContentType: "application/pdf",
    });

    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(
        new ApiResponse(200, "user registered successfully", {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            jobSeeker: {
              id: jobseeker.id,
              resume: resumeLink,
              experience: jobseeker.experience,
              education: jobseeker.education,
              skills: jobseeker.skills,
            },
          },
          accessToken,
        })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const logoutJobSeeker = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    return res
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, "Logout sucessfully", {}));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const getCurrentJobSeeker = (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    return res
      .status(200)
      .json(new ApiResponse(200, "Current User", { user: req.user }));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const updateJobSeekerAccountDetails = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { id } = req.params;
    const idSchema = z.string().min(1);
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "Id is required");
    }
    if (!id) {
      throw new ApiError(400, "Id is required");
    }
    const jobseekerexists = await prisma.jobSeeker.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!jobseekerexists) {
      throw new ApiError(400, "Id is invalid. No JobSeeker found");
    }
    if (jobseekerexists?.user_id !== req.user.id) {
      throw new ApiError(400, "You are not authorized to perform this action");
    }
    const { education, experience, skills } = req.body;

    if (!education && !experience && !skills) {
      throw new ApiError(400, "All fields are required");
    }

    if (!jobseekerUpdateSchema.parse({ education, experience, skills })) {
      throw new ApiError(400, "Invalid credentials");
    }

    if (!req.file) {
      throw new ApiError(400, "File is required");
    }

    await deleteObj({
      Key: jobseekerexists.resume,
      ContentType: "application/pdf",
    });

    const s3Payload = {
      Key: `${req.user.email}/${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };
    await uploadOnS3(s3Payload);
    const resume = `${req.user.email}/${req.file?.originalname}`;

    const updatedUser = await prisma.jobSeeker.update({
      where: {
        id: Number(id),
      },
      data: {
        resume,
        education,
        experience,
        skills,
      },
    });

    const resumeLink = await getUrl({
      Key: updatedUser.resume,
      ContentType: "application/pdf",
    });

    res.status(200).json(
      new ApiResponse(200, "User updated successfully", {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          jobSeeker: {
            id: updatedUser.id,
            resume: resumeLink,
            experience: updatedUser.experience,
            education: updatedUser.education,
            skills: updatedUser.skills,
          },
        },
      })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
