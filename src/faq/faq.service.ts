import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Faq, FaqDocument } from '../faq/schemas/faq.schema';
import { ApiResponse } from '../utils/ApiResponse';
import { CreateFaqDto } from './dto/create-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    @InjectModel(Faq.name)
    private readonly faqModel: Model<FaqDocument>,
  ) {}

  async createFaq(dto: CreateFaqDto) {
    try {
      const { question, answer } = dto;

      const data = await this.faqModel.create({
        question,
        answer,
      });

      return new ApiResponse(200, data._id, `faq created successfully`);
    } catch (error) {
      console.log(`error while creating FAQ`, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }
}
