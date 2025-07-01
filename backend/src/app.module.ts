import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user.module';
import { AuthModule } from './auth/auth.module';
import { EventModule } from './event/event.module';
import { CategoryModule } from './category/category.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [UserModule, AuthModule, EventModule, CategoryModule, TagModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
