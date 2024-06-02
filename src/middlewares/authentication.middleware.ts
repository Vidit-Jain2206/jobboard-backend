import { NextFunction } from "express";

import { ApiError } from "../utils/ApiError";

import jwt from "jsonwebtoken";
import { IGetUserAuthInfoRequest } from "../utils/Request";
import prisma from "../utils/Db";

export const verifyJWT = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("authrization")?.replace("Bearer ", "");

    if (!token) {
      throw new ApiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET_ACCESS_TOKEN || " "
    ) as { id: string };

    if (!decodedToken?.id) {
      throw new ApiError(401, "Invalid access token");
    }

    const user = await prisma.user.findUnique({
      where: { id: Number(decodedToken?.id) },
      select: {
        id: true,
        username: true,
        email: true,
        role_id: true,
      },
    });
    if (!user) {
      throw new ApiError(401, "Invalid access token");
    }
    req.user = user;
    next();
  } catch (error: any) {
    throw new ApiError(500, error?.message || "Invalid Access Token");
  }
};
