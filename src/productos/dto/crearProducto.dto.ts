import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  IsNumber,
  IsInt,
  IsPositive,
  IsUrl,
} from 'class-validator';

export class CreateProductoDto {
  @IsString()
  @MaxLength(150)
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'El precio debe ser numérico' },
  )
  @IsPositive()
  precio: number;

  @IsInt()
  @IsOptional()
  disponibilidad?: number;

  @IsString()
  @IsOptional()
  @MaxLength(255)
  imagen?: string | null;

  @IsInt()
  @IsNotEmpty()
  subcategoria: number; // ID de la subcategoría
}
