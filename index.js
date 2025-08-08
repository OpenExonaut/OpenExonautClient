var app = require("app"); // Module to control application life.
var fs = require("fs-extra");
var os = require("os");
var dialog = require("dialog");
var BrowserWindow = require("browser-window");
var child_process = require("child_process");
var path = require("path");

var mainWindow = null;
var initialPageLoad = false;

var utilsdir = path.join(__dirname, "..", "..", "utils");

// if running in non-packaged / development mode, this dir will be slightly different
if (process.env.npm_node_execpath) {
    utilsdir = path.join(__dirname, "build", "utils");
}

app.commandLine.appendSwitch("enable-npapi");
process.env.UNITY_DISABLE_PLUGIN_UPDATES = "yes";

if (process.platform == "darwin") {
    var full_osx_version = child_process
        .execSync("sw_vers -productVersion")
        .toString()
        .trim()
        .split(".");
    var osx_release =
        full_osx_version[0] == "10"
            ? Number(full_osx_version[1])
            : Number(full_osx_version[0]) + 5; // + 5 to cause Big Sur and up to follow Catalina as they should instead of overlapping El Capitan
    if (osx_release < 12) {
        app.commandLine.appendSwitch("ignore-certificate-errors");
    }
} else if (process.platform == "win32") {
    var unityDir = path.join(utilsdir, "Unity Web Player.windows");
    // npUnity3D32.dll was modified to point to HKCU\Software\OpenExonaut\OEC to look for Web Player instead of HKCU\Software\Unity\WebPlayer
    child_process.execSync(
        'reg add HKCU\\Software\\OpenExonaut\\OEC /f /v Directory /t REG_SZ /d "' +
            unityDir +
            '"'
    );
    app.commandLine.appendSwitch(
        "load-plugin",
        path.join(unityDir, "loader", "npUnity3D32.dll")
    );
}

function zipCheck() {
    if (os.platform() === "darwin") {
        return false;
    }
    return app.getPath("exe").includes(os.tmpdir());
}

// Quit when all windows are closed.
app.on("window-all-closed", function () {
    if (process.platform != "darwin") app.quit();
});

app.on("ready", function () {
    // Check just in case the user forgot to extract the zip.
    if (zipCheck()) {
        errormsg =
            "It has been detected that OpenExonautClient is running from the TEMP folder.\n\n" +
            "Please extract the entire Client folder to a location of your choice before starting OpenExonautClient.";
        dialog.showErrorBox("Error!", errormsg);
        return;
    }

    var prefs = { plugins: true };

    if (os.platform() == "darwin") prefs["extra-plugin-dirs"] = [utilsdir];

    // Create the browser window.
    mainWindow = new BrowserWindow({
        width: 1090,
        height: 776,
        show: false,
        "web-preferences": prefs,
    });
    mainWindow.setMinimumSize(640, 480);

    // Check for first run
    var configPath = path.join(app.getPath("userData"), "config.json");
    try {
        if (!fs.existsSync(configPath)) {
            console.log("Config file not found. Copying the default.");
            // Copy default config
            fs.copySync(
                path.join(__dirname, "defaults", "config.json"),
                path.join(app.getPath("userData"), "config.json")
            );
        }
        showMainWindow();
    } catch (ex) {
        dialog.showErrorBox(
            "Error!",
            "An error occurred while checking for the config. Make sure you have sufficent permissions."
        );
        app.quit();
    }

    mainWindow.on("closed", function () {
        mainWindow = null;
    });
});

function showMainWindow() {
    var configPath = path.join(app.getPath("userData"), "config.json");
    var config = fs.readJsonSync(configPath);

    console.log("Game URL:", config["game-url"]);
    mainWindow.loadUrl(config["game-url"]);

    // Reduces white flash when opening the program
    mainWindow.webContents.on("did-finish-load", function () {
        mainWindow.show();
        mainWindow.webContents.executeJavaScript("OnResize();");
        //mainWindow.webContents.openDevTools()
    });

    mainWindow.webContents.on("plugin-crashed", function () {
        dialog.showErrorBox(
            "Error!",
            "Unity Web Player has crashed. Please re-open the application."
        );
        mainWindow.destroy();
        app.quit();
    });

    mainWindow.webContents.on("will-navigate", function (evt, url) {
        evt.preventDefault();
        var configPath = path.join(app.getPath("userData"), "config.json");
        var config = fs.readJsonSync(configPath);

        if (!url.startsWith(config["game-url"])) {
            require("shell").openExternal(url);
        } else {
            mainWindow.loadUrl(url);
            initialPageLoad = true;
        }
    });

    mainWindow.webContents.on("did-fail-load", function () {
        if (!initialPageLoad) {
            dialog.showErrorBox(
                "Error!",
                "Could not load page. Check your Internet connection, and game-url inside config.json."
            );
            mainWindow.destroy();
            app.quit();
        }
    });
}
