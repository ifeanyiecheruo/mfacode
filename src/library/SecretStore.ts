"use strict";

const keyChain = require("xkeychain");

export interface SecretStore {
    get(key: string): Promise<string>;
    set(key: string, value: string): Promise<void>;
    remove(key: string): Promise<void>;
}

export default {
    create
}

function create(): SecretStore {
    return new SecretStoreImpl();
}

class SecretStoreImpl implements SecretStore {
    public get(key: string): Promise<string> {
        return new Promise((resolve, reject) => {
            keyChain.getPassword({
                account: key,
                service: Constants.keyChainServiceName
            }, function(err: any, data: string) {
                if (typeof err !== "undefined" && err !== null) {
                    reject(err);
                } else {
                    console.log("got secret: " + data);
                    resolve(data);
                }
            });
        });
    }
    
    public set(key: string, value: string): Promise<void> {
        return new Promise((resolve, reject) => {
            keyChain.setPassword(
                {
                    account: key,
                    service: Constants.keyChainServiceName,
                    password: value
                },
                function(err: any) {
                    if (typeof err !== "undefined" && err !== null) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }

    public remove(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            keyChain.deletePassword(
                {
                    account: key,
                    service: Constants.keyChainServiceName
                },
                function(err: any) {
                    if (typeof err !== "undefined" && err !== null) {
                        reject(err);
                    } else {
                        resolve();
                    }
                }
            );
        });
    }
}

enum Constants {
    keyChainServiceName = "MFACode",
}
