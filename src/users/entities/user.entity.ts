import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column('text')
	fullName: string;

	@Column('text', {
		unique: true,
	})
	username: string;

	@Column('text', {
		select: false,
	})
	password: string;

	@Column('bool', {
		default: true,
	})
	isActive: boolean;

	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;
}
