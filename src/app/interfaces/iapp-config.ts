export interface IAppConfig {
    version: string;
    logging: {
        enabled: boolean;
    };
    apiServer: {
        rest: string;
    };
}
