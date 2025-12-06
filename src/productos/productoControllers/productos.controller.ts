import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductoService } from '../productoService/productos.service';

@Controller('productos')
export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }


  @Get('activos')
  findAllActive() {
    return this.service.findAllActive();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('imagen'))
  create(@UploadedFile() file: Express.Multer.File, @Body() body) {
    return this.service.create({
      ...body,
      imagen: file?.filename ?? null,
    });
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('imagen'))
  update(
    @Param('id') id: number,
    @UploadedFile() imagen: Express.Multer.File,
    @Body() data: any,
  ) {
    return this.service.update(id, {
      ...data,
      imagen: imagen ? imagen.filename : null,
    });
  }
  @Patch(':id/estado')
  toggleEstado(@Param('id') id: number, @Body('activo') activo: boolean) {
    return this.service.toggleEstado(id, activo);
  }

  @Delete(':id')
  softDelete(@Param('id') id: number) {
    return this.service.softDelete(id);
  }
}
