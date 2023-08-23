import { Readable } from 'stream';
import {
  finishWithEncodedServerResponse,
  parseAcceptEncoding,
  selectEncoding,
} from '../../lib/acceptEncoding';
import { Route } from '../../lib/route';
import { simpleRouteHandler } from '../../lib/simpleRouteHandler';
import { finishWithBadEncoding } from '../../lib/finishWithBadEncoding';

const helloWorldRoute: Route = {
  methods: ['GET'],
  path: '/hello_world',
  handler: simpleRouteHandler(async (args) => {
    const coding = selectEncoding(parseAcceptEncoding(args.req.headers['accept-encoding']));
    if (coding === null) {
      return finishWithBadEncoding(args);
    }

    args.resp.statusCode = 200;
    args.resp.statusMessage = 'OK';
    args.resp.setHeader('Vary', 'Accept-Encoding');
    args.resp.setHeader('Content-Encoding', coding.identifier);
    args.resp.setHeader('Content-Type', 'application/json; charset=utf-8');

    return finishWithEncodedServerResponse(
      args,
      coding,
      Readable.from(
        Buffer.from(
          JSON.stringify({
            message: 'Hello, world!',
          }) + '\n',
          'utf-8'
        )
      )
    );
  }),
  docs: [],
};

export default helloWorldRoute;
