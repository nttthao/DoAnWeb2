import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

export const CLOUDINARY = 'lib:cloudinary';

export class PagingDto<T> {
  public page: number;
  public size: number;
  public total: number;
  public items: T[];

  constructor(page: number, size: number, total: number, items: T[]) {
    this.page = page;
    this.size = size;
    this.total = total;
    this.items = items;
  }
}
