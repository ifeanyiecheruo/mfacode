"use strict";

import { exists, readFile, writeFile } from "fs";

export interface BlobStore {
    read(_default: string): Promise<string>;
    write(value: string): Promise<void>;
}

export default {
    create
};

function create(path: string): BlobStore {
    return new BlobStoreImpl(path);
}

class BlobStoreImpl implements BlobStore {
    constructor(path: string) {
        this._path = path;
    }
    
    public async read(_default: string): Promise<string> {
        if (! await this.exists()) {
            return _default;
        }

        return new Promise<string>((resolve, reject) => {
            readFile(this._path, (err, data) => {
                if (typeof err !== "undefined" && err != null) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            });
        });
    }

    public write(value: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            writeFile(this._path, value, err => {
                if (typeof err !== "undefined" && err != null) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }

    private exists(): Promise<boolean> {
        return new Promise((resolve) => {
            exists(this._path, result => {
                resolve(result);
            });
        });
    }

    private _path: string;
}
