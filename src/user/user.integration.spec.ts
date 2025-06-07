import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaTestService } from '../prisma/prisma-test.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from './user.module';
import { UserService } from './services/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { PasswordService } from '../common/services/password.service';
import configuration from '../config/configuration';

describe('User Integration Tests', () => {
  let app: INestApplication;
  let userService: UserService;
  let prismaService: PrismaTestService;
  let passwordService: PasswordService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [configuration],
          isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        PrismaModule,
        CommonModule,
        UserModule,
      ],
    })
      .overrideProvider(PrismaService)
      .useClass(PrismaTestService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    userService = moduleFixture.get<UserService>(UserService);
    prismaService = moduleFixture.get<PrismaTestService>(PrismaService);
    passwordService = moduleFixture.get<PasswordService>(PasswordService);
  });

  beforeEach(async () => {
    // Clean the database before each test
    await prismaService.cleanDatabase();
  });

  afterAll(async () => {
    // Clean up and close connections
    await prismaService.$disconnect();
    await app.close();
  });

  describe('User CRUD Operations', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'testuser',
        password: 'testpassword123',
      };

      const result = await userService.create(createUserDto);

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.login).toBe(createUserDto.login);
      expect(result.version).toBe(1);
      expect(result.createdAt).toBeDefined();
      expect(result.updatedAt).toBeDefined();
      // Note: Password exclusion is handled by UserResponseDto and class-transformer at controller level
      expect(result.id).toBeDefined();
      expect(typeof result.id).toBe('string');
    });

    it('should find all users', async () => {
      // Create test users
      const user1: CreateUserDto = { login: 'user1', password: 'pass1' };
      const user2: CreateUserDto = { login: 'user2', password: 'pass2' };

      await userService.create(user1);
      await userService.create(user2);

      const result = await userService.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].login).toBeDefined();
      expect(result[1].login).toBeDefined();
      expect(result[0].id).toBeDefined();
      expect(result[1].id).toBeDefined();
    });

    it('should find user by id', async () => {
      const createUserDto: CreateUserDto = {
        login: 'findtest',
        password: 'findpass',
      };

      const created = await userService.create(createUserDto);
      const result = await userService.findById(created.id);

      expect(result).toBeDefined();
      expect(result.id).toBe(created.id);
      expect(result.login).toBe(createUserDto.login);
      expect(result.version).toBe(1);
    });

    it('should throw NotFoundException for non-existent user', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      await expect(userService.findById(nonExistentId)).rejects.toThrow();
    });

    it('should update user password', async () => {
      const createUserDto: CreateUserDto = {
        login: 'updatetest',
        password: 'oldpassword',
      };

      const created = await userService.create(createUserDto);

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'oldpassword',
        newPassword: 'newpassword123',
      };

      const result = await userService.updatePassword(created.id, updatePasswordDto);

      expect(result).toBeDefined();
      expect(result.version).toBe(2); // Version should increment
      expect(result.updatedAt).toBeGreaterThan(result.createdAt);
      expect(result.login).toBe(created.login);
    });

    it('should throw ForbiddenException for wrong old password', async () => {
      const createUserDto: CreateUserDto = {
        login: 'wrongpasstest',
        password: 'correctpassword',
      };

      const created = await userService.create(createUserDto);

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'wrongpassword',
        newPassword: 'newpassword',
      };

      await expect(userService.updatePassword(created.id, updatePasswordDto)).rejects.toThrow();
    });

    it('should delete user', async () => {
      const createUserDto: CreateUserDto = {
        login: 'deletetest',
        password: 'deletepass',
      };

      const created = await userService.create(createUserDto);

      await userService.delete(created.id);

      // Verify user is deleted
      await expect(userService.findById(created.id)).rejects.toThrow();
    });

    it('should throw NotFoundException when deleting non-existent user', async () => {
      const nonExistentId = '550e8400-e29b-41d4-a716-446655440000';

      await expect(userService.delete(nonExistentId)).rejects.toThrow();
    });
  });

  describe('User Validation', () => {
    it('should throw ConflictException for duplicate login', async () => {
      const createUserDto: CreateUserDto = {
        login: 'duplicatetest',
        password: 'password123',
      };

      await userService.create(createUserDto);

      // Try to create another user with same login
      await expect(userService.create(createUserDto)).rejects.toThrow();
    });
  });

  describe('Password Security', () => {
    it('should hash passwords properly', async () => {
      const createUserDto: CreateUserDto = {
        login: 'hashtest',
        password: 'plaintextpassword',
      };

      await userService.create(createUserDto);

      // Verify password is hashed in database
      const userInDb = await prismaService.user.findUnique({
        where: { login: 'hashtest' },
      });

      expect(userInDb).toBeDefined();
      expect(userInDb!.password).not.toBe(createUserDto.password);
      expect(userInDb!.password.length).toBeGreaterThan(20); // Hashed password should be longer

      // Verify password can be validated
      const isValid = await passwordService.verifyPassword(createUserDto.password, userInDb!.password);
      expect(isValid).toBe(true);
    });
  });

  describe('Timestamp Handling', () => {
    it('should handle BigInt timestamps correctly', async () => {
      const createUserDto: CreateUserDto = {
        login: 'timestamptest',
        password: 'password123',
      };

      const result = await userService.create(createUserDto);

      expect(typeof result.createdAt).toBe('number');
      expect(typeof result.updatedAt).toBe('number');
      expect(result.createdAt).toBeGreaterThan(0);
      expect(result.updatedAt).toBeGreaterThan(0);
      expect(result.updatedAt).toBeGreaterThanOrEqual(result.createdAt);
    });

    it('should update timestamps on password change', async () => {
      const createUserDto: CreateUserDto = {
        login: 'timestampupdate',
        password: 'initialpass',
      };

      const created = await userService.create(createUserDto);
      const initialUpdatedAt = created.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise((resolve) => setTimeout(resolve, 10));

      const updatePasswordDto: UpdatePasswordDto = {
        oldPassword: 'initialpass',
        newPassword: 'newpass',
      };

      const updated = await userService.updatePassword(created.id, updatePasswordDto);

      expect(updated.updatedAt).toBeGreaterThan(initialUpdatedAt);
    });
  });
});
