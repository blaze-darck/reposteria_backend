import { Auditoria } from 'src/comun/entities/auditoria.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { CategoriaProducto } from './categoriaProducto.entity';
import { Producto } from './producto.entity';

@Entity()
export class SubcategoriaProducto extends Auditoria {
  @Column({ length: 100 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => CategoriaProducto, (categoria) => categoria.subcategorias, {
    nullable: false,
    eager: true,
  })
  categoria: CategoriaProducto;

  @OneToMany(() => Producto, (producto) => producto.subcategoria)
  productos: Producto[];
}
