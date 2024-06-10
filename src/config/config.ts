import { registerAs } from "@nestjs/config";

export enum ConfigKeys{
    App="App",
    Db="Db",
    Jwt="Jwt"
}

const AppConfig = registerAs(ConfigKeys.App,()=>({
    port:3000
}))

const DbConfig = registerAs(ConfigKeys.Db,()=>({
    host:"localhost",
    port:5432,
    username:"postgres",
    password:"028520",
    database:"auth-otp"
}))

const JwtConfig = registerAs(ConfigKeys.Jwt,()=>({
    accessTokenSecret:"e62717c59b79853e165bf1511c34d97d51458cb3",
    refreshTokenSecret:"449fef8590d33d3fb1f35f097071d98bd33d52de"
}))

export const configuratios = [AppConfig,DbConfig];