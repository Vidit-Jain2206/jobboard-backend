import { Request } from "express";

export interface IGetUserAuthInfoRequest extends Request {
  user: {
    id: number;
    username: string;
    email: string;
    role_id?: number;
    company?: any;
    jobSeeker?: any;
  };
}
