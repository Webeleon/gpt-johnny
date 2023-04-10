import { Inject, Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { appConfig } from './config/app.config';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (this.config.env == 'dev') {
      Logger.debug(
        `[${req.method}] ${req.originalUrl}
${JSON.stringify(req.body)}`,
        'Incoming Request',
      );
    }
    next();
  }
}
