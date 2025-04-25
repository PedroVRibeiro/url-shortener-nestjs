import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
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
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ParamIdDto } from './dtos/param-id.dto';
import { assertIsSelfOrAdmin } from 'src/common/helpers/auth.helpers';

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
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Users returned',
    type: [UserEntity],
  })
  @Roles('ADMIN')
  @Get()
  async findAll(
    @Req() _req: Request & { user: { userId: string; role: string } },
  ): Promise<ResponseUserDTO[]> {
    const allUsers = await this.usersService.findAll();

    return allUsers.map((user: UserEntity) => new ResponseUserDTO(user));
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get a user by its id' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Roles('ADMIN')
  @Get(':id')
  async findOneById(
    @Param() params: ParamIdDto,
    @Req() req: Request & { user: { userId: string; role: string } },
  ): Promise<ResponseUserDTO> {
    const { id } = params;

    assertIsSelfOrAdmin(req.user, id);

    const user = await this.usersService.findById(id);

    return new ResponseUserDTO(user);
  }

  @ApiBearerAuth('jwt')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiOperation({ summary: 'Get a user by its email' })
  @ApiResponse({
    status: 200,
    description: 'User returned',
    type: UserEntity,
  })
  @Roles('ADMIN')
  @Get('email/:email')
  async findOneByEmail(
    @Param('email') email: string,
    @Req() req: Request & { user: { userId: string; role: string } },
  ): Promise<ResponseUserDTO> {
    assertIsSelfOrAdmin(req.user, req.user.userId);

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
    @Param() params: ParamIdDto,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: Request & { user: { userId: string; role: string } },
  ): Promise<UpdateUserDto> {
    const { id } = params;

    assertIsSelfOrAdmin(req.user, id);

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
  async remove(
    @Param() params: ParamIdDto,
    @Req() req: Request & { user: { userId: string; role: string } },
  ) {
    const { id } = params;

    assertIsSelfOrAdmin(req.user, id);

    return await this.usersService.remove(id);
  }
}
