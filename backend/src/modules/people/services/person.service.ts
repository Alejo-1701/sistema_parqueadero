import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepository: Repository<Person>,
  ) {}

  async getPeople(): Promise<Person[]> {
    return this.personRepository.find();
  }

  async createPerson(createDto: any): Promise<Person> {
    const person = this.personRepository.create(createDto) as any;
    return this.personRepository.save(person);
  }

  async getPerson(id: string): Promise<Person | null> {
    return this.personRepository.findOne({ where: { id: id as any } });
  }

  async updatePerson(id: string, updateDto: any): Promise<Person | null> {
    await this.personRepository.update(id, updateDto);
    return this.getPerson(id);
  }

  async deletePerson(id: string): Promise<void> {
    await this.personRepository.delete(id);
  }
}
