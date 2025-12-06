import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubcategoriaProducto } from '../productosEntities/subcategoriaProductos.entity';

@Injectable()
export class SubcategoriaProductoRepository {
  constructor(
    @InjectRepository(SubcategoriaProducto)
    private readonly repo: Repository<SubcategoriaProducto>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['categoria'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['categoria'] });
  }

  create(data: Partial<SubcategoriaProducto>) {
    const subcategoria = this.repo.create(data);
    return this.repo.save(subcategoria);
  }

  update(id: number, data: Partial<SubcategoriaProducto>) {
    return this.repo.update(id, data);
  }

  async softDelete(id: number) {
    return this.repo.update(id, { activo: false });
  }
}
