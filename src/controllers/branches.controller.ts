import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { Public } from 'src/constants/app.const';
import { BranchDto, CreateBranchDto } from 'src/models/branch.dto';
import { BranchesService } from 'src/services/branches.service';

@Controller('api/branches')
export class BranchesController {
	constructor(private branchService: BranchesService) {}

	@Get()
	@Public()
	async getList(): Promise<BranchDto[]> {
		return await this.branchService.getList();
	}

	@Get(':id')
	@Public()
	async get(@Param() params): Promise<BranchDto> {
		return await this.branchService.get(params.id);
	}

	@Post()
	async create(@Body() dto: CreateBranchDto): Promise<BranchDto> {
		return await this.branchService.create(dto);
	}

	@Delete(':id')
	async delete(@Param() params): Promise<void> {
		await this.branchService.delete(params.id);
	}
}
