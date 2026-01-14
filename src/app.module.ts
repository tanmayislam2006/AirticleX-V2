import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { AuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from './libs/auth';

@Module({
  imports: [PostModule, CommentModule, AuthModule.forRoot(auth)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
