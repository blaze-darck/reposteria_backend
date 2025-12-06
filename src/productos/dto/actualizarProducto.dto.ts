import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from '../dto/crearProducto.dto';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {}
