import { randomBytes, createHash } from "crypto";
import { Injectable } from "@nestjs/common";

@Injectable()
export class RefreshTokenGeneratorService {
  generate(): string {
    return randomBytes(48).toString("base64url");
  }

  hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }
}
