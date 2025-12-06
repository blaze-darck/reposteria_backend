import { IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPedido } from '../pedidosEntities/pedidos.entity';

export class FiltroPedidoDto {
  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  usuarioId?: number;

  @IsOptional()
  @IsDateString()
  fechaInicio?: string;

  @IsOptional()
  @IsDateString()
  fechaFin?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  pagina?: number = 1;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limite?: number = 10;
}
