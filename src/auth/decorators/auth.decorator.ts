import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '@/auth/guards/user-role.guard';
import { META_ROLES, UserRoles } from '@/auth/constants/roles';

export function Auth(...roles: UserRoles[]) {
	return applyDecorators(
		SetMetadata(META_ROLES, roles),
		UseGuards(AuthGuard(), UserRoleGuard),
	);
}
