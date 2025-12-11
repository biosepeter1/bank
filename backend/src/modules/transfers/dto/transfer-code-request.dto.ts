import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString, IsNotEmpty } from 'class-validator';
import { TransferCodeTypeEnum } from '../../admin/dto/transfer-code.dto';

export class RequestTransferCodeDto {
    @ApiProperty({ enum: TransferCodeTypeEnum })
    @IsEnum(TransferCodeTypeEnum)
    @IsNotEmpty()
    type: TransferCodeTypeEnum;
}

export class VerifyTransferCodeDto {
    @ApiProperty({ enum: TransferCodeTypeEnum })
    @IsEnum(TransferCodeTypeEnum)
    @IsNotEmpty()
    type: TransferCodeTypeEnum;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    code: string;
}
