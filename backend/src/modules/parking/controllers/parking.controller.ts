import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ParkingService } from '../services/parking.service';
import { CreateParkingDto, UpdateParkingDto } from '../dto/parking.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';

@ApiTags('parking')
@Controller('parking')
@UseGuards(AuthGuard)
export class ParkingController {
  constructor(private readonly parkingService: ParkingService) {}

  @Get('spaces')
  @ApiOperation({ summary: 'Obtener espacios de parqueadero' })
  @ApiResponse({ status: 200, description: 'Espacios obtenidos exitosamente' })
  async getParkingSpaces() {
    return this.parkingService.getParkingSpaces();
  }

  @Post('spaces')
  @ApiOperation({ summary: 'Crear nuevo espacio de parqueadero' })
  @ApiResponse({ status: 201, description: 'Espacio creado exitosamente' })
  async createParkingSpace(@Body() createParkingDto: CreateParkingDto) {
    return this.parkingService.createParkingSpace(createParkingDto);
  }

  @Get('spaces/:id')
  @ApiOperation({ summary: 'Obtener espacio de parqueadero por ID' })
  @ApiParam({ name: 'id', description: 'ID del espacio' })
  @ApiResponse({ status: 200, description: 'Espacio obtenido exitosamente' })
  @ApiResponse({ status: 404, description: 'Espacio no encontrado' })
  async getParkingSpace(@Param('id') id: string) {
    return this.parkingService.getParkingSpace(id);
  }

  @Put('spaces/:id')
  @ApiOperation({ summary: 'Actualizar espacio de parqueadero' })
  @ApiParam({ name: 'id', description: 'ID del espacio' })
  @ApiResponse({ status: 200, description: 'Espacio actualizado exitosamente' })
  async updateParkingSpace(
    @Param('id') id: string,
    @Body() updateParkingDto: UpdateParkingDto,
  ) {
    return this.parkingService.updateParkingSpace(id, updateParkingDto);
  }

  @Delete('spaces/:id')
  @ApiOperation({ summary: 'Eliminar espacio de parqueadero' })
  @ApiParam({ name: 'id', description: 'ID del espacio' })
  @ApiResponse({ status: 200, description: 'Espacio eliminado exitosamente' })
  async deleteParkingSpace(@Param('id') id: string) {
    return this.parkingService.deleteParkingSpace(id);
  }

  @Post('entry')
  @ApiOperation({ summary: 'Registrar entrada de vehículo' })
  @ApiResponse({ status: 201, description: 'Entrada registrada exitosamente' })
  async registerEntry(@Body() entryDto: any) {
    return this.parkingService.registerEntry(entryDto);
  }

  @Post('exit')
  @ApiOperation({ summary: 'Registrar salida de vehículo' })
  @ApiResponse({ status: 200, description: 'Salida registrada exitosamente' })
  async registerExit(@Body() exitDto: any) {
    return this.parkingService.registerExit(exitDto);
  }

  @Get('records')
  @ApiOperation({ summary: 'Obtener registros de parqueadero' })
  @ApiResponse({ status: 200, description: 'Registros obtenidos exitosamente' })
  async getParkingRecords() {
    return this.parkingService.getParkingRecords();
  }
}
