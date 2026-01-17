import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './libs/auth';
import { CommentsModule } from './comments/comments.module';

@Module({
  imports: [PostModule, AuthModule.forRoot(auth), CommentsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
