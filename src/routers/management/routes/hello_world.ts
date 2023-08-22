import { Callbacks } from '../../../lib/Callbacks';
import { createCancelablePromiseFromCallbacks } from '../../../lib/createCancelablePromiseFromCallbacks';
import { writeServerResponse } from '../../../lib/writeServerResponse';
import { Route } from '../../lib/route';

const helloWorldRoute: Route = {
  methods: ['GET'],
  path: '/hello_world',
  handler: () => (req, resp) => {
    let tentativelyDone = false;
    let done = false;
    const cancelers = new Callbacks<undefined>();

    return {
      done: () => done,
      cancel: () => {
        if (!tentativelyDone) {
          tentativelyDone = true;
          cancelers.call(undefined);
        }
      },
      promise: new Promise<void>(async (resolve, reject) => {
        if (tentativelyDone) {
          reject(new Error('canceled'));
        }

        const canceled = createCancelablePromiseFromCallbacks(cancelers);

        resp.statusCode = 200;
        resp.statusMessage = 'OK';
        resp.setHeader('Content-Type', 'text/plain');

        let writePromise = writeServerResponse(resp, Buffer.from('Hello, world!\n', 'utf-8'), {
          endStream: true,
        });
        try {
          await Promise.race([canceled.promise, writePromise.promise]);
        } catch (e) {
          canceled.cancel();
          writePromise.cancel();
          if (tentativelyDone) {
            reject(new Error('canceled'));
            return;
          }

          tentativelyDone = true;
          reject(e);
          return;
        }

        if (tentativelyDone) {
          writePromise.cancel();
          reject(new Error('canceled'));
          return;
        }

        resolve();
      }).finally(() => {
        done = true;
      }),
    };
  },
  docs: [],
};

export default helloWorldRoute;
