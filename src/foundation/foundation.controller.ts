import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FoundationService } from './foundation.service';

@Controller('foundation')
export class FoundationController {
  constructor(private readonly foundationService: FoundationService) {}
}
