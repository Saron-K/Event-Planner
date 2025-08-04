import { CreateSubeventDto } from "./CreateSubeventDto.dto";
import {PartialType} from "@nestjs/mapped-types";

export class UpdateSubeventDto extends PartialType(CreateSubeventDto){}