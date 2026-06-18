import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";

@Injectable()
export class PasswordHashingService {
  private readonly saltRounds = 12;

  hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  compare(value: string, hash: string): Promise<boolean> {
    return bcrypt.compare(value, hash);
  }
}
