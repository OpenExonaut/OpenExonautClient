const fs = require('fs');
const os = require('os');

const platform = os.platform()

exports.default = function() {
  if (os.platform() === 'win32') {
    const defaultDir = './dist/win-ia32-unpacked/resources/default_app'
    const macWebPlayer = './dist/win-ia32-unpacked/utils/Unity Web Player.plugin'
    const exeFile = './dist/win-ia32-unpacked/OpenExonautClient.exe'

    // remove leftover files from default electron app
    fs.rm(defaultDir, { recursive: true }, (err) => {
      if (err) {
          throw err;
      }
    });
    // remove mac web player files
    fs.rm(macWebPlayer, { recursive: true }, (err) => {
      if (err) {
          throw err;
      }
    });
    // patch executable for large address awareness
    fs.open(exeFile, "r+", (err, fd) => {
      if(!err) {
          fs.write(
              fd, new Uint8Array([0x22]), 0, 1, 0x166,
              (err) => {
                  if(err) {
                      throw err;
                  }
                  fs.closeSync(fd);
              }
          );
      } else {
          throw err;
      }
    });
  }
  if (os.platform() === 'darwin') {
    const winWebPlayer = './dist/mac/OpenExonautClient.app/Contents/utils/Unity Web Player.windows'
    fs.rm(winWebPlayer, { recursive: true }, (err) => {
      if (err) {
          throw err;
      }
    });
  }
}
