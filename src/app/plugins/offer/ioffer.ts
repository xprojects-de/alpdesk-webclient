import { IOfferItems } from './ioffer-items';

export interface IOffer {
    address: string;
    subject: string;
    items: IOfferItems[];
}
