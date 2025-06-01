import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { validate as uuidValidate, version as uuidVersion } from 'uuid';

@Injectable()
export class UuidValidationPipe implements PipeTransform {
  transform(value: any): string {
    if (typeof value !== 'string') {
      throw new BadRequestException('Validation failed (uuid string is expected)');
    }

    if (!this.isValidUuidV4(value)) {
      throw new BadRequestException('Validation failed (uuid v4 is expected)');
    }

    return value;
  }

  private isValidUuidV4(uuid: string): boolean {
    return uuidValidate(uuid) && uuidVersion(uuid) === 4;
  }
}