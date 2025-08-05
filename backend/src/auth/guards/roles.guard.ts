import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Roles_Key } from "../decorators/roles.decorator";
import { Role } from '@prisma/client';


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
const request = context.switchToHttp().getRequest();
    const user = request.user;
    
    if (!user || !user.role) {
      return false; 
    }

    return requiredRoles.some((role) => user.role === role);
   }
   
}
