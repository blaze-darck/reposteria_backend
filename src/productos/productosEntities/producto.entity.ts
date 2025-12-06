import { Auditoria } from 'src/comun/entities/auditoria.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { SubcategoriaProducto } from './subcategoriaProductos.entity';

@Entity()
export class Producto extends Auditoria {
  @Column({ length: 150 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  precio: number;

  @Column({
    type: 'int',
    nullable: true,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseInt(value, 10),
    },
  })
  disponibilidad: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  imagen: string | null;

  @ManyToOne(() => SubcategoriaProducto, (subcat) => subcat.productos, {
    eager: true,
    nullable: false,
  })
  subcategoria: SubcategoriaProducto;
}
