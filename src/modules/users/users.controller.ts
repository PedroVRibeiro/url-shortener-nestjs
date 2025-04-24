import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDTO } from './dtos/response-user.dto';
import { RequestUserDto } from './dtos/request-user.dto';
import { UserEntity } from './entities/user.entity';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';

@ApiTags('USERS')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User successfully created',
    type: UserEntity,
  })
  @Post()
  async create(@Body() createUserDto: RequestUserDto) {
    const createdUser = await this.usersService.create(createUserDto);

    return new ResponseUserDTO(createdUser);
  }

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users returned',
    type: [UserEntity],
  })
  @Get()
  async findAll() {
    const allUsers = await this.usersService.findAll();

    return allUsers.map((user: UserEntity) => new ResponseUserDTO(user));
  }

  @ApiOperation({ summary: 'Get a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Get(':id')
  async findOneById(@Param('id') id: string) {
    const user = await this.usersService.findById(id);

    return new ResponseUserDTO(user);
  }

  @ApiOperation({ summary: 'Get a user by its email' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Get('email/:email')
  async findOneByEmail(@Param('email') email: string) {
    const user = await this.usersService.findByEmail(email);

    return new ResponseUserDTO(user);
  }

  @ApiOperation({ summary: 'Update a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserEntity,
  })
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User deleted',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'User deleted',
        },
      },
    },
  })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
