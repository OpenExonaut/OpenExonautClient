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
