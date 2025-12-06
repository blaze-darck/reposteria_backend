import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriaProducto } from '../productosEntities/categoriaProducto.entity';

@Injectable()
export class CategoriaProductoRepository {
  constructor(
    @InjectRepository(CategoriaProducto)
    private readonly repo: Repository<CategoriaProducto>,
  ) {}

  findAll() {
    return this.repo.find({ relations: ['subcategorias'] });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id }, relations: ['subcategorias'] });
  }

  create(data: Partial<CategoriaProducto>) {
    const categoria = this.repo.create(data);
    return this.repo.save(categoria);
  }

  update(id: number, data: Partial<CategoriaProducto>) {
    return this.repo.update(id, data);
  }

  async softDelete(id: number) {
    return this.repo.update(id, { activo: false }); 
  }
}
