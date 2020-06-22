
export interface IAutomationItemsChangeValue {
    devicehandle: number;
    propertiehandle: number;
    value: any;
}

export interface IAutomationItemsChanges {
    devicehandle: number;
    devicevalue: IAutomationItemsChangeValue;
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
}

export interface IAutomationResult {
    error: boolean;
    changes: IAutomationItemsChanges[];
    items: IAutomationItems[];
}
