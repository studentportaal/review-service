import {IsInt, IsNotEmpty, Max, Min, IsDate} from "class-validator";

export class Review {

    id: string = '';
    // Author of the review, Either a student or Company uuid
    @IsNotEmpty()
    author: string = '';
    // Target of the review, Either a student or Company uuid
    @IsNotEmpty()
    target: string = '';
    content: string = '';

    @IsDate()
    postDate: Date = new Date();

    @IsInt()
    @Min(1)
    @Max(5)
    stars: number = 0;

    @IsNotEmpty()
    written: boolean = false;
}
