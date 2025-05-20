import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { User } from '@/users/entities/user.entity';

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

async function clear() {
	await AppDataSource.initialize();

	const entities = AppDataSource.entityMetadatas;

	for (const entity of entities) {
		const repository = AppDataSource.getRepository(entity.name);
		const tableName = entity.tableName;

		try {
			await repository.query(
				`TRUNCATE TABLE "${tableName}" RESTART IDENTITY CASCADE`,
			);
			console.log(`✅ Cleared ${tableName}`);
		} catch (error) {
			console.error(`❌ Failed to clear ${tableName}:`, error);
		}
	}

	await AppDataSource.destroy();
}

clear()
	.then(() => {
		console.log('✅ Database cleared.');
		process.exit(0);
	})
	.catch((err) => {
		console.error('❌ Error clearing database:', err);
		process.exit(1);
	});
