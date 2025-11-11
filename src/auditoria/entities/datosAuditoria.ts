import {
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";

export abstract class Auditoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne("Usuario", { nullable: true })
  @JoinColumn({ name: "usuarioCreacionId" })
  usuarioCreacion?: any;

  @CreateDateColumn()
  fechaCreacion!: Date;

  @ManyToOne("Usuario", { nullable: true })
  @JoinColumn({ name: "usuarioModificacionId" })
  usuarioModificacion?: any;

  @UpdateDateColumn()
  fechaModificacion!: Date;

  @Column({ default: true })
  activo!: boolean;
}
