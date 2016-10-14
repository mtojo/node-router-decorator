import {parse} from 'url';

const DEFAULT_METHOD = 'GET';

function createRouter(Target, options = {}) {
  const methods = options.methods || [
    'GET',
    'POST',
    'PUT',
    'DELETE'
  ];
  return (...args) => {
    const target = new Target(...args);
    if (!target._routes) {
      throw new Error(`${Target.name} has no route connected`);
    }
    const routes = {};
    for (const method of methods) {
      routes[method] = [];
    }
    for (const route of target._routes) {
      let method = route.method;
      if (method === '*') {
        method = methods;
      } else if (typeof method === 'string') {
        method = [method];
      }
      for (let key of method) {
        key = key.toUpperCase();
        if (!routes[key]) {
          throw new Error(`${key} method is not allowed`);
        }
        routes[key].push(route);
      }
    }
    return (req, res, next) => {
      const method = req.method || DEFAULT_METHOD;
      const path = req.path || parse(req.url).pathname;
      if (routes[method]) {
        for (const {matcher, middleware, fn} of routes[method]) {
          const params = matcher(path);
          if (params) {
            req.params = params;
            let idx = 0;
            next = () => {
              if (idx === middleware.length) {
                Reflect.apply(fn, target, [req, res]);
              } else {
                middleware[idx++](req, res, next);
              }
            };
            next();
            return;
          }
        }
      }
      if (typeof next === 'function') {
        next();
      }
    };
  };
}

export function router(...args) {
  if (typeof args[0] === 'function') {
    return createRouter(...args);
  }
  return (Target) => createRouter(Target, ...args);
}

export function route(matcher, method = DEFAULT_METHOD, ...middleware) {
  if (typeof method === 'function') {
    middleware.unshift(method);
    method = DEFAULT_METHOD;
  }
  return (target, key, descriptor) => {
    let m;
    if (typeof matcher === 'string') {
      const components = [];
      const names = [];
      for (let component of matcher.split('/')) {
        if (component[0] === ':') {
          names.push(component.slice(1));
          component = '([^/]*)';
        }
        components.push(component);
      }
      if (names.length) {
        const re = new RegExp(`^${components.join('/')}$`);
        m = (path) => {
          const matches = re.exec(path);
          if (matches) {
            const params = {};
            for (let i = 0, len = names.length; i < len; ++i) {
              params[names[i]] = matches[i + 1];
            }
            return params;
          }
          return null;
        };
      } else {
        m = (path) => path === matcher ?
          {} :
            null;
      }
    } else if (matcher instanceof RegExp) {
      m = (path) => matcher.exec(path);
    } else if (typeof matcher === 'function') {
      m = matcher;
    } else {
      throw new Error('matcher is must be function');
    }
    target._routes = target._routes || [];
    target._routes.push({
      fn: descriptor.value,
      matcher: m,
      method,
      middleware
    });
  };
}
