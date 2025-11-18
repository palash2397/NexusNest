import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Foundation, FoundationDocument } from './schemas/foundation.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ApiResponse } from '../utils/ApiResponse';

import { CreateFoundationDto } from './dto/create-foundation.dto';

@Injectable()
export class FoundationService {
  constructor(
    @InjectModel(Foundation.name)
    private readonly foundationModel: Model<FoundationDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async create(dto: CreateFoundationDto, id: string) {
    try {
      const { name, description, website } = dto;

      const user = await this.userModel.findById(id);
      if (!user) return new ApiResponse(404, {}, `User not found`);

      await this.foundationModel.create({
        name,
        description,
        website: website,
        userId: user._id,
      });

      return new ApiResponse(200, {}, 'Foundation created successfully');
    } catch (error) {
      console.log(`error while creating foundation: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }
}
