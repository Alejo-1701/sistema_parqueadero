import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from '../services/account.service';
import { Account } from '../entities/account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get()
  findAll(): Promise<Account[]> {
    return this.accountService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Account | null> {
    return this.accountService.findOne(id);
  }

  @Post()
  create(@Body() account: Partial<Account>): Promise<Account> {
    return this.accountService.create(account);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() account: Partial<Account>): Promise<Account | null> {
    return this.accountService.update(id, account);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.accountService.remove(id);
  }
}
