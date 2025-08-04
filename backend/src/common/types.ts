import { Request } from 'express';
import { Role } from '@prisma/client';


export interface RequestWithUser extends Request {
  user: {
    id: number;
    email: string;
    name: string;
    image?: string;
    role: Role; 
  };
}
