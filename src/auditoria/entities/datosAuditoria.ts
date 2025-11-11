import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";

export abstract class BaseEntityAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100, nullable: true })
  usuarioCreacion!: string | null;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @Column({ length: 100, nullable: true })
  usuarioModificacion!: string | null;

  @UpdateDateColumn()
  fechaModificacion!: Date;

  @Column({ default: true })
  activo!: boolean;
}
