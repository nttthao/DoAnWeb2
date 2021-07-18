import { Controller, Delete, Param } from '@nestjs/common';
import { CinemasService } from 'src/services/cinemas.service';

@Controller('api/cinemas')
export class CinemasController {
	constructor(private cinemaService: CinemasService) {}

	@Delete(':id')
	async delete(@Param() params): Promise<void> {
		await this.cinemaService.delete(params.id);
	}
}
