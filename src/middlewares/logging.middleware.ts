/* eslint-disable @typescript-eslint/naming-convention */
import { Injectable, NestMiddleware, Logger } from '@nestjs/common';

import { Request, Response, NextFunction } from 'express';
import { stringify } from 'querystring';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(request: Request, response: Response, next: NextFunction): void {
    const { method, baseUrl } = request;

    response.on('close', () => {
      const { statusCode } = response;
      this.logger.debug(
        `${method} ${baseUrl} ${statusCode} ${stringify(request.body)}`,
      );
    });

    next();
  }
}
