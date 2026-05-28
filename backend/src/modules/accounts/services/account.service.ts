import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from '../entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  findAll(): Promise<Account[]> {
    return this.accountRepository.find();
  }

  findOne(id: string): Promise<Account | null> {
    return this.accountRepository.findOne({ where: { id } });
  }

  create(account: Partial<Account>): Promise<Account> {
    const newAccount = this.accountRepository.create(account);
    return this.accountRepository.save(newAccount);
  }

  async update(id: string, account: Partial<Account>): Promise<Account | null> {
    await this.accountRepository.update(id, account);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.accountRepository.delete(id);
  }
}
