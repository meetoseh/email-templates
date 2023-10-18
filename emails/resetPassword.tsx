import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';
import { ctaContainer, cta } from './dailyReminder';

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

export type ResetPasswordProps = {
  email: string;
  code: string;
};

const ResetPassword = ({
  email = 'test@example.com',
  code = 'RQoMI6Gx4-NYJgG6GlIx9KTI8APssWTbm1bBPLMCL0J9WhY74gREzQtsAK5f_pCY19kdeRCm7k5DWYGdLyqAvg',
}: ResetPasswordProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[300, 400, 600]} italicWeights={[300]} />
    </Head>
    <Preview>Follow the link to reset your password</Preview>
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
          <Text style={titleStyle}>Reset your password</Text>
          <Text style={messageStyle}>
            If you just requested a password reset on Oseh, click on the button below to complete
            the process. Otherwise, you can ignore this email.
          </Text>
          <Container style={ctaContainer}>
            <Link
              href={`https://oseh.io/update-password?${new URLSearchParams({ code, email })}`}
              style={cta}>
              Reset Password
            </Link>
          </Container>
        </Container>
      </Container>
      <CommunitySection noUnsubscribe />
    </Body>
  </Html>
);

const ResetPasswordPlain = ({
  code = 'RQoMI6Gx4-NYJgG6GlIx9KTI8APssWTbm1bBPLMCL0J9WhY74gREzQtsAK5f_pCY19kdeRCm7k5DWYGdLyqAvg',
  email = 'test@example.com',
}: ResetPasswordProps) =>
  `Follow the link to reset your password: https://oseh.io/update-password?${new URLSearchParams({
    code,
    email,
  })}`;

export const ResetPasswordRoute: EmailRoute = simpleEmailRoute<ResetPasswordProps>({
  slug: 'resetPassword',
  summary: 'A template for sending reset password links to users',
  description:
    'A basic template containing a call to action to click a link to reset their password',
  schema: s.object({
    code: s.string(
      {
        title: 'Code',
        description: 'The code that the user should use to verify their email address',
      },
      { minLength: 32, maxLength: 255 }
    ),
    email: s.string(
      {
        title: 'Email address',
        description: 'The email address that will receive the email; included in the link',
      },
      { minLength: 1, maxLength: 2047 }
    ),
  }),
  render: (props, format) => {
    if (format === 'plain') {
      return ResetPasswordPlain(props);
    }

    return render(<ResetPassword {...props} />);
  },
});

export default ResetPassword;

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

const titleStyle = {
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
