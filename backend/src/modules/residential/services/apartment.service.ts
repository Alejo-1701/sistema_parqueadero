import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Apartment } from '../entities/apartment.entity';

@Injectable()
export class ApartmentService {
  constructor(
    @InjectRepository(Apartment)
    private readonly apartmentRepository: Repository<Apartment>,
  ) {}

  async findAll(): Promise<Apartment[]> {
    return this.apartmentRepository.find();
  }

  async findOne(id: string): Promise<Apartment | null> {
    return this.apartmentRepository.findOne({ where: { id } });
  }

  async create(apartment: Partial<Apartment>): Promise<Apartment> {
    const newApartment = this.apartmentRepository.create(apartment);
    return this.apartmentRepository.save(newApartment);
  }

  async update(id: string, apartment: Partial<Apartment>): Promise<Apartment | null> {
    await this.apartmentRepository.update(id, apartment);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.apartmentRepository.delete(id);
  }
}
