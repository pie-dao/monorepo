import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { SentimentService } from './sentiment.service';
import { CreateSentimentDto } from './dto/create-sentiment.dto';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { SentimentDocument, SentimentEntity } from './entities/sentiment.entity';

@Controller('sentiment')
export class SentimentController {
  constructor(private readonly sentimentService: SentimentService) {}

  @ApiOkResponse({type: SentimentEntity, isArray: false})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @Post()
  create(
    @Body() sentiment: CreateSentimentDto
  ): Promise<SentimentDocument> {
    return this.sentimentService.create(sentiment);
  }

  @ApiOkResponse({isArray: true})
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiQuery({name: 'days', required: true})
  @Get('report')
  report(
    @Query('days') days?: number
  ): Promise<any> {
    return this.sentimentService.report(days);
  }
}
