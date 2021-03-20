export interface IMandantPlugin {
    value: string;
    label: string;
    customTemplate: boolean;
}

export interface IMandantData {
    value: string;
    label: string;
    type: string;
    reference: [];
    eval: [];
}

export interface IMandant {
    username: string;
    alpdesk_token: string;
    mandantId: number;
    plugins: IMandantPlugin[];
    data: IMandantData[];
    accessFinderCopy: boolean;
    accessFinderCreate: boolean;
    accessFinderDelete: boolean;
    accessFinderDownload: boolean;
    accessFinderMove: boolean;
    accessFinderRename: boolean;
    accessFinderUpload: boolean;
}
