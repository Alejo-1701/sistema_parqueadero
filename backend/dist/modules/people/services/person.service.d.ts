import { Repository } from 'typeorm';
import { Person } from '../entities/person.entity';
export declare class PersonService {
    private readonly personRepository;
    constructor(personRepository: Repository<Person>);
    getPeople(): Promise<Person[]>;
    createPerson(createDto: any): Promise<Person>;
    getPerson(id: string): Promise<Person | null>;
    updatePerson(id: string, updateDto: any): Promise<Person | null>;
    deletePerson(id: string): Promise<void>;
}
