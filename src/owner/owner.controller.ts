import {
    Controller,
    Body,
    Get,
    Post,
    Delete,
    Param,
    Res,
    HttpStatus,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { OwnerDto } from 'src/dto/owner.dto';
import { OwnerService } from './owner.service';

@Controller('owner')
export class OwnerController {
    constructor(
        private service: OwnerService
    ) { }

    @Post('/')
    async create(@Res() res, @Body() dto: OwnerDto) {
        try {
            const owner = await this.service.create(dto);
            return res.status(HttpStatus.OK).json({
                status: 'ok',
                owner
            });
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('/:uuid')
    async getMessages(@Param('uuid') uuid,@Res() res) {
        try {
            const owner = await this.service.getMessagesActive(uuid);
            return res.status(HttpStatus.OK).json({
                status: 'ok',
                qty: owner.messages.length,
                owner
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Get('/:uuid/:id')
    async getMessage(@Param('uuid') uuid, @Param('id') id, @Res() res) {
        try {
            const result = await this.service.getOneMessage(uuid, id);
            if (result.length === 0) {
                throw new NotFoundException();
            }
            return res.status(HttpStatus.OK).json({
                status: 'ok',
                message: result[0].messages
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    @Delete('/:uuid/:id')
    async readMessage(@Param('uuid') uuid, @Param('id') id, @Res() res) {
        try {
            const owner = await this.service.removeMessage(uuid, id);
            return res.status(HttpStatus.OK).json({
                status: 'ok',
                qty: owner.messages.length,
                owner
            })
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }
}
