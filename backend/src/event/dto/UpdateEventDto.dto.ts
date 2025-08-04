import { CreateEventDto } from "./CreateEventDto.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateEventDto extends PartialType(CreateEventDto){}