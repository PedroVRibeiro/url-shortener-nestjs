import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ResponseUserDTO } from './dtos/response-user.dto';
import { RequestUserDto } from './dtos/request-user.dto';
import { UserEntity } from './entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dtos/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

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
  async create(
    @Body() createUserDto: RequestUserDto,
  ): Promise<ResponseUserDTO> {
    const createdUser = await this.usersService.create(createUserDto);

    return new ResponseUserDTO(createdUser);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users returned',
    type: [UserEntity],
  })
  @Get()
  async findAll(): Promise<ResponseUserDTO[]> {
    const allUsers = await this.usersService.findAll();

    return allUsers.map((user: UserEntity) => new ResponseUserDTO(user));
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Get(':id')
  async findOneById(@Param('id') id: string): Promise<ResponseUserDTO> {
    const user = await this.usersService.findById(id);

    return new ResponseUserDTO(user);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Get a user by its email' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Get('email/:email')
  async findOneByEmail(
    @Param('email') email: string,
  ): Promise<ResponseUserDTO> {
    const user = await this.usersService.findByEmail(email);

    return new ResponseUserDTO(user);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({ summary: 'Update a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User updated',
    type: UserEntity,
  })
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    return await this.usersService.update(id, updateUserDto);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'))
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
