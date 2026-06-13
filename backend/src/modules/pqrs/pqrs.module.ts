import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PqrsController } from './controllers/pqrs.controller';
import { PqrsService } from './services/pqrs.service';
import { Pqrs } from './entities/pqrs.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pqrs])],
  controllers: [PqrsController],
  providers: [PqrsService],
  exports: [PqrsService],
})
export class PqrsModule {}
