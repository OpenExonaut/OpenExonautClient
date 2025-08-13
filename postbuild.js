const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");

fs.rmSync(distDir, { recursive: true, force: true });
fs.mkdirSync(distDir, { recursive: true });

switch (process.argv[2]) {
    case "mac":
        fs.renameSync(
            path.join(__dirname, "OpenExonautClient.v1.0.0.dmg"),
            path.join(distDir, "OpenExonautClient-MacOS-1.0.0.dmg")
        );
        break;
    case "win":
        fs.renameSync(
            path.join(__dirname, "OpenExonautClient.v1.0.0.zip"),
            path.join(distDir, "OpenExonautClient-Windows-Portable-1.0.0.zip")
        );
        break;
}
