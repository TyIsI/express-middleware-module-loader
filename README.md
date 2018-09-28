# express-middleware-module-loader

_express-middleware-module-loader_ loads middleware as modules from a specified directory or directories and automatically registers them under the module path.

## Usage

Middleware modules are to be loaded from the `hooks` directory and get mapped to `/hooks`.

Directory structure:
```
<PROJECT DIR>/hooks/
<PROJECT DIR>/hooks/hook1
<PROJECT DIR>/hooks/hook2
```

Code in api.js:
```
var hooks = require('express-middleware-module-loader')('./hooks/');
...
app.use('/hooks', hooks);
```

_hook1_ would then become available as _/hooks/hook1/*_