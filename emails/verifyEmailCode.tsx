import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';

let { Link, Body, Container, Head, Html, Preview, Text, Hr, Img, Row, Column, Section, render } =
  components;
if (Body === undefined) {
  let comps = (components as any).default;
  Link = comps.Link;
  Body = comps.Body;
  Container = comps.Container;
  Head = comps.Head;
  Html = comps.Html;
  Preview = comps.Preview;
  Text = comps.Text;
  Hr = comps.Hr;
  Img = comps.Img;
  Row = comps.Row;
  Column = comps.Column;
  Section = comps.Section;
  render = comps.render;
}

export type VerifyEmailCodeProps = {
  code: string;
};

const VerifyEmailCode = ({ code = '23456CD' }: VerifyEmailCodeProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[300, 400, 600]} italicWeights={[300]} />
    </Head>
    <Preview>Use code {code} to verify your email address</Preview>
    <Body style={main}>
      <Container style={mainSection}>
        <Container style={logoContainer}>
          <Link href="https://oseh.io">
            <Img
              alt="Oseh Logo"
              src="https://oseh.io/email-assets/wordmark-white-225w.png"
              style={logo}
            />
          </Link>
        </Container>
        <Container style={logoSeparatorContainer}>
          <Hr style={logoSeparator} />
        </Container>
        <Container style={container}>
          <Text style={codeStyle}>{code}</Text>
          <Text style={messageStyle}>Paste the above code into the verification field</Text>
        </Container>
      </Container>
      <CommunitySection noUnsubscribe />
    </Body>
  </Html>
);

const VerifyEmailCodePlain = ({ code = '23456CD' }: VerifyEmailCodeProps) =>
  `Use code ${code} to verify your email address on Oseh.`;

export const VerifyEmailCodeRoute: EmailRoute = simpleEmailRoute<VerifyEmailCodeProps>({
  slug: 'verifyEmailCode',
  summary: 'A template for sending short verification codes to users',
  description:
    'A basic template to send an email to the user with a short code to verify their email address.',
  schema: s.object({
    code: s.string(
      {
        title: 'Code',
        description: 'The code that the user should use to verify their email address',
      },
      { minLength: 6, maxLength: 12 }
    ),
  }),
  render: (props, format) => {
    if (format === 'plain') {
      return VerifyEmailCodePlain(props);
    }

    return render(<VerifyEmailCode {...props} />);
  },
});

export default VerifyEmailCode;

const main = {
  backgroundColor: '#ffffff',
};

const container = {
  padding: '24px',
};

const mainSection = {
  backgroundColor: '#2D2E2E',
  margin: '0 auto',
  padding: '0 0 24px 0',
};

const logoContainer = {
  padding: '40px 0 24px 0',
};

const logo = {
  margin: '0 auto',
  width: '75px',
  height: '17.5px',
};

const logoSeparatorContainer = {
  padding: '0 16px',
};

const logoSeparator = {
  color: '#ffffff',
};

const codeStyle = {
  fontSize: '28px',
  color: '#ffffff',
  fontWeight: 300,
  textAlign: 'center',
  padding: '0 0 32px 0',
  lineHeight: '1.5',
} as const;

const messageStyle = {
  fontSize: '18px',
  color: '#ffffff',
  fontWeight: 300,
  textAlign: 'center',
  padding: '0 0 32px 0',
  lineHeight: '32px',
} as const;
