/* Copyright 2017 Mozilla, 2025 OpenExonaut Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License. */

'use strict';

const { classes: Cc, interfaces: Ci, results: Cr, utils: Cu } = Components;
const { Runtime } = Cu.import('resource://qbrt/modules/Runtime.jsm', {});
const { Services } = Cu.import('resource://gre/modules/Services.jsm', {});
const { OS } = Cu.import("resource://gre/modules/osfile.jsm", {});

const SHELL_URL = 'chrome://app/content/shell.xul';

const WINDOW_FEATURES = [
  "width=900",
  "height=658",
  'resizable',
].join(',');

// Added
Cc["@mozilla.org/process/environment;1"]
  .getService(Ci.nsIEnvironment)
  .set("UNITY_DISABLE_PLUGIN_UPDATES", "yes");
if (Services.appinfo.OS === "WINNT") {
  let unityPathKey = Cc["@mozilla.org/windows-registry-key;1"].createInstance(
    Ci.nsIWindowsRegKey
  );
  unityPathKey.create(
    Ci.nsIWindowsRegKey.ROOT_KEY_CURRENT_USER,
    "SOFTWARE\\OpenExonaut\\OEC",
    Ci.nsIWindowsRegKey.ACCESS_ALL
  );
  unityPathKey.writeStringValue(
    "Directory",
    OS.Path.join(Services.dirsvc.get("GreD", Ci.nsIFile).path, "plugins")
  );
  unityPathKey.close();
}

// On startup, activate ourselves, since starting up from Node doesn't do this.
// TODO: do this by default for all apps started via Node.
if (Services.appinfo.OS === 'Darwin') {
  Cc['@mozilla.org/widget/macdocksupport;1'].getService(Ci.nsIMacDockSupport).activateApplication(true);
}

// Modified: eliminated argument and fallback options for url
const url = Runtime.packageJSON.mainURL;
const argument = Cc['@mozilla.org/supports-string;1'].createInstance(Ci.nsISupportsString);
argument.data = url;

// TODO: report error if URL isn't found.
Services.ww.openWindow(null, SHELL_URL, '_blank', WINDOW_FEATURES, argument);
