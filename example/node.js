import http from 'http';
import {router, route} from '..';

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
