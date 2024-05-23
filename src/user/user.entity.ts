import { Entity, Column, PrimaryColumn, Generated } from 'typeorm';

@Entity()
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  @Generated('increment')
  id: number;
}