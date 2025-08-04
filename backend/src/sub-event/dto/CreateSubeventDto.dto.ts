import { IsNotEmpty,IsEmail, IsString, IsDate, IsOptional, IsDateString} from 'class-validator';
export class CreateSubeventDto{

    @IsNotEmpty()
    @IsString()
    subEventName: string;

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