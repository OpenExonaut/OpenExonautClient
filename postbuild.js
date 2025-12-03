const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

switch (process.argv[2]) {
    case "mac":
        fs.renameSync(
            path.join(__dirname, "OpenExonautClient.v0.9.1.zip"),
            path.join(distDir, "OpenExonautClient-MacOS-Portable-0.9.1.zip")
        );
        break;
    case "win":
        fs.renameSync(
            path.join(__dirname, "OpenExonautClient.v0.9.1.zip"),
            path.join(distDir, "OpenExonautClient-Windows-Portable-0.9.1.zip")
        );
        break;
}
