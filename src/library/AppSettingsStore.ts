"use strict";

import { BlobStore } from "./BlobStore";
import { SecretStore } from "./SecretStore";

export interface StringMap<V> {
    [key: string]: V;
}

export interface AccountSettings {
    secret: string;
    clockSkew: number;
}

export interface AppSettingsStore {
    get(accountName: string): Promise<AccountSettings | undefined>;
    set(accountName: string, value: AccountSettings): Promise<void>;
    remove(accountName: string): Promise<void>;
    listAccounts(): Promise<StringMap<AccountSettings>>;
}

export interface AppSettings {
    accounts: StringMap<AccountSettings>;
}

export default {
    create
}

function create(blobStore: BlobStore, secretStore: SecretStore): AppSettingsStore {
    return new AppSettingsStoreImpl(blobStore, secretStore);
}

class AppSettingsStoreImpl implements AppSettingsStore {
    constructor(blobStore: BlobStore, secretStore: SecretStore) {
        this._blobStore = blobStore;
        this._secretStore = secretStore;
    }

    public async get(accountName: string): Promise<AccountSettings | undefined> {
        const appSettings = await this.read();
        const account = appSettings.accounts[accountName];

        if (typeof account !== "undefined") {
            const result = JSON.parse(JSON.stringify(account));
            result.secret = await this._secretStore.get(accountName);

            return result;
        }

        return;
    }

    public async set(accountName: string, value: AccountSettings): Promise<void> {
        const secret = value.secret;
        const safeValue = JSON.parse(JSON.stringify(value));
        safeValue.secret = "";

        const appSettings = await this.read();

        await this._secretStore.set(accountName, secret);

        appSettings.accounts[accountName] = safeValue;

        await this.write();
    }

    public async remove(accountName: string): Promise<void> {
        const appSettings = await this.read();

        await this._secretStore.remove(accountName);

        delete appSettings.accounts[accountName];

        await this.write();
    }

    public async listAccounts(): Promise<StringMap<AccountSettings>> {
        const appSettings = await this.read();

        return JSON.parse(JSON.stringify(appSettings.accounts));
    }
    
    private async read(): Promise<AppSettings> {
        if (this._cache) {
            return this._cache;
        }

        return this._cache = JSON.parse(await this._blobStore.read(Constants.defaultAppSettingsJSON));
    }
    
    private async write(): Promise<void> {
        return this._blobStore.write(JSON.stringify(this._cache || { accounts: {} }));
    }

    private _blobStore: BlobStore;
    private _secretStore: SecretStore;
    private _cache: undefined | AppSettings;
}

enum Constants {
    defaultAppSettingsJSON = "{\"accounts\":{}}"
}
