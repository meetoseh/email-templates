# Oseh Email Templates

This supports a live preview right in your browser so you don't need to keep
sending real emails during development. However, the main entry point is intended
for serving HTML/plaintext versions of emails which have props from authenticated
HTTP Post requests.

This also serves an OpenAPI schema so that the available templates and their props
are programatically discoverable. This endpoint is also authenticated.

## Getting Started

First, install the dependencies:

```sh
git-lfs install
npm install
```

### Editing Templates

If you just want to edit the templates

```sh
npm run preview
```

Open [localhost](http://localhost:3000) with your browser to see the result.

### Serving Templates

If you want to be able to serve the the necessary endpoints for the web backend
to be able to send emails (and the admin dashboard to preview them), ensure the
`email-templates` folder is adjacent to the `web-backend` folder and set the
standard environment variables and run with a command similar to the following
(with e.g., the hostname updated to match your ip)

```sh
npx ts-node --experimental-specifier-resolution=node --esm src/index.ts --host 192.168.1.23 --port 2999 --ssl-certfile oseh-dev.com.pem --ssl-keyfile oseh-dev.com-key.pem
```

Typically, requests would then be served at
[oseh-dev.com:2999](https://oseh-dev.com:2999), assuming you are injecting the
appropriate self-signed certificates and DNS remapping.

## License

2023 Oseh Inc, All Rights Reserved
