import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { configuratios } from "src/config/config";

@Module({
    imports:[
        ConfigModule.forRoot({
            load:configuratios,
            isGlobal:true
        })
    ]
})
export class CustomConfigModule{}