import { ApiProperty } from '@nestjs/swagger';
import { User } from '@/users/entities/user.entity';

export class LoginResponseDto {
	@ApiProperty({
		description: 'The authenticated user information',
		type: User,
	})
	user: User;

	@ApiProperty({
		description: 'JWT authentication token',
		example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
	})
	token: string;
}
