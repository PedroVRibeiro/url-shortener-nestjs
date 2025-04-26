import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { RequestUserDto } from './dtos/request-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            findOne: jest.fn(),
            find: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
  });

  describe('create', () => {
    it('should create a new user successfully', async () => {
      const createUserDto: RequestUserDto = {
        email: 'test@example.com',
        password: 'defaults',
        role: 'ADMIN',
      };

      usersRepository.findOne.mockResolvedValueOnce(null);
      usersRepository.create.mockReturnValueOnce({
        ...createUserDto,
      } as UserEntity);
      usersRepository.save.mockResolvedValueOnce({
        id: '1',
        ...createUserDto,
      } as UserEntity);

      const result = await usersService.create(createUserDto);

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email, deleted_at: IsNull() },
      });
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({ email: createUserDto.email }),
      );
    });

    it('should throw BadRequestException if email already exists', async () => {
      usersRepository.findOne.mockResolvedValueOnce({ id: '1' } as UserEntity);

      await expect(
        usersService.create({
          email: 'test@example.com',
          password: 'defaults',
          role: 'USER',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: '1', email: 'test@example.com' } as UserEntity];
      usersRepository.find.mockResolvedValueOnce(users);

      const result = await usersService.findAll();

      expect(result).toEqual(users);
    });

    it('should throw NotFoundException if no users are found', async () => {
      usersRepository.find.mockResolvedValueOnce([]);

      await expect(usersService.findAll()).rejects.toThrow(NotFoundException);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@example.com' } as UserEntity;
      usersRepository.findOne.mockResolvedValueOnce(user);

      const result = await usersService.findById('1');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepository.findOne.mockResolvedValueOnce(null);

      await expect(usersService.findById('1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@example.com' } as UserEntity;
      usersRepository.findOne.mockResolvedValueOnce(user);

      const result = await usersService.findByEmail('test@example.com');

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException if user not found by email', async () => {
      usersRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        usersService.findByEmail('test@example.com'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const user = { id: '1', email: 'old@example.com' } as UserEntity;

      usersRepository.findOne.mockResolvedValueOnce(user);
      usersRepository.findOne.mockResolvedValueOnce(null);
      usersRepository.save.mockResolvedValueOnce({
        id: '1',
        ...updateUserDto,
      } as UserEntity);

      const result = await usersService.update('1', updateUserDto);

      expect(result).toEqual(
        expect.objectContaining({ email: updateUserDto.email }),
      );
    });

    it('should throw NotFoundException if user not found', async () => {
      usersRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        usersService.update('1', { email: 'updated@example.com' }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if email already exists', async () => {
      const user = { id: '1', email: 'old@example.com' } as UserEntity;
      const anotherUser = {
        id: '2',
        email: 'updated@example.com',
      } as UserEntity;

      usersRepository.findOne.mockResolvedValueOnce(user);
      usersRepository.findOne.mockResolvedValueOnce(anotherUser);
      await expect(
        usersService.update('1', { email: 'updated@example.com' }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should hash password if updating password', async () => {
      const user = { id: '1', email: 'old@example.com' } as UserEntity;
      const updateUserDto: UpdateUserDto = { password: 'newpassword' };

      usersRepository.findOne.mockResolvedValueOnce(user);
      usersRepository.save.mockResolvedValueOnce({
        id: '1',
        email: 'old@example.com',
        password: 'hashedPassword',
      } as UserEntity);

      const result = await usersService.update('1', updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newpassword', 10);
      expect(result).toEqual(
        expect.objectContaining({ password: 'hashedPassword' }),
      );
    });
  });

  describe('remove', () => {
    it('should soft delete a user', async () => {
      const user = { id: '1', email: 'test@example.com' } as UserEntity;
      jest.spyOn(usersService, 'findById').mockResolvedValueOnce(user);

      usersRepository.save.mockResolvedValueOnce({
        id: '1',
        deleted_at: new Date(),
      } as UserEntity);

      const result = await usersService.remove('1');

      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(usersRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ id: '1' }),
      );
      expect(result).toEqual({ message: 'The user was deleted' });
    });

    it('should throw NotFoundException if user not found on remove', async () => {
      jest
        .spyOn(usersService, 'findById')
        .mockRejectedValueOnce(
          new NotFoundException(
            'There is no registered user with the given id',
          ),
        );

      await expect(usersService.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
