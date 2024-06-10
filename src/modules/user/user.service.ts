import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getProfile(request){
    return request.user;
  }
}
