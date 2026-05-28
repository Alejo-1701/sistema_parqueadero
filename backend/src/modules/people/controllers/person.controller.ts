import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { PersonService } from '../services/person.service';
import { Person } from '../entities/person.entity';

@Controller('people')
export class PersonController {
  constructor(private readonly personService: PersonService) { }

  @Get()
  async getPeople(): Promise<Person[]> {
    return this.personService.getPeople();
  }

  @Post()
  async createPerson(@Body() createDto: Partial<Person>): Promise<Person> {
    return this.personService.createPerson(createDto);
  }

  @Get(':id')
  async getPerson(@Param('id') id: string): Promise<Person | null> {
    return this.personService.getPerson(id);
  }

  @Put(':id')
  async updatePerson(@Param('id') id: string, @Body() updateDto: Partial<Person>): Promise<Person | null> {
    return this.personService.updatePerson(id, updateDto);
  }

  @Delete(':id')
  async deletePerson(@Param('id') id: string): Promise<void> {
    return this.personService.deletePerson(id);
  }
}
