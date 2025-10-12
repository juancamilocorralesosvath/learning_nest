import { Controller, Get, Param, Post, Req } from '@nestjs/common';
import { Request } from 'express';

@Controller('cats')
export class CatsController {
    /* 
        This method will return a 200 status code 
        along with the associated response, which in 
        this case is just a string. 
    */
    @Get()
    findAll(@Req() request: Request): string {
        return 'this action returns all cats'
    }

    @Post()
    create(): string {
        return 'this action adds a new cat'
    }

    @Get(':id')
    findOne(@Param() params: any): string {
        console.log(params.id);
        return `This action returns a #${params.id} cat`;
    }
    /* 
        this would be another option: 

            @Get(':id')
            findOne(@Param('id') id: string): string {
            return `This action returns a #${id} cat`;
            }

    */
}
