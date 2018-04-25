# Ember Inject Config

Injection to Ember CLI app configuration at runtime.

## What is it for?
Well, sometimes you just want to change ember's config (`app/config/environment.js`) before everything is loaded, or even extract it programmatically from Local Storage or a Cookie.

## Ok, how?

First you need to import `EmberApp` from a different location:

```javascript
// ember-cli-build.js

const EmberApp = require('ember-inject-config/ember-app');

module.exports = function (defaults) {
	const app = new EmberApp(defaults, {
        // ...

        // Add this in case the meta config tag's content is serialized with Base64 (which is by default by ember-cli)
        'ember-inject-config': {
            isBase64: true
        }
    }
}
```

Then, add an inline script in `app/index.html` (before the app & vendor scripts):
```html
<!-- app/index.html -->
<!DOCTYPE html>
{{content-for 'rev-header'}}
<html>
  <!-- ... -->
  <body>
    <!-- ... -->
    <script>
        window.configToInject = {
            property1: 'value1',
            property2: 'value2',
            property3: {
                someKey: 'someValue'
            },
            property4: localStorage.getItem('property4')
        };
    </script>
    <!-- ... -->
  </body>
</html>
```

The content of `window.configToInject` will be **DEEPLY MERGED** into the module `<your-app-name>/config/environment.js` at runtime, before the app is initialized (even before initializers).

## Options
Options can be passed within the `ember-inject-config` node of `EmberApp` options object.

#### `globalVarName`
Type: `String`  
Default: `'configToInject'`   
The global variable name to inject the config from.

#### `isBase64`
Type: `Boolean`   
Default: `false`   
Specify whether the meta config tag's content is serialized with Base64 (which is by default by ember-cli).  