declare module '@shelby-protocol/sdk/browser' {
    export interface ShelbyClientConfig {
        network: any;
        apiKey: string;
    }

    export interface UploadOptions {
        file: File;
    }

    export interface UploadResponse {
        url?: string;
        cid?: string;
        [key: string]: any;
    }

    export class ShelbyClient {
        constructor(config: ShelbyClientConfig);
        upload(options: UploadOptions): Promise<UploadResponse>;
    }
}
