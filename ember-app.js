const EmberApp = require("ember-cli/lib/broccoli/ember-app");

class PatchedEmberApp extends EmberApp {
	constructor(...args) {
		super(...args);
    }
    
	_contentForConfigModule(content, config) {
		let options = this.options && this.options["ember-patch-config"];
		let patchedContent = getPatchedContent(options);
		let returnIndex;
		let appConfigFromMeta;

		super._contentForConfigModule(content, config);

		appConfigFromMeta = content[content.length - 1].toString();
		returnIndex = appConfigFromMeta.indexOf("return ");
		appConfigFromMeta =
			appConfigFromMeta.substring(0, returnIndex) +
			patchedContent +
			appConfigFromMeta.substring(returnIndex, appConfigFromMeta.length);
		content[content.length - 1] = appConfigFromMeta;
	}
}

if (typeof EmberApp.env === "function") {
	PatchedEmberApp.env = EmberApp.env;
}

function getPatchedContent(options) {
	options = options || {};
	var varName = options.globalVarName || "configToPatch",
		isBase64 = !!(options && options.isBase64),
		patchedContent = `var parsedConfigToPatch;
var deepExtend = function(out) {
  out = out || {};

  for (var i = 1, len = arguments.length; i < len; ++i) {
    var obj = arguments[i];

    if (!obj) {
      continue;
    }

    for (var key in obj) {
      if (!obj.hasOwnProperty(key)) {
        continue;
      }
      if (Object.prototype.toString.call(obj[key]) === '[object Object]') {
        out[key] = deepExtend(out[key], obj[key]);
        continue;
      }

      out[key] = obj[key];
    }
  }

  return out;
};
	if (window["${varName}"]) {
		try {
			parsedConfigToPatch = window["${varName}"];
			${isBase64 ? `if (typeof window["${varName}"] === "string") {
				parsedConfigToPatch = JSON.parse(atob(window["${varName}"]));
			}` : ""}
			deepExtend(config, parsedConfigToPatch);
		} catch (e) {}
	}
	`;
	return patchedContent;
}

module.exports = PatchedEmberApp;
