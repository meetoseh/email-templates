import { Command } from 'commander';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as readline from 'readline';
import chalk from 'chalk';
import { colorHttpMethod, colorHttpStatus, colorNow } from './logging';
import { CancelablePromise } from './lib/CancelablePromise';
import { handleUpdates } from './updater';
import * as slack from './slack';
import * as os from 'os';

async function main() {
  const program = new Command();
  program.version('0.0.1');
  program
    .option('-H, --host <hostname>', 'The host to bind to, e.g, 192.168.1.23')
    .option('-p, --port <port>', 'The port to bind to, e.g, 2999')
    .option(
      '-c, --ssl-certfile <path>',
      'The SSL certificate file to use; if not specified, SSL will not be used'
    )
    .option(
      '-k, --ssl-keyfile <path>',
      'The SSL key file to use; if not specified, SSL will not be used'
    )
    .parse();

  const options = program.opts();

  if (options.host === undefined) {
    console.error('--host is required');
    process.exit(1);
  }

  if (options.port === undefined) {
    console.error('--port is required');
    process.exit(1);
  }

  let portNumber: number | undefined = undefined;
  try {
    portNumber = parseInt(options.port);
  } catch (e) {
    console.error('--port must be a number');
    process.exit(1);
  }

  const sslCertfilePath: string | undefined = options.sslCertfile;
  const sslKeyfilePath: string | undefined = options.sslKeyfile;

  if ((sslCertfilePath === undefined) !== (sslKeyfilePath === undefined)) {
    console.error('--ssl-certfile and --ssl-keyfile must be specified together');
    process.exit(1);
  }

  let cert: Buffer | undefined = undefined;
  let key: Buffer | undefined = undefined;

  if (sslCertfilePath !== undefined && sslKeyfilePath !== undefined) {
    [cert, key] = await Promise.all([
      fs.promises.readFile(sslCertfilePath),
      fs.promises.readFile(sslKeyfilePath),
    ]);
  }

  let updaterRaw: CancelablePromise<void> | undefined = undefined;
  await new Promise<void>((resolve) => {
    updaterRaw = handleUpdates(resolve);
  });
  if (updaterRaw === undefined) {
    throw new Error('implementation error');
  }
  const updater = updaterRaw as CancelablePromise<void>;

  const requestHandler = handleRequests({
    host: options.host,
    port: portNumber,
    cert,
    key,
  });

  if (process.platform === 'win32') {
    var rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.on('SIGINT', function () {
      process.emit('SIGINT');
    });
  }

  process.on('SIGINT', () => {
    console.log(`${colorNow()} ${chalk.whiteBright('SIGINT received, shutting down...')}`);
    updater.cancel();
    requestHandler.cancel();
    Promise.all([updater.promise, requestHandler.promise]).finally(() => {
      console.log(`${colorNow()} ${chalk.whiteBright('shutdown complete')}`);
      process.exit(0);
    });
  });

  if (process.env['ENVIRONMENT'] !== 'dev' || true) {
    slack.sendMessageTo('ops', `email-templates ${os.hostname()} ready`);
  }
}

/**
 * Initializes the http or https server as appropriate given the provided
 * options, and begins listening for requests. Returns the initialized server.
 */
function handleRequests({
  host,
  port,
  cert,
  key,
}: {
  host: string;
  port: number;
  cert: Buffer | undefined;
  key: Buffer | undefined;
}): CancelablePromise<void> {
  const handleRequest = timeRequestMiddleware.bind(undefined, defaultRequestHandler);

  let server: http.Server | https.Server;
  if (cert === undefined || key === undefined) {
    server = http.createServer(handleRequest);
    server.listen(port, host, () => {
      console.log(
        `${colorNow()} ${chalk.whiteBright(`server listening on http://${host}:${port}`)}`
      );
    });
  } else {
    server = https.createServer({ cert, key }, handleRequest);
    server.listen(port, host, () => {
      console.log(
        `${colorNow()} ${chalk.whiteBright(`server listening on https://${host}:${port}`)}`
      );
    });
  }

  let done = false;
  let resolve: (() => void) | undefined = undefined;

  const promise = new Promise<void>((r) => {
    resolve = r;
    if (done) {
      resolve();
    }
  });

  return {
    done: () => done,
    cancel: () => {
      if (done) {
        return;
      }
      server.close(() => {
        if (!done) {
          done = true;
          console.log(`${colorNow()} ${chalk.gray('listening socket closed')}`);
          resolve?.();
        }
      });
    },
    promise,
  };
}

async function timeRequestMiddleware(
  next: (req: http.IncomingMessage, res: http.ServerResponse) => Promise<void>,
  req: http.IncomingMessage,
  res: http.ServerResponse
) {
  const requestStartedAt = performance.now();
  await next(req, res);
  const requestFinishedAt = performance.now();

  console.info(
    `${colorNow()} ${colorHttpMethod(req.method)} ${chalk.white(`${req.url} -> `)}${colorHttpStatus(
      res.statusCode,
      res.statusMessage
    )}${chalk.white(
      ` in ${(requestFinishedAt - requestStartedAt).toLocaleString(undefined, {
        maximumFractionDigits: 3,
      })}ms`
    )}`
  );
}

async function defaultRequestHandler(req: http.IncomingMessage, res: http.ServerResponse) {
  res.statusCode = 200;
  res.statusMessage = 'OK';
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World (with middleware) (v0.0.3)\n');
}

main();
