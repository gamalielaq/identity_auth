import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { IsNull, Repository } from "typeorm";
import { RefreshToken } from "./entities/refresh-token.entity";
import { Session } from "./entities/session.entity";

@Injectable()
export class SessionsService {
  constructor(
    @InjectRepository(Session)
    private readonly sessionsRepository: Repository<Session>,
    @InjectRepository(RefreshToken)
    private readonly refreshTokensRepository: Repository<RefreshToken>,
  ) {}

  findActive(): Promise<Session[]> {
    return this.sessionsRepository.find({
      where: { revokedAt: IsNull() },
      relations: { user: true, application: true },
      order: { createdAt: "DESC" },
    });
  }

  async revoke(id: string): Promise<Session> {
    const session = await this.sessionsRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Session with id ${id} was not found`);
    }

    session.revokedAt = new Date();
    await this.sessionsRepository.save(session);
    await this.refreshTokensRepository.update(
      { id: session.refreshTokenId, revokedAt: IsNull() },
      { revokedAt: session.revokedAt },
    );

    return session;
  }
}
