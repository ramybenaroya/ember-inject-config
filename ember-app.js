const OfficialEmberApp = require("ember-cli/lib/broccoli/ember-app");

class EmberApp extends OfficialEmberApp {
	constructor(...args) {
		super(...args);
    }
    
	_contentForConfigModule(content, config) {
		let options = this.options && this.options["ember-inject-config"];
		let injectedContent = getInjectedContent(options);
		let returnIndex;
		let appConfigFromMeta;

		super._contentForConfigModule(content, config);

		appConfigFromMeta = content[content.length - 1].toString();
		returnIndex = appConfigFromMeta.indexOf("return ");
		appConfigFromMeta =
			appConfigFromMeta.substring(0, returnIndex) +
			injectedContent +
			appConfigFromMeta.substring(returnIndex, appConfigFromMeta.length);
		content[content.length - 1] = appConfigFromMeta;
	}
}

if (typeof OfficialEmberApp.env === "function") {
	EmberApp.env = OfficialEmberApp.env;
}

function getInjectedContent(options) {
	options = options || {};
	var varName = options.globalVarName || "configToInject",
		isBase64 = !!(options && options.isBase64),
		injectedContent = `var parsedConfigToInject;
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
			parsedConfigToInject = window["${varName}"];
			${isBase64 ? `if (typeof window["${varName}"] === "string") {
				parsedConfigToInject = JSON.parse(atob(window["${varName}"]));
			}` : ""}
			deepExtend(config, parsedConfigToInject);
		} catch (e) {}
	}
	`;
	return injectedContent;
}

module.exports = EmberApp;
