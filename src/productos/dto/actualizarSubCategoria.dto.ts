import { PartialType } from '@nestjs/mapped-types';
import { CreateSubcategoriaProductoDto } from '../dto/crearSubCategoria.dto';

export class UpdateSubcategoriaProductoDto extends PartialType(CreateSubcategoriaProductoDto) {}
