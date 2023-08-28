import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';

// I wish there was a more compact way to make this work both when compiling
// with commonjs (as with npm run preview) and with ECM modules (as with the
// standard run process)
let { Body, Container, Head, Html, Preview, Text, render } = components;
if (Body === undefined) {
  let comps = (components as any).default;
  Body = comps.Body;
  Container = comps.Container;
  Head = comps.Head;
  Html = comps.Html;
  Preview = comps.Preview;
  Text = comps.Text;
  render = comps.render;
}

export type SampleProps = {
  name: string;
  message: string;
};

const SampleHtml = ({ name = 'John Doe', message = 'Hello World longer' }: SampleProps) => (
  <Html>
    <Head />
    <Preview>A preview message would go here.</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={paragraph}>Hello {name},</Text>
        <Text style={paragraph}>{message}</Text>
      </Container>
    </Body>
  </Html>
);

const SamplePlain = ({ name = 'John Doe', message = 'Hello World' }: SampleProps) =>
  `Hello ${name},\n\n${message}`;

export const SampleRoute: EmailRoute = simpleEmailRoute<SampleProps>({
  slug: 'sample',
  summary: 'Greeting and a paragraph',
  description: 'A very basic email template to show how it works.',
  schema: s.object({
    name: s.string(
      { title: 'Name', description: "The name of the person to greet, e.g, 'John' or 'John Doe'" },
      { maxLength: 255 }
    ),
    message: s.string({
      title: 'Message',
      description: "The message to display, e.g, 'Hello World'",
    }),
  }),
  render: ({ name, message }, format) => {
    if (format === 'plain') {
      return SamplePlain({ name, message });
    }

    return render(<SampleHtml name={name} message={message} />);
  },
});

export default SampleHtml;

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'sans-serif',
};

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '26px',
};
