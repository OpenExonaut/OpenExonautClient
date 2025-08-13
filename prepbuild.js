const fs = require("fs");
const path = require("path");

let pluginsPath = null;
let unityPath = null;

switch (process.argv[2]) {
    case "mac":
        pluginsPath = path.join(
            __dirname,
            "node_modules",
            "qbrt",
            "dist",
            "darwin",
            "Runtime.app",
            "Contents",
            "MacOS",
            "plugins"
        );
        unityPath = path.join(
            __dirname,
            "build",
            "utils",
            "Unity Web Player.plugin"
        );

        fs.rmSync(pluginsPath, { recursive: true, force: true });
        fs.mkdirSync(pluginsPath);
        fs.mkdirSync(path.join(pluginsPath, "Unity Web Player.plugin"));
        fs.cpSync(
            unityPath,
            path.join(pluginsPath, "Unity Web Player.plugin"),
            { recursive: true }
        );
        break;
    case "win":
        pluginsPath = path.join(
            __dirname,
            "node_modules",
            "qbrt",
            "dist",
            "win32",
            "runtime",
            "plugins"
        );
        unityPath = path.join(
            __dirname,
            "build",
            "utils",
            "Unity Web Player.windows"
        );

        fs.rmSync(pluginsPath, { recursive: true, force: true });
        fs.mkdirSync(pluginsPath);
        fs.mkdirSync(path.join(pluginsPath, "mono"));
        fs.mkdirSync(path.join(pluginsPath, "player"));
        fs.cpSync(
            path.join(unityPath, "mono"),
            path.join(pluginsPath, "mono"),
            {
                recursive: true,
            }
        );
        fs.cpSync(
            path.join(unityPath, "player"),
            path.join(pluginsPath, "player"),
            {
                recursive: true,
            }
        );
        fs.copyFileSync(
            path.join(unityPath, "loader", "info.plist"),
            path.join(pluginsPath, "info.plist")
        );
        fs.copyFileSync(
            path.join(unityPath, "loader", "npUnity3D32.dll"),
            path.join(pluginsPath, "npUnity3D32.dll")
        );
        fs.copyFileSync(
            path.join(unityPath, "loader", "UnityWebPluginAX.ocx"),
            path.join(pluginsPath, "UnityWebPluginAX.ocx")
        );
        break;
}

const packagePath = path.join(__dirname, "OpenExonautClient");

fs.rmSync(packagePath, { recursive: true, force: true });
fs.mkdirSync(packagePath);
fs.copyFileSync(
    path.join(__dirname, "gecko.json"),
    path.join(packagePath, "package.json")
);
fs.copyFileSync(
    path.join(__dirname, "index.js"),
    path.join(packagePath, "index.js")
);

/*
const builder = require("electron-builder");

const options = {
    appId: "xyz.openexonaut.client",
    productName: "OpenExonautClient",
    copyright:
        "© 2020-2023 OpenFusion Contributors, © 2024-2025 OpenATBP Contributors, © 2025 OpenExonaut Contributors",
    electronDownload: {
        version: "0.19.5",
        customFilename: buildZip,
    },
    electronVersion: "0.19.5",
    win: {
        asar: false,
        target: [
            {
                target: "nsis",
                arch: "ia32",
            },
            {
                target: "zip",
                arch: "ia32",
            },
        ],
    },
    mac: {
        asar: false,
        target: [
            {
                target: "dmg",
                arch: "x64",
            },
        ],
    },
    nsis: {
        createDesktopShortcut: true,
        createStartMenuShortcut: true,
    },
};
*/
