import { ApiProperty } from '@nestjs/swagger';
import {
	Column,
	CreateDateColumn,
	Entity,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';
import { UserRoles } from '@/auth/constants/roles';

@Entity()
export class User {
	@ApiProperty({
		example: '7ab55156-76cc-410a-a921-e473c53604a0',
		description: 'User ID',
		uniqueItems: true,
	})
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@ApiProperty({
		example: 'Ian Carlos Ortega',
		description: 'User name',
	})
	@Column('text')
	fullName: string;

	@ApiProperty({
		example: 'iancarlosortega',
		description: 'Must be unique',
		uniqueItems: true,
	})
	@Column('text', {
		unique: true,
	})
	username: string;

	@Column('text')
	password: string;

	@ApiProperty({
		example: 'USER',
		description: 'User role',
		enum: UserRoles,
	})
	@Column({
		type: 'enum',
		enum: UserRoles,
		default: UserRoles.USER,
	})
	role: UserRoles;

	@ApiProperty({
		example: true,
		description: 'Describes if user can access to the app',
		default: true,
	})
	@Column('bool', {
		default: true,
	})
	isActive: boolean;

	@ApiProperty({
		example: '2023-11-07T14:13:03.174Z',
		description: 'When user was created',
	})
	@CreateDateColumn({ type: 'timestamp with time zone' })
	createdAt: Date;

	@ApiProperty({
		example: '2023-11-07T14:13:03.174Z',
		description: 'Last time user was updated',
	})
	@UpdateDateColumn({ type: 'timestamp with time zone' })
	updatedAt: Date;
}
