import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isValidUuidV4 } from '../utils/uuid.utils';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed, ID must be a string');
    }

    if (!isValidUuidV4(value)) {
      throw new BadRequestException('Validation failed, ID must be a valid UUID v4');
    }

    return value;
  }
}