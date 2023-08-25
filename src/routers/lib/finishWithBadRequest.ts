import { Readable } from 'stream';
import { RouteBodyArgs } from './RouteBodyArgs';
import { acceptableEncodingsHeader, finishWithEncodedServerResponse } from './acceptEncoding';

/**
 * Writes a generic 400 bad request response to the given request. This should
 * only be used for very low-level mistakes, like a bad content-length header,
 * which are unlikely to occur in normal usage. Otherwise, prefer sending back
 * a better error message.
 */
export const finishWithBadRequest = (args: RouteBodyArgs) => {
  args.resp.statusCode = 400;
  args.resp.statusMessage = 'Bad Request';
  args.resp.setHeader('Vary', 'Accept-Encoding');
  args.resp.setHeader('Accept-Encoding', acceptableEncodingsHeader);
  return finishWithEncodedServerResponse(args, 'identity', Readable.from(Buffer.from('')));
};
