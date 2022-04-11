import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable } from 'rxjs';

@Injectable()
export class SimpleAuthGuard implements CanActivate {
  private BEARER: string;

  constructor(
    private configService: ConfigService
  ) {
    this.BEARER = this.configService.get('BEARER');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const headerFieldValue = request.headerField;
    let bearerIndex = request.rawHeaders.findIndex(x => x == 'Bearer');
    let bearer = request.rawHeaders[bearerIndex + 1];
    
    if(bearer == this.BEARER) {
      return true;
    } else {
      return false;
    }
  }
}
