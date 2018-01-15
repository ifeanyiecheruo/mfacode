"use strict";

export type Command = {
    name: "get";
    accountName: string;
} | {
    name: "add";
    accountName: string;
    secret: string;
    clockSkew: number;
} | {
    name: "remove";
    accountName: string;
} | {
    name: "list"
} | {
    name: "help"
};

export default {
    parse
}

interface MyIterator<T> {
    peek(): T | undefined;
    next(): boolean;
    value(): T;
}

function parse(argv: string[]): Command {
    const args = new ArrayIterator(argv.slice(2));

    const name = args.next() ? args.value() : undefined;

    switch(name) {
        case "get": {
            const accountName = getAccountNameArg(args);

            return {
                name: "get",
                accountName
            };
        }

        case "add": {
            const accountName = getAccountNameArg(args);
            const secret = getSecretArg(args);
            const clockSkew = getOptionalClockSkew(args);

            return {
                name: "add",
                accountName,
                secret,
                clockSkew
            };
        }

        case "rm":
        case "remove": {
            const accountName = getAccountNameArg(args);

            return {
                name: "remove",
                accountName
            };
        }

        case "ls":
        case "list": {
            return {
                name: "list"
            };
        }

        case "help":
        default: {
            return {
                name: "help"
            };
        }
    }
}

class ArrayIterator<T> implements MyIterator<T> {
    constructor (value: T []) {
        this._value = value || [];
        this._index = -1;
    }

    public peek(): T | undefined {
        const nextIndex = (this._index < 0) ? 0 : (this._index + 1);

        if (nextIndex < this._value.length) {
            return this._value[nextIndex];
        }

        return;
    }

    public next(): boolean {
        const nextIndex = this._index + 1;

        if (nextIndex < this._value.length) {
            this._index = nextIndex;
            return true;
        }

        return false;
    }

    public value(): T {
        if (this._index < 0 || this._index >= this._value.length) {
            throw new RangeError();
        }

        return this._value[this._index];
    }

    private _value: T[];
    private _index: number;
}

function getAccountNameArg(iterator: MyIterator<string>): string {
    if (!iterator.next()) {
        throw new Error("Missing accountName");
    }

    const result = iterator.value();
    checkValidAccountName(result);

    return result;
}

function getOptionalClockSkew(iterator: MyIterator<string>): number {
    let result = 0;
    const arg = iterator.peek();

    if (typeof arg === "string") {
        try {
            result = parseInt(arg, 10);
            iterator.next();
        } catch {            
        }
    }

    return result;
}

function getSecretArg(iterator: MyIterator<string>): string {
    if (!iterator.next()) {
        throw new Error("Missing secret");
    }

    const result = iterator.value();
    if (result.trim().length < 1) {
        throw new Error("Missing secret");
    }

    return result;
}

function checkValidAccountName(accountName: string): void {
    if (!/^[a-z,A-Z][0-9,a-z,A-Z]*$/g.test(accountName)) {
        throw new SyntaxError("accountName must start with a letter and only contain alphanumeric characters")
    }
}
