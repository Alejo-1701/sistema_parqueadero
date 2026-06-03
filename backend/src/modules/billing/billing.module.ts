import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RateController } from './controllers/rate.controller';
import { RateService } from './services/rate.service';
import { Rate } from './entities/rate.entity';
import { InvoiceController } from './controllers/invoice.controller';
import { InvoiceService } from './services/invoice.service';
import { Invoice } from './entities/invoice.entity';
import { PriceController } from './controllers/price.controller';
import { PriceService } from './services/price.service';
import { Price } from './entities/price.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Rate, Invoice, Price])],
  controllers: [RateController, InvoiceController, PriceController],
  providers: [RateService, InvoiceService, PriceService],
  exports: [RateService, InvoiceService, PriceService],
})
export class BillingModule {}
