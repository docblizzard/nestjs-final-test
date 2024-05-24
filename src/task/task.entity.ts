import { User } from '../user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, PrimaryColumn, Generated, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number
    
    @Column()
    name: string;
    
    @ManyToOne(() => User)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: string;

    @Column()
    priority: number;
}