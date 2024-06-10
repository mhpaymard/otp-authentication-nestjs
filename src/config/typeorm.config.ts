import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from "@nestjs/typeorm";

@Injectable()
export class TypeOrmDbConfig implements TypeOrmOptionsFactory {
    constructor(private configService: ConfigService) {}
    createTypeOrmOptions(
        connectionName?: string
    ): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
        return {
            type:"postgres",
            host:this.configService.get("Db.host"),
            port:this.configService.get("Db.port"),
            username:this.configService.get("Db.username"),
            password:this.configService.get("Db.password"),
            database:this.configService.get("Db.database"),
            synchronize:true
        };
    }
}
