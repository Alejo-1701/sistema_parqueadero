import { Injectable } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { ExecutionContext } from '@nestjs/common';

@Injectable()
export class CustomThrottlerGuard extends ThrottlerGuard {
  protected errorMessage = 'Too many requests, please try again later.';

  protected async throwThrottlingException(context: ExecutionContext): Promise<void> {
    throw new ThrottlerException(this.errorMessage);
  }
}
