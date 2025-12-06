import {
  IsEnum,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsNumber,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { MetodoPago, TipoEntrega } from '../pedidosEntities/pedidos.entity';

export class CrearDetallePedidoDto {
  @IsNumber()
  productoId: number;

  @IsNumber()
  @Min(1)
  cantidad: number;
}

export class CrearPedidoDto {
  @IsNumber()
  usuarioId: number;

  @IsEnum(MetodoPago)
  metodoPago: MetodoPago;

  @IsEnum(TipoEntrega)
  tipoEntrega: TipoEntrega;

  @IsOptional()
  @IsString()
  notas?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CrearDetallePedidoDto)
  detalles: CrearDetallePedidoDto[];
}
