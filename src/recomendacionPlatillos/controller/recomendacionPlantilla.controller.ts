import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AsistenteService } from '../services/recomendacionPlatillos.service';

class RecomendacionDto {
  pregunta: string;
}

@Controller('api/asistente')
export class AsistenteController {
  constructor(private readonly asistenteService: AsistenteService) {}

  @Post('recomendar')
  @HttpCode(HttpStatus.OK)
  async obtenerRecomendacion(@Body() body: RecomendacionDto) {
    return this.asistenteService.obtenerRecomendacion(body.pregunta);
  }
}
