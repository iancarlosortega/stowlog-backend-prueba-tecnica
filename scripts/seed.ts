import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '@/users/entities/user.entity';
import { UserRoles } from '@/auth/constants/roles';
import { PASSWORD_SALT } from '@/auth/constants/settings';

dotenv.config();

const AppDataSource = new DataSource({
	type: 'postgres',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	entities: [User],
	synchronize: false,
});

async function seed() {
	await AppDataSource.initialize();

	const userRepository = AppDataSource.getRepository(User);

	const password = await bcrypt.hash('123123', PASSWORD_SALT);

	const users = [
		{
			fullName: 'Admin User',
			username: 'admin',
			email: 'admin@example.com',
			password,
			role: UserRoles.ADMIN,
			isActive: true,
		},
		{
			fullName: 'Normal User',
			username: 'user',
			email: 'user@example.com',
			password,
			role: UserRoles.USER,
			isActive: true,
		},
	];

	for (const userData of users) {
		const exists = await userRepository.findOne({
			where: { email: userData.email },
		});
		if (!exists) {
			const user = userRepository.create(userData);
			await userRepository.save(user);
			console.log(`Seeded user: ${user.email}`);
		} else {
			console.log(`User already exists: ${userData.email}`);
		}
	}

	await AppDataSource.destroy();
}

seed()
	.then(() => {
		console.log('Seeding completed.');
		process.exit(0);
	})
	.catch((error) => {
		console.error('Seeding failed:', error);
		process.exit(1);
	});
