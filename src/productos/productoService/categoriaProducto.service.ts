import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriaProductoRepository } from '../productoRepositories/categoriaProducto.repository';

@Injectable()
export class CategoriaProductoService {
  constructor(private readonly repo: CategoriaProductoRepository) {}

  findAll() {
    return this.repo.findAll();
  }

  async findById(id: number) {
    const categoria = await this.repo.findById(id);
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return categoria;
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
