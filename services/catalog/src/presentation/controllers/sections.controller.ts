import { Controller, Get, Query } from '@nestjs/common';
import { SectionService } from '../../application/services/sections.service';
import { IsOptional, IsString } from 'class-validator';

class GetSectionsDto {
  @IsOptional()
  @IsString()
  storeId?: string;

  @IsOptional()
  @IsString()
  parentId?: string;
}

@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionService: SectionService) {}

  @Get()
  async getSections(@Query() query: GetSectionsDto) {
    const { storeId, parentId } = query;
    return this.sectionService.getSections(storeId, parentId);
  }
}
