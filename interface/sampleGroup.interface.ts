export default interface ISampleGroup {
    _id?: string;
    title: string;
    forms: [string];
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
