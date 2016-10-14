import express from 'express';
import {router, route} from '..';

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
