#!/usr/bin/node

import express from "express";
import * as fs from "fs";

import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const args = process.argv.slice(2);

if (args.length !== 1) {
    console.error("Please provide exactly one argument (port)");
    process.exit(1);
};

const serverPort = Number(args[0]);
if (isNaN(serverPort)) {
    console.error(`The value ${args[0]} is not a valid server-port`);
    process.exit(1);
};

const publicDir = process.cwd();

let app = express();
let port = 30030;
let id = 0;

const injectedCode = `
<script>
    ${fs.readFileSync(__dirname + "/hotreload.js")}
</script> 
`

let watcherFolder = fs.watch(publicDir, (event, filename) => {
    id += 1;
});

app.get("/id", (req, res) => {
    res.status(200);
    res.send("" + id);
});

app.use((req, res, next) => {
    let path = req.path;
    if (path.endsWith(".html") || path.endsWith("/")) {
        if (path.endsWith("/")) {
            path += "index.html";
        };

        fs.readFile(publicDir + path, (err, data) => {
            if (err) {
                res.status(400);
                res.send("Can't read HTML file from " + path);
                console.log(publicDir + path);
            } else {
                let content = data.toString();
                content = injectedCode + content;
                res.status(200);
                res.send(content);
            }
        });

        res.status(200);
        return;
    };

    next();
});

app.use(express.static(publicDir));

app.listen(port, () => {
    console.log(`Server running on Port ${port}`);
});