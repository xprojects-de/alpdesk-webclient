import { IBillItems } from './ibill-items';

export interface IBill {
    address: string;
    subject: string;
    billnumber: string;
    items: IBillItems[];
}
