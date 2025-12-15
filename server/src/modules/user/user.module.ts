import { Module } from '@nestjs/common';
import { User } from 'src/models/user.entity';
import { UserService } from 'src/services/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from 'src/controllers/user/user.controller';
import { AuthModule } from '../auth/auth.module';


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UserService],
    controllers: [UserController],
    exports: [UserService, TypeOrmModule.forFeature([User])],
})
export class UserModule {}
