import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';

@Controller('people')
export class PersonController {
  @Get()
  async getPeople() {
    return { message: 'Obtener personas' };
  }

  @Post()
  async createPerson(@Body() createDto: any) {
    return { message: 'Crear persona' };
  }

  @Get(':id')
  async getPerson(@Param('id') id: string) {
    return { message: 'Obtener persona por ID' };
  }

  @Put(':id')
  async updatePerson(@Param('id') id: string, @Body() updateDto: any) {
    return { message: 'Actualizar persona' };
  }

  @Delete(':id')
  async deletePerson(@Param('id') id: string) {
    return { message: 'Eliminar persona' };
  }
}
