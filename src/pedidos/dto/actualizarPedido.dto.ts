import { IsEnum, IsOptional, IsString } from 'class-validator';
import { EstadoPedido } from '../pedidosEntities/pedidos.entity';

export class ActualizarPedidoDto {
  @IsOptional()
  @IsEnum(EstadoPedido)
  estado?: EstadoPedido;

  @IsOptional()
  @IsString()
  notas?: string;
}
