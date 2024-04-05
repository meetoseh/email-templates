import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import * as React from 'react';
import { LONG_DASH, RIGHT_SINGLE_QUOTE } from '../src/lib/SmartQuotesText';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import { CommunitySection } from '../src/lib/CommunitySection';
import { cta } from './dailyReminder';

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

export type EmailLaunchAnnouncementProps = {
  unsubscribeUrl: string;
};

const EmailLaunchAnnouncement = ({
  unsubscribeUrl = 'https://oseh.io',
}: EmailLaunchAnnouncementProps) => (
  <Html>
    <Head>
      <OpenSansFont weights={[400, 600]} italicWeights={[]} />
      <style>{`
        @media (max-width: 600px) {
          .smallImg {
            width: 180px !important;
            height: 180px !important;
          }

          .horizontalPadding {
            padding-left: 12px !important;
            padding-right: 12px !important;
          }
        }
      `}</style>
    </Head>
    <Preview>Transform Minutes into Moments of Mindfulness</Preview>
    <Body style={main}>
      <Section style={banner}>
        <Img
          src="https://oseh.io/email-assets/oseh30Launch/banner.jpg"
          alt="person in serene landscape"
          width="100%"
          height="331px"
          style={{ objectFit: 'cover' }}
        />
      </Section>
      <Section style={par0} className="horizontalPadding">
        <Text style={title1}>Reclaim Your Calm</Text>
        <Text style={body1}>
          Discover a world where peace of mind is a simple, accessible part of your daily routine.
          Today we are excited to announce Oseh 3.0, uniquely combining personalization with
          bite-sized content designed to seamlessly integrate mindfulness into the fabric of daily
          life.
        </Text>
        <Container style={ctaContainer}>
          <Link
            style={cta}
            href="https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=oseh30_launch&utm_content=topbtn_04042024">
            Try it Now
          </Link>
        </Container>
      </Section>
      <Section style={sepWrapper} className="horizontalPadding">
        <Section style={sep} />
      </Section>
      <Section style={par0b} className="horizontalPadding">
        <Text style={title2}>
          Oseh 3.0: A New Era of Mindfulness is Here: Bite-Sized, Tailored and Impactful
        </Text>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par1.png"
              alt="home page screenshot"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
          <Column style={rightText}>
            <Text style={title3}>Short classed tailored to your schedule</Text>
            <Text style={body}>
              Experience 1- to 5-minute journeys perfectly crafted for your busy life
            </Text>
          </Column>
        </Row>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column style={leftText}>
            <Text style={title3}>No endless browsing, just straight to what you need</Text>
            <Text style={body}>
              Just choose a mood and we{RIGHT_SINGLE_QUOTE}ll curate a class just for you.
            </Text>
          </Column>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par2.png"
              alt="emotions screenshot"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
        </Row>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par3.png"
              alt="series screenshots, stacked. top series name: Deep Relaxation by Allison Bag"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
          <Column style={rightText}>
            <Text style={title3}>Deepen your practice with expert-led series</Text>
            <Text style={body}>
              Embark on a mindful journey, explore diverse themes, and learn techniques from top
              teachers
            </Text>
          </Column>
        </Row>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column style={leftText}>
            <Text style={title3}>Celebrate your journey and achievements</Text>
            <Text style={body}>
              We{RIGHT_SINGLE_QUOTE}ll help you feel your best every day and track your progress
              along the way.
            </Text>
          </Column>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par4.png"
              alt="progress screenshot, 7 day streak"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
        </Row>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par5.png"
              alt="purchase oseh+ screen"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
          <Column style={rightText}>
            <Text style={title3}>Introducing Oseh+</Text>
            <Text style={body}>
              Oseh+ provides access to an extensive library of longer classes and series for just
              $13 a month or $99 a year.
            </Text>
          </Column>
        </Row>
      </Section>
      <Section style={leftRight} className="horizontalPadding">
        <Row>
          <Column style={leftText}>
            <Text style={title3}>Everything you already love for free</Text>
            <Text style={body}>
              We believe that mindfulness should be accessible to everyone. That{RIGHT_SINGLE_QUOTE}
              s why we designed Oseh 3 to continue to offer hundreds of minute-long classes for
              free.
            </Text>
          </Column>
          <Column>
            <Img
              src="https://oseh.io/email-assets/oseh30Launch/par6.png"
              alt="person meditating"
              width="270px"
              height="270px"
              className="smallImg"
            />
          </Column>
        </Row>
      </Section>
      <Section style={outro} className="horizontalPadding">
        <Text style={outroTitle}>Our mission is to make a better everyday for everyone.</Text>
        <Text style={outroBody}>
          Together, let{RIGHT_SINGLE_QUOTE}s explore the profound impact of mindfulness on our
          lives, and let{RIGHT_SINGLE_QUOTE}s join in sharing this beautiful gift with those around
          us {LONG_DASH} one moment at a time.
        </Text>
        <Container style={ctaContainerCenter}>
          <Link
            style={cta}
            href="https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=oseh30_launch&utm_content=botbtn_04042024">
            Try it Now
          </Link>
        </Container>
      </Section>
      <CommunitySection unsubscribeUrl={unsubscribeUrl} wide />
    </Body>
  </Html>
);

const EmailLaunchAnnouncementPlain = ({}: EmailLaunchAnnouncementProps) =>
  'Reclaim Your Calm\n' +
  `Discover a world where peace of mind is a simple, accessible part of your daily routine. Today we are excited to announce Oseh 3.0, uniquely combining personalization with bite-sized content designed to seamlessly integrate mindfulness into the fabric of daily life.\n\n` +
  `Oseh 3.0: A New Era of Mindfulness is Here: Bite-Sized, Tailored and Impactful\n\n` +
  `Short classed tailored to your schedule\n` +
  `Experience 1- to 5-minute journeys perfectly crafted for your busy life\n\n` +
  `No endless browsing, just straight to what you need\n` +
  `Just choose a mood and we${RIGHT_SINGLE_QUOTE}ll curate a class just for you.\n\n` +
  `Deepen your practice with expert-led series\n` +
  `Embark on a mindful journey, explore diverse themes, and learn techniques from top teachers\n\n` +
  `Celebrate your journey and achievements\n` +
  `We${RIGHT_SINGLE_QUOTE}ll help you feel your best every day and track your progress along the way.\n\n` +
  `Introducing Oseh+\n` +
  `Oseh+ provides access to an extensive library of longer classes and series for just $13 a month or $99 a year.\n\n` +
  `Everything you already love for free\n` +
  `We believe that mindfulness should be accessible to everyone. That${RIGHT_SINGLE_QUOTE}s why we designed Oseh 3 to continue to offer hundreds of minute-long classes for free.\n\n` +
  `Our mission is to make a better everyday for everyone.\n` +
  `Together, let${RIGHT_SINGLE_QUOTE}s explore the profound impact of mindfulness on our lives, and let${RIGHT_SINGLE_QUOTE}s join in sharing this beautiful gift with those around us - one moment at a time.\n\n` +
  'Try it Now: https://oseh.io?utm_source=oseh.io&utm_medium=email&utm_campaign=oseh30_launch&utm_content=plain_04042024\n\n' +
  'iOS App Store: https://apps.apple.com/app/apple-store/id6453520882\n\n' +
  'Google Play Store: https://play.google.com/store/apps/details?id=com.oseh.frontendapp\n';

export const EmailOseh30AnnouncementRoute: EmailRoute =
  simpleEmailRoute<EmailLaunchAnnouncementProps>({
    slug: 'emailOseh30Announcement',
    summary: 'The announcement email for Oseh 3.0',
    description: 'Informs a user that Oseh 3.0 is now publicly available',
    schema: s.object({
      unsubscribeUrl: s.string(
        {
          title: 'Unsubscribe URL',
          description: 'The URL to send the user to when they click the unsubscribe link.',
        },
        { maxLength: 2048 }
      ),
    }),
    render: (props, format) => {
      if (format === 'plain') {
        return EmailLaunchAnnouncementPlain(props);
      }

      return render(<EmailLaunchAnnouncement {...props} />);
    },
  });

const main = {
  backgroundColor: '#ffffff',
  width: '100%',
  padding: '0',
  margin: '0',
};

const wideSection = {
  maxWidth: '714px',
  margin: '0 auto',
};

const banner = {
  ...wideSection,
  width: '100%',
};

const ctaContainer = {
  textAlign: 'left',
  padding: '32px 0 80px 0',
} as const;

const par0 = {
  ...wideSection,
  backgroundColor: '#191C1D',
  paddingTop: '48px',
  paddingLeft: '66px',
  paddingRight: '66px',
};

const title1 = {
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '39.2px',
  color: '#eaeaeb',
};

const body = {
  fontWeight: 400,
  fontSize: '16px',
  lineHeight: '24px',
  color: '#eaeaeb',
};

const body1 = {
  ...body,
  paddingTop: '8px',
};

const sepWrapper = {
  ...wideSection,
  backgroundColor: '#191C1D',
  paddingLeft: '66px',
  paddingRight: '66px',
};
const sep = {
  height: '1px',
  backgroundColor: '#8B8E90',
};

const par0b = {
  ...wideSection,
  backgroundColor: '#191C1D',
  paddingTop: 32,
  paddingLeft: 66,
  paddingRight: 66,
};

const leftText = {
  paddingRight: '24px',
};

const rightText = {
  paddingLeft: '24px',
};

const title2 = {
  fontWeight: 600,
  fontSize: '28px',
  lineHeight: '39.2px',
  color: '#ffffff',
};

const leftRight = {
  ...wideSection,
  paddingLeft: '66px',
  paddingRight: '66px',
  paddingTop: '44px',
  paddingBottom: '44px',
  backgroundColor: '#191C1D',
  width: '100%',
};

const title3 = {
  fontWeight: 600,
  fontSize: '22px',
  lineHeight: '28.6px',
  color: '#eaeaeb',
};

const outro = {
  ...wideSection,
  backgroundColor: '#191C1D',
  paddingTop: '28px',
  paddingBottom: '44px',
  paddingLeft: '66px',
  paddingRight: '66px',
  width: '100%',
};

const outroTitle = {
  fontWeight: 600,
  fontSize: '20px',
  lineHeight: '24px',
  textAlign: 'center',
  color: '#eaeaeb',
} as const;

const outroBody = {
  fontWeight: 400,
  fontSize: '20px',
  lineHeight: '24px',
  paddingTop: '24px',
  color: '#eaeaeb',
  textAlign: 'center',
} as const;

const ctaContainerCenter = {
  ...ctaContainer,
  textAlign: 'center',
} as const;

export default EmailLaunchAnnouncement;
