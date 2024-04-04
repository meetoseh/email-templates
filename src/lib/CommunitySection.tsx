import * as components from '@react-email/components';
import * as React from 'react';

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

export const CommunitySection = ({
  unsubscribeUrl,
  unsubscribeHint = 'No longer want to receive these emails?',
  unsubscribeCTA = 'Unsubscribe',
  noUnsubscribe = false,
  wide = false,
}: {
  unsubscribeUrl?: string;
  unsubscribeHint?: string;
  unsubscribeCTA?: string;
  noUnsubscribe?: boolean;
  wide?: boolean;
}) => {
  const inner = (
    <Container style={container}>
      <Text style={joinOurCommunity}>Join Our Community</Text>
      <Section style={socialIconsSection}>
        <Row>
          <Column>
            <Link href="https://tiktok.com/@meetoseh">
              <Img
                alt="TikTok"
                src="https://oseh.io/email-assets/tiktok-white-on-black-96w.png"
                style={socialIcon}
              />
            </Link>
          </Column>
          <Column style={socialIconsSpacerColumn} />
          <Column>
            <Link href="https://instagram.com/meetoseh">
              <Img
                alt="Instagram"
                src="https://oseh.io/email-assets/instagram-white-on-black-96w.png"
                style={socialIcon}
              />
            </Link>
          </Column>
          <Column style={socialIconsSpacerColumn} />
          <Column>
            <Link href="https://x.com/meetoseh">
              <Img
                alt="TikTok"
                src="https://oseh.io/email-assets/x-black-96w.png"
                style={socialIconX}
              />
            </Link>
          </Column>
        </Row>
      </Section>
      {!noUnsubscribe && (
        <Text style={unsubscribe}>
          {unsubscribeHint}{' '}
          <Link style={unsubscribeLink} href={unsubscribeUrl}>
            {unsubscribeCTA}
          </Link>
        </Text>
      )}
      <Text
        style={{ ...addressLine, ...(noUnsubscribe ? firstAddressLineWithoutUnsubscribe : {}) }}>
        Oseh
      </Text>
      <Text style={addressLine}>1752 NW Market Street #4051 Seattle, Washington 98107</Text>
    </Container>
  );

  if (wide) {
    return <Section style={communitySectionWide}>{inner}</Section>;
  }
  return <Container style={communitySection}>{inner}</Container>;
};

const container = {
  padding: '24px',
};

const communitySection = {
  margin: '0 auto',
  backgroundColor: '#F9F9F9',
};

const communitySectionWide = {
  maxWidth: '714px',
  width: '100%',
  margin: '0 auto',
  backgroundColor: '#F9F9F9',
};

const joinOurCommunity = {
  color: '#1D3345',
  fontWeight: 600,
  textAlign: 'center',
  marginTop: '0',
  fontSize: '15px',
} as const;

const socialIconsSection = {
  width: `${24 * 3 + 24 * 2}px`,
} as const;
const socialIconsSpacerColumn = {
  width: '24px',
};
const socialIcon = {
  width: '24px',
  height: '24px',
};

const socialIconX = {
  width: '16px',
  height: '16px',
  padding: '4px',
};

const unsubscribe = {
  color: '#6f6f6f',
  textAlign: 'center',
  fontWeight: 300,
  fontSize: '10px',
} as const;

const unsubscribeLink = {
  color: '#6f6f6f',
  textAlign: 'center',
  fontWeight: 300,
  fontSize: '10px',
  textDecoration: 'underline',
} as const;

const addressLine = {
  color: '#6f6f6f',
  textAlign: 'center',
  fontWeight: 300,
  fontSize: '10px',
  margin: '0',
} as const;

const firstAddressLineWithoutUnsubscribe = {
  margin: '24px 0 0 0',
};
