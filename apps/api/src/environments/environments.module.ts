import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';

@Module({
  imports: [JwtModule.register({})],
  controllers: [EnvironmentsController],
  providers: [EnvironmentsService],
  exports: [EnvironmentsService],
})
export class EnvironmentsModule {}
