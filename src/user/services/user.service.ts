import { Injectable, NotFoundException, ForbiddenException, ConflictException, Logger } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { PasswordService, ERROR_MESSAGES, getEntityNotFoundMessage, getEntitySuccessMessage } from '../../common';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdatePasswordDto } from '../dto/update-password.dto';
import { UserResponseDto } from '../dto/user-response.dto';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordService: PasswordService,
  ) {}

  async findAll(): Promise<UserResponseDto[]> {
    this.logger.log('Fetching all users');
    const users = await this.userRepository.findAll();
    this.logger.log(`Found ${users.length} users`);
    return users.map(user => new UserResponseDto(user));
  }

  async findById(id: string): Promise<UserResponseDto> {
    this.logger.log(`Fetching user with id: ${id}`);
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(getEntityNotFoundMessage('User', id));
      throw new NotFoundException(getEntityNotFoundMessage('User', id));
    }
    this.logger.log(`Found user with id: ${id}`);
    return new UserResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    this.logger.log(`Creating new user with login: ${createUserDto.login}`);
    
    const existingUser = await this.userRepository.findByLogin(createUserDto.login);
    if (existingUser) {
      this.logger.warn(`User with login ${createUserDto.login} already exists`);
      throw new ConflictException(ERROR_MESSAGES.USER_ALREADY_EXISTS);
    }

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);
    const now = Date.now();

    const userData: Omit<User, 'id'> = {
      login: createUserDto.login,
      password: hashedPassword,
      version: 1,
      createdAt: now,
      updatedAt: now,
    };

    const user = await this.userRepository.create(userData);
    this.logger.log(getEntitySuccessMessage('User', 'created', user.id));
    return new UserResponseDto(user);
  }

  async updatePassword(id: string, updatePasswordDto: UpdatePasswordDto): Promise<UserResponseDto> {
    this.logger.log(`Updating password for user with id: ${id}`);
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      this.logger.warn(getEntityNotFoundMessage('User', id));
      throw new NotFoundException(getEntityNotFoundMessage('User', id));
    }

    const isPasswordValid = await this.passwordService.verifyPassword(
      updatePasswordDto.oldPassword,
      user.password,
    );

    if (!isPasswordValid) {
      this.logger.warn(`Invalid password attempt for user with id: ${id}`);
      throw new ForbiddenException(ERROR_MESSAGES.WRONG_PASSWORD);
    }

    const hashedNewPassword = await this.passwordService.hashPassword(updatePasswordDto.newPassword);
    
    const updatedUser = await this.userRepository.update(id, {
      password: hashedNewPassword,
      version: user.version + 1,
      updatedAt: Date.now(),
    });

    if (!updatedUser) {
      this.logger.error(`Failed to update user with id: ${id}`);
      throw new NotFoundException(getEntityNotFoundMessage('User', id));
    }

    this.logger.log(`Password updated successfully for user with id: ${id}`);
    return new UserResponseDto(updatedUser);
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting user with id: ${id}`);
    
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      this.logger.warn(getEntityNotFoundMessage('User', id));
      throw new NotFoundException(getEntityNotFoundMessage('User', id));
    }
    
    this.logger.log(getEntitySuccessMessage('User', 'deleted', id));
  }
}