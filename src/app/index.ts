"use strict";

import lib from "../library";

lib.run(lib.create(), process.argv).catch(err => {
    console.error((err && err.message) || new String(err));
});
