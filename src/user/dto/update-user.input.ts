import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDTO } from './create-user.input';

export class UpdateUserDTO extends PartialType(CreateUserDTO) {

    
}
