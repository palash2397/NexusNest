import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Foundation, FoundationDocument } from './schemas/foundation.schema';
import { Campaign, CampaignDocument } from './schemas/campaign.schema';
import { User, UserDocument } from '../users/schemas/user.schema';
import { ApiResponse } from '../utils/ApiResponse';

import { CreateFoundationDto } from './dto/create-foundation.dto';
import { CreateCampaignDto } from './dto/create-campaign.dto';

@Injectable()
export class FoundationService {
  constructor(
    @InjectModel(Foundation.name)
    private readonly foundationModel: Model<FoundationDocument>,

    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,

    @InjectModel(Campaign.name)
    private readonly campaignModel: Model<CampaignDocument>,
  ) {}

  async createCampaign(dto: CreateCampaignDto, id: string) {
    try {
      const {
        foundationId,
        title,
        description,
        eventDate,
        location,
        participants,
      } = dto;

      console.log(`participants:`, participants);
      console.log(`foundationId:`, foundationId);
      console.log(`userId:`, id);

      const foundation = await this.foundationModel.findOne({
        _id: foundationId,
        userId: new Types.ObjectId(id),
      });

      console.log(`foundation:`, foundation);
      if (!foundation) return new ApiResponse(404, {}, `Foundation not found`);
      const data = await this.campaignModel.create({
        foundationId,
        title,
        description,
        eventDate,
        location,
        participants,
      });

      return new ApiResponse(200, data._id, 'Campaign created successfully');
    } catch (error) {
      console.log(`error while creating campaign: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }
  async create(dto: CreateFoundationDto, file: any, id: string) {
    try {
      const { name, description, website } = dto;

      console.log(`file -------------->`,file);

      const user = await this.userModel.findById(id);
      if (!user) return new ApiResponse(404, {}, `User not found`);

      await this.foundationModel.create({
        name,
        description,
        website: website,
        logo: file ? file.path : null,
        userId: user._id,
      });

      return new ApiResponse(200, {}, 'Foundation created successfully');
    } catch (error) {
      console.log(`error while creating foundation: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async allFoundation(id?: string) {
    try {
      if (id) {
        const data = await this.foundationModel
          .findById(id)
          .populate('userId', '_id fullName email');
        if (!data) return new ApiResponse(404, {}, `Foundation not found`);

        data.logo = data.logo ? data.logo : process.env.DEFAULT_IMAGE!;
        return new ApiResponse(200, data, `Foundation fetched successfully`);
      }

      const data = await this.foundationModel
        .find()
        .populate('userId', '_id fullName email');

      if (!data || data.length < 0) {
        return new ApiResponse(404, {}, `Foundations not found`);
      }

      data.map((item) => {
        item.logo = item.logo ? item.logo : `${process.env.DEFAULT_IMAGE}`;
      });

      return new ApiResponse(200, data, `Foundations fetched successfully`);
    } catch (error) {
      console.log(`error while getting foundation: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }

  async deleteFoundation(userId: string, id: string) {
    try {
      console.log(`userId:`, userId);
      console.log(`foundationId:`, id);
      const foundation = await this.foundationModel.findOne({
        _id: id,
        userId: new Types.ObjectId(userId),
      });
      if (!foundation) {
        return new ApiResponse(404, {}, `Foundation not found`);
      }

      const campaigns = await this.campaignModel.find({ foundationId: id });
      if (!campaigns || campaigns.length < 0) {
        return new ApiResponse(
          404,
          {},
          `No campaigns found for this foundation`,
        );
      }

      for (const campaign of campaigns) {
        await campaign.deleteOne();
      }

      await foundation.deleteOne();
      return new ApiResponse(200, {}, `Foundation deleted successfully`);
    } catch (error) {
      console.log(`error while deleting foundation: `, error);
      return new ApiResponse(500, {}, `Internal server error`);
    }
  }
}

// nest g resource foundation
