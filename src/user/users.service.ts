import { Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.input';
import { UpdateUserDTO } from './dto/update-user.input';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async create(createUserDTO: CreateUserDTO): Promise<User> {
    const hashedPassword = await this.hashPassword(createUserDTO.password);
    return this.usersRepository.create({
      name: createUserDTO.name,
      email: createUserDTO.email,
      password: hashedPassword,
    });
  }

  findAll() {
    return this.usersRepository.findAll();
  }

  findOne(id: string): Promise<User | null> {
    return this.usersRepository.findOne({
      _id: new mongoose.Types.ObjectId(id),
    });
  }

  async findsByIds(ids: string[]): Promise<User[]> {
    return this.usersRepository.findAll({
      _id: { $in: ids.map((id) => new mongoose.Types.ObjectId(id)) },
    });
  }

  async update(id: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
    if (updateUserDTO.password) {
      updateUserDTO.password = await this.hashPassword(updateUserDTO.password);
    }
    return await this.usersRepository.findByIdAndUpdate(id, {
      ...updateUserDTO,
    });
  }

  async delete(id: string): Promise<User | null> {
    return this.usersRepository.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(id),
    });
  }

  async count() {
    return await this.usersRepository.count();
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      email,
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return null;
    }

    return user;
  }

  async search(nameQuery: string, CurrentUserId: string) {
    return this.usersRepository.findAll({
      $and: [
        {
          name: {
            $regex: nameQuery,
            $options: 'i',
          },
        },
        {
          _id: {
            $ne: new mongoose.Types.ObjectId(CurrentUserId),
          },
        },
      ],
    });
  }
}
