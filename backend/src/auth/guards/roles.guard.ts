import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles_Key } from "../decorators/roles.decorator";
import { Role } from "generated/prisma";


@Injectable()
export class RolesGuard implements CanActivate{
   constructor(private reflector:Reflector){}

   canActivate(context: ExecutionContext){
    const requiredRoles=this.reflector.getAllAndOverride<Role[]>(Roles_Key,[
        context.getHandler(),
        context.getClass(),
    ])

    if(!requiredRoles){
        return true;
    }
 const { user } = context.switchToHttp().getRequest();
  return requiredRoles.some((requiredRole) => user.role === requiredRole);
   }
}
