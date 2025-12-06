import { PartialType } from '@nestjs/mapped-types';
import { CreateCategoriaProductoDto } from '../dto/crearCategoria.dto';

export class UpdateCategoriaProductoDto extends PartialType(CreateCategoriaProductoDto) {}
