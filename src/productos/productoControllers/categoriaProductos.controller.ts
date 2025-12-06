import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { CategoriaProductoService } from '../productoService/categoriaProducto.service';

@Controller('categorias')
export class CategoriaProductoController {
  constructor(private readonly service: CategoriaProductoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.service.findById(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.service.create(data);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() data: any) {
    return this.service.update(id, data);
  }
}
