import { Entity, Column, PrimaryColumn, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string = uuidv4();
  
  @Column({ nullable: false })
  email: string;
}