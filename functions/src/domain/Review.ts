export class Review {
    // Author of the review, Either a student or Company uuid
    author: string = '';
    // Target of the review, Either a student or Company uuid
    target: string = '';
    content: string = '';
    postDate: Date = new Date();
    stars: number = 0;
}
