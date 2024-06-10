import { IsMobilePhone, IsString, Length } from "class-validator";

export class SendOtpDto{
    @IsMobilePhone("fa-IR",{},{message:"IR Mobile phone required"})
    mobile:string;
}

export class CheckOtpDto{
    @IsMobilePhone("fa-IR",{},{message:"IR Mobile phone required"})
    mobile:string;
    @IsString()
    @Length(5,5,{message:"otp code required"})
    code:string;
}