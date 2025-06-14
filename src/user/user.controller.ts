import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('Users')
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseInterceptors(ClassSerializerInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Get all users', description: 'Gets all users' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [UserResponseDto],
  })
  async findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single user by id', description: 'Get single user by id' })
  @ApiParam({ name: 'id', description: 'User ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async findById(@Param('id', UuidValidationPipe) id: string): Promise<UserResponseDto> {
    return this.userService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create user', description: 'Creates a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been created.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: "Update a user's password", description: "Updates a user's password by ID" })
  @ApiParam({ name: 'id', description: 'User ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The user has been updated.',
    type: UserResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 403,
    description: 'oldPassword is wrong',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async updatePassword(
    @Param('id', UuidValidationPipe) id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponseDto> {
    return this.userService.updatePassword(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete user', description: 'Deletes user by ID.' })
  @ApiParam({ name: 'id', description: 'User ID', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'The user has been deleted',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. userId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'User not found',
  })
  async delete(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    await this.userService.delete(id);
  }
}
