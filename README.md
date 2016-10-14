# node-router-decorator

Simple router ES7 decorators for Node.js.

This library implemented on top of the ES7 decorators proposal. Which can only be used with transpilers such as Babel.

## Installation

```bash
$ npm install --save router-decorator
```

## Usage

### Use in Node.js

```js
import http from 'http';
import {router, route} from 'router-decorator';

function setHeaders(req, res, next) {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  next();
}

@router
class MyApp {
  @route('/', setHeaders)
  index(req, res) {
    res.end('Hello World\n');
  }

  @route('/users/:userId', setHeaders)
  user(req, res) {
    res.end(`Hello ${req.params.userId}\n`);
  }

  @route(/^\/posts\/(\d+)/, setHeaders)
  post(req, res) {
    res.end(`Hello ${req.params[1]}\n`);
  }
}

http.createServer(new MyApp()).listen(3000, () => {
  console.log('Example app listening on port 3000');
});
```

### Use with Express

```js
import express from 'express';
import {router, route} from 'router-decorator';

const app = express();

@router
class MyApp {
  @route('/')
  index(req, res) {
    res.send('Hello World\n');
  }

  @route('/users/:userId')
  user(req, res) {
    res.send(`Hello ${req.params.userId}\n`);
  }

  @route(/^\/posts\/(\d+)/)
  post(req, res) {
    res.send(`Hello ${req.params[1]}\n`);
  }
}

app.use(new MyApp('hello'));

app.listen(3000, () => {
  console.log('Example app listening on port 3000');
});
```

## API

### @router(options = {})

Class that is marked with this decorator is constructed as router middleware and its annotated methods are registered as routes.

#### options

| Name | Description | Default |
| ---- | ----------- | ------- |
| `methods` | Allowed HTTP methods. | `['GET', 'POST', 'PUT', 'DELETE']` |

### @route(matcher, method = 'GET', ...middleware)

Methods marked with this decorator will register a request made with given `method` HTTP method to a path that matches the given `matcher`.

#### matcher

type: `string|RegExp|function`

Path matcher for the route; can be any of:

- A string representing a path.
- A path with named parameter.
- A regular expression pattern to match paths.
- A function that returns an array or null taking an argument of path.

##### Path matcher examples

The following table provides some simple examples of valid path matcher value.

| Type | Example | Description |
| ---- | ------- | ----------- |
| Path | `@route('/abcd')` | This will match paths starting with `/abcd`. |
| Named parameter | `@route('/abcd/:id')` | This will match paths starting with `/abcd`, and set a value of the path segment located at the `:id` to `req.params`. |
| Regular expression | `@route(/\/abc|\/xyz/)` | This will match paths starting with `/abc` and `/xyz`. |
| Function | `@route((path) => path.startWith('efg'))` | This will match paths starting with `/efg`. |

#### method

type: `string`

HTTP method for the route. If the asterisk is specified, applies to the all methods that are allowed by the router methods option.

#### middleware

type: `function`

Express-style middleware for the route.

## License

MIT
