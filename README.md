# Ember Patch Config

Patch Ember CLI app configuration at runtime.

## What is it for?
Well, sometimes you just want to change ember's config (`app/config/environment.js`) before everything is loaded, or even extract it programmatically from Local Storage or a Cookie.

## Ok, how?

First you need to import `EmberApp` from a different location:

```javascript
// ember-cli-build.js

const EmberApp = require('ember-patch-config/ember-app');

module.exports = function (defaults) {
	const app = new EmberApp(defaults, {
        // ...
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
        window.configToPatch = {
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

The content of `window.configToPatch` will be **DEEPLY MERGED** into the module `<your-app-name>/config/environment.js` at runtime, before the app is initialized (even before initializers).

## Options
Options can be passed within the `ember-patch-config` node of `EmberApp` options object.

#### `globalVarName`
Type: `String`  
Default: `'configToPatch'`   
The global variable name to patch the config from. 