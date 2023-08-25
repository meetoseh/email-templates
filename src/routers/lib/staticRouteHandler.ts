import { IncomingMessage, ServerResponse } from 'http';
import { CancelablePromise } from '../../lib/CancelablePromise';
import { simpleRouteHandler } from './simpleRouteHandler';
import {
  AcceptableEncoding,
  acceptableEncodings,
  finishWithEncodedServerResponse,
  parseAcceptEncoding,
  selectEncoding,
  supportedEncodings,
} from './acceptEncoding';
import * as fs from 'fs';
import * as crypto from 'crypto';
import { finishWithBadEncoding } from './finishWithBadEncoding';
import { finishWithServiceUnavailable } from './finishWithServiceUnavailable';

/**
 * A static route handler, which just serves the contents of the file at the
 * given location. The file is compressed eagerly, so that when it is served
 * it is a simple matter of piping the compressed file to the response.
 *
 * @param filepath The path to the file to serve.
 * @param options.contentType The content type to serve the file as.
 */
export const staticRouteHandler = async (
  filepath: string,
  options: {
    contentType: string;
  }
): Promise<
  (routerPrefix: string) => (req: IncomingMessage, resp: ServerResponse) => CancelablePromise<void>
> => {
  const hasher = crypto.createHash('sha512');
  hasher.update(filepath, 'utf-8');
  const cacheKey = hasher.digest('base64url');

  await Promise.all(
    acceptableEncodings.map((encoding) =>
      compress(filepath, `tmp/${cacheKey}.${encoding}`, encoding)
    )
  );
  return simpleRouteHandler(async (args) => {
    const coding = selectEncoding(parseAcceptEncoding(args.req.headers['accept-encoding']));
    if (coding === null) {
      return finishWithBadEncoding(args);
    }
    let responseStream;
    try {
      responseStream = fs.createReadStream(`tmp/${cacheKey}.${coding}`, {
        autoClose: true,
      });
    } catch (e) {
      return finishWithServiceUnavailable(args, { retryAfterSeconds: 60 });
    }

    args.resp.statusCode = 200;
    args.resp.statusMessage = 'OK';
    args.resp.setHeader('Vary', 'Accept-Encoding');
    args.resp.setHeader('Content-Encoding', coding);
    args.resp.setHeader('Content-Type', options.contentType);
    args.resp.setHeader(
      'Cache-Control',
      'public, max-age=2, stale-while-revalidate=10, stale-if-error=86400'
    );
    return finishWithEncodedServerResponse(args, 'identity', responseStream);
  });
};

/**
 * Compresses the given file to the given location using the given encoding.
 *
 * @param inpath The path to the file to compress.
 * @param outpath The path to the file to write the compressed file to.
 * @param encoding The encoding to use.
 */
const compress = async (inpath: string, outpath: string, encoding: AcceptableEncoding) => {
  try {
    fs.unlinkSync(outpath);
  } catch (e) {}

  const inStream = fs.createReadStream(inpath, {
    autoClose: true,
  });
  const adaptedStream = supportedEncodings[encoding](inStream);

  await fs.promises.writeFile(outpath + '.tmp', adaptedStream);
  fs.renameSync(outpath + '.tmp', outpath);
};
