import { IGetUserAuthInfoRequest } from "../utils/Request";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { z } from "zod";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import prisma from "../utils/Db";
import {
  companyLoginSchema,
  companyRegisterSchema,
  updateCompanyDetailsSchema,
} from "../schemas/company";

export const loginCompany = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const { email, password } = req.body;
    if (!email && !password) {
      throw new ApiError(400, "All fields are required");
    }

    if (!companyLoginSchema.parse({ email, password })) {
      throw new ApiError(400, "Invalid credentials");
    }

    const isUserExists = await prisma.user.findUnique({
      where: { email },
    });
    if (!isUserExists) {
      throw new ApiError(400, "Invalid Email");
    }
    const isPasswordMatch = await bcryptjs.compare(
      password,
      isUserExists.password
    );
    if (!isPasswordMatch) {
      throw new ApiError(400, "Password is incorrect");
    }
    const payload = {
      id: isUserExists.id,
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_SECRET_ACCESS_TOKEN || " ",
      {
        expiresIn: process.env.JWT_SECRET_ACCESS_TOKEN_EXPIRY,
      }
    );
    const user = await prisma.user.findFirst({
      where: { email },
      include: { company: true },
    });
    if (!user) {
      throw new ApiError(400, "Unable to find user");
    }
    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(
        new ApiResponse(200, "Company successfully loggedin", {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            company: {
              id: user.company?.id,
              company_name: user.company?.company_name,
              description: user.company?.description,
              website: user.company?.website,
              location: user.company?.location,
            },
          },
          accessToken,
        })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const registerCompany = async (
  req: IGetUserAuthInfoRequest | Request,
  res: Response
) => {
  try {
    const {
      username,
      email,
      password,
      company_name,
      description,
      website,
      location,
    } = req.body;

    if (!username && !email && !password) {
      throw new ApiError(400, "All fields are required");
    }

    if (
      !companyRegisterSchema.parse({
        username,
        email,
        password,
        company_name,
        description,
        website,
        location,
      })
    ) {
      throw new ApiError(400, "invalid credentials");
    }

    const userExist = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });
    if (userExist) {
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
            id: 2,
          },
        },
      },
    });
    if (!user) {
      throw new ApiError(400, "User cannot be registered");
    }

    const company = await prisma.company.create({
      data: {
        company_name,
        description,
        website,
        location,
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    if (!company) {
      throw new ApiError(400, "Company cannot be created");
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

    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .json(
        new ApiResponse(200, "Company successfully registered", {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            company: {
              id: company.id,
              company_name: company.company_name,
              description: company.description,
              website: company.website,
              location: company.location,
            },
          },
          accessToken,
        })
      );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const logoutCompany = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const options = {
      httpOnly: true,
      secure: true,
      sameSight: "strict",
    };
    res
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, "Logout sucessfully", {}));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const getCurrentCompany = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    res
      .status(200)
      .json(new ApiResponse(200, "Current User", { user: req.user }));
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};

export const updateCompanyDetails = async (
  req: IGetUserAuthInfoRequest,
  res: Response
) => {
  try {
    const { company_name, description, website, location } = req.body;
    const { id } = req.params;
    if (
      !updateCompanyDetailsSchema.parse({
        company_name,
        description,
        website,
        location,
      })
    ) {
      throw new ApiError(400, "invalid credentials");
    }
    const idSchema = z.string().min(1);
    if (!idSchema.parse(id)) {
      throw new ApiError(400, "invalid credentials");
    }
    const iscompany = await prisma.company.findFirst({
      where: {
        id: Number(id),
      },
    });
    if (!iscompany) {
      throw new ApiError(400, "Company cannot be found");
    }

    if (iscompany.user_id !== req.user.id) {
      throw new ApiError(400, "You are not authorized to update this company");
    }
    const company = await prisma.company.update({
      where: { id: Number(id) },
      data: {
        company_name,
        description,
        website,
        location,
      },
    });
    if (!company) {
      throw new ApiError(400, "Company cannot be updated");
    }
    res.status(200).json(
      new ApiResponse(200, "User updated successfully", {
        user: {
          id: req.user.id,
          username: req.user.username,
          email: req.user.email,
          company: {
            id: company.id,
            company_name: company.company_name,
            description: company.description,
            website: company.website,
            location: company.location,
          },
        },
      })
    );
  } catch (error: any) {
    throw new ApiError(error.statusCode, error.message);
  }
};
