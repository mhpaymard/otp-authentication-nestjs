import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import { OTPEntity } from '../user/entities/otp.entity';
import { ConfigService } from '@nestjs/config';
import { CheckOtpDto, SendOtpDto } from './dto/auth.dto';
import { randomInt } from 'crypto';
import { TokensPayload } from './type/payload.type';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepository:Repository<UserEntity>,
    @InjectRepository(OTPEntity) private otpRepository:Repository<OTPEntity>,
    private configService:ConfigService,
    private jwtService:JwtService
  ){}
  async sendOtp(otpDto:SendOtpDto){
    const {mobile} = otpDto;
    let user = await this.userRepository.findOneBy({mobile});
    if(!user){
      user = this.userRepository.create({
        mobile
      });
      user = await this.userRepository.save(user);
    }
    await this.makeOtpForUser(user);
    return {
      message: "sent code successfully"
    }

  }
  async checkOtp(otpDto:CheckOtpDto){
    const {mobile,code} = otpDto;
    const user = await this.userRepository.findOne(
      {
        where:{mobile},
        relations:{otp:true}
      }
    );
    if(!user || !user?.otp) throw new UnauthorizedException("Account Not Find! login again");
    if(user?.otp?.code !== code) throw new UnauthorizedException("Otp code incorrect");
    if(user?.otp.expires_in < new Date()) throw new UnauthorizedException("Otp code expired");
    if(!user?.mobile_verify) await this.userRepository.update({id:user.id},{mobile_verify:true});
    const {accessToken,refreshToken} = this.makeTokenForUser({
      id:user.id,
      mobile
    })
    return {
      message: "Login successfully",
      refreshToken,
      accessToken
    }
  }
  async makeOtpForUser(user:UserEntity){
    const code = randomInt(10000,99999).toString();
    const expires_In = new Date(Date.now() + 1000 * 60 * 2)  //expires in 2 minutes
    let otp = await this.otpRepository.findOneBy({user_id:user.id});
    if(otp){
      otp.code = code;
      otp.expires_in = expires_In;
      otp.user_id = user?.id;
    }else{
      otp = this.otpRepository.create({code,expires_in:expires_In,user_id:user?.id});
    }
    otp = await this.otpRepository.save(otp);
    await this.userRepository.update(
      {
        id:user.id
      },
      {
        otp_id:otp?.id
      }
    );
  }
  makeTokenForUser(payload: TokensPayload){
    const accessToken = this.jwtService.sign(payload,
      {
        secret:this.configService.get("Jwt.accessTokenSecret"),
        expiresIn:"3d"
      }
    );
    const refreshToken = this.jwtService.sign(payload,
      {
        secret:this.configService.get("Jwt.refreshTokenSecret"),
        expiresIn:"7d"
      }
    );
    return {accessToken,refreshToken}
  }
  async validateAccessToken(token:string){
    try{
      const payload = this.jwtService.verify<TokensPayload>(token,{
        secret:this.configService.get("Jwt.accessTokenSecret")
      });
      if(typeof payload === "object" && payload?.id){
        const user = await this.userRepository.findOneBy({id:payload?.id});
        if(!user) throw new UnauthorizedException("Please login on your account");
        return user;
      }
      throw new UnauthorizedException("Please login on your account");
    }catch(error){
      throw new UnauthorizedException("Please login on your account");
    }
  }
}
