import { Request } from "express"
import { Profile } from "src/model";

export interface ProfileRequest extends Request {
  profile: Profile;
}