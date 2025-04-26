import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { RequestUserDto } from './dtos/request-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entities/user.entity';
import { ResponseUserDTO } from './dtos/response-user.dto';

jest.mock('src/common/helpers/auth.helpers', () => ({
  assertIsSelfOrAdmin: jest.fn(),
}));

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findById: jest.fn(),
            findByEmail: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const createUserDto: RequestUserDto = {
        email: 'test@example.com',
        password: 'defaults',
        role: 'USER',
      };

      const user = { id: '1', ...createUserDto } as UserEntity;

      usersService.create.mockResolvedValueOnce(user);

      const result = await usersController.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(new ResponseUserDTO(user));
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users = [
        { id: '1', email: 'test1@example.com' },
        { id: '2', email: 'test2@example.com' },
      ] as UserEntity[];

      usersService.findAll.mockResolvedValueOnce(users);

      const mockReq = { user: { userId: '1', role: 'ADMIN' } } as any;

      const result = await usersController.findAll(mockReq);

      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(users.map((user) => new ResponseUserDTO(user)));
    });
  });

  describe('findOneById', () => {
    it('should return a user by id', async () => {
      const user = { id: '1', email: 'test@example.com' } as UserEntity;

      usersService.findById.mockResolvedValueOnce(user);

      const mockReq = { user: { userId: '1', role: 'ADMIN' } } as any;

      const result = await usersController.findOneById({ id: '1' }, mockReq);

      expect(usersService.findById).toHaveBeenCalledWith('1');
      expect(result).toEqual(new ResponseUserDTO(user));
    });
  });

  describe('findOneByEmail', () => {
    it('should return a user by email', async () => {
      const user = { id: '1', email: 'test@example.com' } as UserEntity;

      usersService.findByEmail.mockResolvedValueOnce(user);

      const mockReq = { user: { userId: '1', role: 'ADMIN' } } as any;

      const result = await usersController.findOneByEmail(
        'test@example.com',
        mockReq,
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(result).toEqual(new ResponseUserDTO(user));
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const updateUserDto: UpdateUserDto = { email: 'updated@example.com' };
      const updatedUser = { id: '1', email: 'updated@example.com' } as any;

      usersService.update.mockResolvedValueOnce(updatedUser);

      const mockReq = { user: { userId: '1', role: 'USER' } } as any;

      const result = await usersController.update(
        { id: '1' },
        updateUserDto,
        mockReq,
      );

      expect(usersService.update).toHaveBeenCalledWith('1', updateUserDto);
      expect(result).toEqual(updatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const mockMessage = { message: 'User deleted' };

      usersService.remove.mockResolvedValueOnce(mockMessage);

      const mockReq = { user: { userId: '1', role: 'USER' } } as any;

      const result = await usersController.remove({ id: '1' }, mockReq);

      expect(usersService.remove).toHaveBeenCalledWith('1');
      expect(result).toEqual(mockMessage);
    });
  });
});
