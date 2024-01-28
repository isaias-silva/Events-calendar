export interface Event {
    title: string,
    describ: string,
    initDate: Date,
    endDate: Date,
    background?: string,
    _id: string,
    owner: string,
    isPrivate: boolean,
    isActive: boolean
}