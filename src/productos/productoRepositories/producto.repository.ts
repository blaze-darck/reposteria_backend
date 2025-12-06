import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from '../productosEntities/producto.entity';

@Injectable()
export class ProductoRepository {
  constructor(
    @InjectRepository(Producto)
    private readonly repo: Repository<Producto>,
  ) {}

  findAll() {
    return this.repo.find({
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  // 🆕 Solo productos activos
  findAllActive() {
    return this.repo.find({
      where: { activo: true },
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  findById(id: number) {
    return this.repo.findOne({
      where: { id },
      relations: ['subcategoria', 'subcategoria.categoria'],
    });
  }

  create(data: Partial<Producto>) {
    const producto = this.repo.create(data);
    return this.repo.save(producto);
  }

  async update(id: number, data: Partial<Producto>) {
    await this.repo.update(id, data);
    return this.findById(id); // 🔧 Devolver el producto actualizado
  }

  async softDelete(id: number) {
    await this.repo.update(id, { activo: false });
    return { message: 'Producto desactivado', id };
  }
}
