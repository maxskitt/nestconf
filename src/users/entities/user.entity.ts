import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Token } from '../../tokens/entities/token.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
