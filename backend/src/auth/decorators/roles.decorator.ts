import { SetMetadata } from "@nestjs/common";
import { Role } from '@prisma/client';


export const Roles_Key= 'roles';
export const Roles = (roles:Role[])=> SetMetadata(Roles_Key, roles);