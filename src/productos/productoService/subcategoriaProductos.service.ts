import { Injectable, NotFoundException } from '@nestjs/common';
import { SubcategoriaProductoRepository } from '../productoRepositories/subcategoriasProductos.repository';

@Injectable()
export class SubcategoriaProductoService {
  constructor(private readonly repo: SubcategoriaProductoRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const subcat = await this.repo.findById(id);
    if (!subcat) throw new NotFoundException('Subcategoría no encontrada');
    return subcat;
  }

  create(data: any) {
    return this.repo.create(data);
  }

  update(id: number, data: any) {
    return this.repo.update(id, data);
  }

  softDelete(id: number) {
    return this.repo.softDelete(id);
  }
}
