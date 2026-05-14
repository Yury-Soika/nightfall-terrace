import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User, UserRole } from '../entities/user.entity';

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
  ) {}

  async onModuleInit() {
    const adminEmail = process.env.ADMIN_EMAIL?.trim();
    const adminPassword = process.env.ADMIN_PASSWORD?.trim();

    if (!adminEmail || !adminPassword) {
      this.logger.warn(
        'ADMIN_EMAIL and ADMIN_PASSWORD are not both set — skipping admin seed. Add them to api/.env (see api/.env.example).',
      );
      return;
    }

    let admin = await this.users.findOne({ where: { email: adminEmail } });
    if (!admin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10);
      admin = await this.users.save(
        this.users.create({
          email: adminEmail,
          passwordHash,
          role: UserRole.admin,
        }),
      );
      this.logger.log(`Seeded admin user ${adminEmail}`);
    }
  }
}
