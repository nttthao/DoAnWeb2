import { Cinema } from "src/entities/cinema.entity";

export class CinemaDto {
    id: number;
    name: string;
    type: string;
    horizontalSize: number;
    verticalSize: number;

    constructor(entity: Cinema) {
        this.id = entity.id;
        this.name = entity.name;
        this.type = entity.type;
        this.horizontalSize = entity.horizontalSize;
        this.verticalSize = entity.verticalSize;
    }
}

export class CreateCinemaDto {
    name: string;
    type: string;
    horizontalSize: number;
    verticalSize: number;
}