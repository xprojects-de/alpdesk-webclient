
export interface IAutomationItemsChangeValue {
    devicehandle: number;
    propertiehandle: number;
    value: any;
}

export interface IAutomationItemsChanges {
    devicehandle: number;
    devicevalue: IAutomationItemsChangeValue;
    tstamp: number;
    date: string;
}

export interface IAutomationItemsValueProperties {
    displayName: string;
    handle: number;
    value: string;
    changed: boolean;
}

export interface IAutomationItemsValue {
    categorie: string;
    name: string;
    type: number;
    properties: IAutomationItemsValueProperties[];
}

export interface IAutomationItems {
    devicehandle: number;
    devicevalue: IAutomationItemsValue;
    tstamp: number;
    date: string;
}

export interface IAutomationResult {
    error: boolean;
    changes: IAutomationItemsChanges[];
    items: IAutomationItems[];
}
