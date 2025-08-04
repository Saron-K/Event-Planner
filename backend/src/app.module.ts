import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { EventModule } from './event/event.module';
import { UserModule } from './user/user.module';
import { SubEventModule } from './sub-event/sub-event.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './auth/constant/constant';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';


@Module({
  imports: [DatabaseModule,EventModule, UserModule, SubEventModule,AuthModule,JwtModule.register
                ({
                 global: true,
                 secret: jwtConstants.secret,
                 signOptions: { expiresIn: '1d' },
                })],
  controllers: [AppController],
  providers: [AppService, {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },],
})
export class AppModule {}
