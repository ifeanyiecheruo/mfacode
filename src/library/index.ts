"use strict";

import blobStore from "./BlobStore";
import secretStore from "./SecretStore";
import settingsStore from "./AppSettingsStore";
import AppContext from "./AppContext";
import appCommands, { Command } from "./AppCommands";
import { homedir } from "os";
import { join, basename } from "path";

export default {
    run,
    create
}

async function run(app: AppContext, argv: string[]): Promise<void> {
    const cmd = appCommands.parse(argv);

    await exec(cmd, app);

    return;
}

function create(): AppContext {
    const settingsPath = join(homedir(), ".mfacoderc");
    const store = settingsStore.create(
        blobStore.create(settingsPath),
        secretStore.create()
    );
    
    return new AppContext(store);
}

async function exec(cmd: Command, app: AppContext): Promise<boolean> {
    switch(cmd.name) {
        case "get": {
            console.log(await app.getCode(cmd.accountName));
            return true;
        }

        case "add": {
            await app.addAccount(cmd.accountName, cmd.secret);
            return true;
        }

        case "remove": {
            await app.removeAccount(cmd.accountName);
            return true;
        }

        case "list": {
            Object.keys(await app.listAccounts()).forEach(key => {
                console.log(key);
            });
            return true;
        }

        case "help": {
            help();
            return true;
        }
    }
}

function help(): void {
    const commandName = basename(process.argv[1] || process.argv0);
    console.log(commandName + " [get <accountName>] | [add <accountName> <secret>] | [rm <accountName>] | ls | help]")
}