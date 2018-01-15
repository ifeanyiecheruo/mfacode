"use strict";

import { AppSettingsStore, StringMap, AccountSettings } from "./AppSettingsStore";
const OTP = require("otp");

export default class AppContext {
    constructor(store: AppSettingsStore) {
        this._store = store;
    }

    public async getCode(accountName: string): Promise<string> {
        const account = await this._store.get(accountName);

        if (typeof account === "undefined") {
            throw new Error(`Account not found : ${accountName}`);
        }

        return OTP.parse(
            account.secret, 
            {
                timeSlice: 30,
                epoch: -(account.clockSkew || 0),
                codeLength: 6
            }
        ).totp();
    }
    
    public addAccount(accountName: string, secret: string, clockSkew: number): Promise<void> {
        return this._store.set(accountName, {
            secret: secret,
            clockSkew: clockSkew || 0
        });
    }
    
    public removeAccount(accountName: string): Promise<void> {
        return this._store.remove(accountName);
    }
    
    public listAccounts(): Promise<StringMap<AccountSettings>> {
        return this._store.listAccounts();
    }

    private _store: AppSettingsStore;
}
