import assert from 'power-assert';
import {router, route} from '..';

@router
class MyApp {
  @route('/')
  index(req, res) {
    res('index');
  }

  @route('/users/:userId')
  user(req, res) {
    res('user');
  }

  @route(/^\/posts\/(\d+)/)
  post(req, res) {
    res('post');
  }

  @route((path) => path.startsWith('/archives'))
  archive(req, res) {
    res('archives');
  }
}

describe('router-decorator', () => {
  it('static matcher', (done) => {
    const myApp = new MyApp();
    const req = {path: '/'};
    myApp(req, (called) => {
      assert(called === 'index');
      assert.deepStrictEqual(req.params, {});
      done();
    });
  });

  it('parameterized matcher', (done) => {
    const myApp = new MyApp();
    const req = {path: '/users/1'};
    myApp(req, (called) => {
      assert(called === 'user');
      assert.deepStrictEqual(req.params, {
        userId: '1'
      });
      done();
    });
  });

  it('regexp matcher', (done) => {
    const myApp = new MyApp();
    const req = {path: '/posts/1'};
    const res = {};
    myApp(req, (called) => {
      assert(called === 'post');
      assert(Array.isArray(req.params));
      assert(req.params.length === 2);
      assert(req.params[0] === '/posts/1');
      assert(req.params[1] === '1');
      done();
    });
  });

  it('function matcher', (done) => {
    const myApp = new MyApp();
    const req = {path: '/archives/2016'};
    const res = {};
    myApp(req, (called) => {
      assert(called === 'archives');
      assert(req.params === true);
      done();
    });
  });
});
