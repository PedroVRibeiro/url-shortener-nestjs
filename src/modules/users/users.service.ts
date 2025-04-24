import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { RequestUserDto } from './dtos/request-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dtos/update-user.dto';

export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(createUserDto: RequestUserDto): Promise<UserEntity> {
    const { email } = createUserDto;

    const userExists = await this.usersRepository.findOne({
      where: { email, deleted_at: undefined },
    });

    if (userExists) {
      throw new BadRequestException(
        'There is already a registered user with the given email',
      );
    }

    const newUser = this.usersRepository.create(createUserDto);

    return await this.usersRepository.save(newUser);
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.usersRepository.find({
      where: { deleted_at: IsNull() },
    });

    if (!users) {
      throw new NotFoundException('There are no users registered');
    }

    return users;
  }

  async findById(id: string): Promise<UserEntity> {
    const userExists = await this.usersRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });

    if (!userExists) {
      throw new NotFoundException(
        'There is no registered user with the given id',
      );
    }

    return userExists;
  }

  async findByEmail(email: string): Promise<UserEntity> {
    const userExists = await this.usersRepository.findOne({
      where: { email, deleted_at: IsNull() },
    });

    if (!userExists) {
      throw new NotFoundException(
        'There is no registered user with the given email',
      );
    }

    return userExists;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const { email } = updateUserDto;

    const userExists = await this.usersRepository.findOne({
      where: { id, deleted_at: IsNull() },
    });
    if (!userExists) {
      throw new NotFoundException(
        'There is no registered user with the given id',
      );
    }

    if (email) {
      const emailAlreadyRegistered = await this.usersRepository.findOne({
        where: { email: email, id: Not(id) },
      });
      if (emailAlreadyRegistered) {
        throw new BadRequestException(
          'There is already a registered user with the given email',
        );
      }
    }

    Object.assign(userExists, updateUserDto);
    return this.usersRepository.save(userExists);
  }

  async remove(id: string) {
    const userExists = await this.findById(id);

    if (!userExists) {
      throw new NotFoundException(
        'There is no registered user with the given id',
      );
    }

    await this.usersRepository.save({
      id: userExists.id,
      deleted_at: new Date(),
    });

    return { message: 'The user was deleted' };
  }
}
