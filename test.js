const http = require('http');
const assert = require('assert');

const app = require('./test');

const PORT = process.env.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

let server;

before(() => {
  server = http.createServer(app);
  server.listen(PORT);
});

after(() => {
  server.close();
});

describe('Server tests', () => {
  it('should start the server on the specified port', (done) => {
    http.get(BASE_URL, (res) => {
      assert.strictEqual(res.statusCode, 200);
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        assert.strictEqual(body, 'Hello Node!\n');
        done();
      });
    });
  });

  it('should return a 200 status code', (done) => {
    http.get(BASE_URL, (res) => {
      assert.strictEqual(res.statusCode, 200);
      done();
    });
  });

  it('should return the expected response message', (done) => {
    http.get(BASE_URL, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        assert.strictEqual(body, 'Hello Node!\n');
        done();
      });
    });
  });

  it('should handle multiple requests simultaneously', (done) => {
    const requests = [];
    for (let i = 0; i < 10; i++) {
      requests.push(http.get(BASE_URL));
    }
    Promise.all(requests)
      .then((responses) => {
        responses.forEach((res) => {
          assert.strictEqual(res.statusCode, 200);
          let body = '';
          res.on('data', (chunk) => {
            body += chunk;
          });
          res.on('end', () => {
            assert.strictEqual(body, 'Hello Node!\n');
          });
        });
        done();
      })
      .catch((err) => {
        done(err);
      });
  });

  it('should not handle non-GET requests', (done) => {
    const req = http.request({ method: 'POST', port: PORT }, (res) => {
      assert.strictEqual(res.statusCode, 405);
      done();
    });
    req.end();
  });
});
