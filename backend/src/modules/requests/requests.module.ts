import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RequestController } from './controllers/request.controller';
import { RequestService } from './services/request.service';
import { Request } from './entities/request.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Request])],
  controllers: [RequestController],
  providers: [RequestService],
  exports: [RequestService],
})
export class RequestsModule {}
