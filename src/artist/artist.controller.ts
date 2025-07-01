import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
import { ArtistService } from './services/artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { UuidValidationPipe } from '../common/pipes/uuid-validation.pipe';

@ApiTags('Artist')
@ApiBearerAuth('JWT-auth')
@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @ApiOperation({ summary: 'Get all artists', description: 'Gets all artists' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: [Artist],
  })
  async findAll(): Promise<Artist[]> {
    return this.artistService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single artist by id', description: 'Get single artist by id' })
  @ApiParam({ name: 'id', description: 'Artist ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Successful operation',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist was not found.',
  })
  async findById(@Param('id', UuidValidationPipe) id: string): Promise<Artist> {
    return this.artistService.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Add new artist', description: 'Add new artist' })
  @ApiResponse({
    status: 201,
    description: 'Successful operation',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. body does not contain required fields',
  })
  async create(@Body() createArtistDto: CreateArtistDto): Promise<Artist> {
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update artist information', description: 'Update artist information by UUID' })
  @ApiParam({ name: 'id', description: 'Artist ID', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'The artist has been updated.',
    type: Artist,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist was not found.',
  })
  async update(@Param('id', UuidValidationPipe) id: string, @Body() updateArtistDto: UpdateArtistDto): Promise<Artist> {
    return this.artistService.update(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete artist', description: 'Delete artist from library' })
  @ApiParam({ name: 'id', description: 'Artist ID', format: 'uuid' })
  @ApiResponse({
    status: 204,
    description: 'Deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request. artistId is invalid (not uuid)',
  })
  @ApiResponse({
    status: 404,
    description: 'Artist was not found.',
  })
  async delete(@Param('id', UuidValidationPipe) id: string): Promise<void> {
    await this.artistService.delete(id);
  }
}
