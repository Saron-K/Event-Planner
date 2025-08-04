import { IsNotEmpty,IsEmail, IsString, IsDate,IsOptional, IsDateString} from 'class-validator';
export class CreateEventDto{

    @IsNotEmpty()
    @IsString()
    eventName:string;

   @IsNotEmpty()
   @IsString()
    desc: string;

     @IsNotEmpty()
    @IsDateString()
    startDate:Date;

     @IsDateString()
    endDate:Date;

    @IsOptional()
  @IsString()
  image?: string;
}