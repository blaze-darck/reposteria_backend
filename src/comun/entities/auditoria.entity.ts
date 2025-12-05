import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

export abstract class Auditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @UpdateDateColumn()
  fechaModificacion!: Date;

  @Column({ default: true })
  activo!: boolean;
}
