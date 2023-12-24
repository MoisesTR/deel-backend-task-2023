import { NextFunction, Response } from "express";
import { Profile } from "../model"
import { ProfileRequest } from "src/types/request";

export const getProfile = async (
  req: ProfileRequest,
  res: Response,
  next: NextFunction
) => {
  const id = req.get("profile_id") ?? 0;
  const profile = await Profile.findOne({ where: { id } })
  if (!profile) return res.status(401).end();
  req.profile = profile;
  return next();
};
