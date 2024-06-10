import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { OTPEntity } from "./otp.entity";

@Entity("user")
export class UserEntity{
    @PrimaryGeneratedColumn("increment")
    id:number;
    @Column({nullable:true})
    first_name:string;
    @Column({nullable:true})
    last_name:string;
    @Column()
    mobile:string;
    @Column({default:false})
    mobile_verify:boolean;
    @Column({nullable:true})
    otp_id:number;
    @OneToOne(()=>OTPEntity,otp=>otp.user)
    @JoinColumn({name:"otp_id"})
    otp:OTPEntity;
    @CreateDateColumn()
    created_at:Date;
    @UpdateDateColumn()
    updated_at:Date;
}