import { Module } from '@nestjs/common';
import { AsistenteController } from '../recomendacionPlatillos/controller/recomendacionPlantilla.controller';
import { AsistenteService } from '../recomendacionPlatillos/services/recomendacionPlatillos.service';
import { ProductosModule } from '../productos/productos.module'; // Ajusta la ruta según tu estructura

@Module({
  imports: [ProductosModule], // Importar el módulo de productos
  controllers: [AsistenteController],
  providers: [AsistenteService],
  exports: [AsistenteService],
})
export class AsistenteModule {}
