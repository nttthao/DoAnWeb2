import { Controller, HttpCode, InternalServerErrorException, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { Public } from 'src/constants/app.const';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/services/cloudinary.service';

@Controller('files')
export class FilesController {
	constructor(private cloudinary: CloudinaryService) {}

	@Post('posters')
	@Public()
	@HttpCode(200)
	@UseInterceptors(FilesInterceptor('poster'))
	async uploadPoster(@UploadedFiles() poster: Express.Multer.File): Promise<any> {
		return await this.cloudinary
			.uploadImage(poster[0])
			.then((result) => result.secure_url)
			.catch(() => {
				throw new InternalServerErrorException();
			});
	}
}
