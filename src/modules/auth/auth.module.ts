import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { OTPEntity } from '../user/entities/otp.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports:[
    TypeOrmModule.forFeature([UserEntity,OTPEntity])
  ],
  controllers: [AuthController],
  providers: [AuthService,JwtService,ConfigService],
  exports:[AuthService,JwtService,TypeOrmModule]
})
export class AuthModule {}
