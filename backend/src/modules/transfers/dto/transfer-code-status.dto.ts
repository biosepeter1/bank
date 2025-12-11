import { ApiProperty } from '@nestjs/swagger';

export class TransferCodeStatusResponseDto {
    @ApiProperty({ description: 'Whether transfer codes are required' })
    transferCodesRequired: boolean;

    @ApiProperty({ 
        description: 'Status of each transfer code type',
        example: {
            COT: { isActive: false, isVerified: false },
            IMF: { isActive: false, isVerified: false },
            TAX: { isActive: false, isVerified: false }
        }
    })
    codes: any;
}
