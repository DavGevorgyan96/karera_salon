import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async findAll(): Promise<Omit<User, 'passwordHash'>[]> {
    const users = await this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return users.map(({ passwordHash, ...user }) => user);
  }

  async create(data: any): Promise<Omit<User, 'passwordHash'>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        passwordHash: hashedPassword,
        role: data.role || 'MANAGER',
      },
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, data: any): Promise<Omit<User, 'passwordHash'>> {
    const updateData: any = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
    };

    if (data.password) {
      updateData.passwordHash = await bcrypt.hash(data.password, 10);
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
    });
    const { passwordHash, ...result } = user;
    return result;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
