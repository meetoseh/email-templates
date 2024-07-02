import * as components from '@react-email/components';
import { EmailRoute } from '../src/routers/email/lib/emailRoute';
import { simpleEmailRoute } from '../src/routers/email/lib/simpleEmailRoute';
import s from '../src/routers/lib/schemaHelpers';
import { OpenSansFont } from '../src/lib/OpenSansFont';
import * as React from 'react';

// I wish there was a more compact way to make this work both when compiling
// with commonjs (as with npm run preview) and with ECM modules (as with the
// standard run process)
let { Body, Column, Head, Hr, Html, Link, Preview, Text, Row, Section, Img, render } = components;
if (Body === undefined) {
  let comps = (components as any).default;
  Body = comps.Body;
  Column = comps.Column;
  Head = comps.Head;
  Hr = comps.Hr;
  Html = comps.Html;
  Link = comps.Link;
  Preview = comps.Preview;
  Text = comps.Text;
  Row = comps.Row;
  Section = comps.Section;
  Img = comps.Img;
  render = comps.render;
}

type BrandedV1ComponentBuilder_Text<
  T extends string,
  WeightT extends string = 'normal' | 'semibold',
> = {
  type: T;
  text: string;
  weight: WeightT;
  align: 'left' | 'center';
  color: 'white' | 'light' | 'smoke';
};

type BrandedV1ComponentH1 = BrandedV1ComponentBuilder_Text<'h1'>;
type BrandedV1ComponentH2 = BrandedV1ComponentBuilder_Text<'h2'>;
type BrandedV1ComponentH3 = BrandedV1ComponentBuilder_Text<'h3'>;
type BrandedV1ComponentTitle = BrandedV1ComponentBuilder_Text<'title'>;
type BrandedV1ComponentBodyLarge = BrandedV1ComponentBuilder_Text<'body-large', 'normal'>;
type BrandedV1ComponentBody = BrandedV1ComponentBuilder_Text<'body', 'normal'>;
type BrandedV1ComponentDetail1 = BrandedV1ComponentBuilder_Text<'detail-1', 'normal'>;
type BrandedV1ComponentDetail2 = BrandedV1ComponentBuilder_Text<'detail-2', 'normal'>;
type BrandedV1ComponentDetail3 = BrandedV1ComponentBuilder_Text<'detail-3', 'normal'>;
type BrandedV1ComponentGroup_Text =
  | BrandedV1ComponentH1
  | BrandedV1ComponentH2
  | BrandedV1ComponentH3
  | BrandedV1ComponentTitle
  | BrandedV1ComponentBodyLarge
  | BrandedV1ComponentBody
  | BrandedV1ComponentDetail1
  | BrandedV1ComponentDetail2
  | BrandedV1ComponentDetail3;

const textTypes = [
  'h1',
  'h2',
  'h3',
  'title',
  'body-large',
  'body',
  'detail-1',
  'detail-2',
  'detail-3',
] as const;

type BrandedV1ComponentSpacer = { type: 'spacer'; height: number };
type BrandedV1ComponentBanner2To1 = { type: 'banner-2:1'; image: string };
type BrandedV1ComponentHorizontalRule = {
  type: 'horizontal-rule';
  width: 'full' | 'content' | 'half';
  color: 'white' | 'light' | 'smoke' | 'grey' | 'dark-grey' | 'charcoal' | 'dark';
  above: number;
  below: number;
};
type BrandedV1ComponentAppLinks = { type: 'app-links' };
type BrandedV1ComponentTextImageSideBySide = {
  type: 'text-image-side-by-side';
  text: { header: string; body: string; on: 'left' | 'right' };
  image: string;
  alpha: boolean;
};
type BrandedV1ComponentCTA = {
  type: 'cta';
  text: string;
  url: string;
  align: 'left' | 'center' | 'right';
};
type BrandedV1ComponentFooter = { type: 'footer'; unsubscribe: string };

type BrandedV1Component =
  | BrandedV1ComponentGroup_Text
  | BrandedV1ComponentSpacer
  | BrandedV1ComponentBanner2To1
  | BrandedV1ComponentHorizontalRule
  | BrandedV1ComponentAppLinks
  | BrandedV1ComponentTextImageSideBySide
  | BrandedV1ComponentCTA
  | BrandedV1ComponentFooter;

export type BrandedV1Props = {
  preview?: string | null;
  components: BrandedV1Component[];
};

const BrandedV1Html = ({
  preview,
  components = [
    {
      type: 'h1',
      text: 'Big header',
      weight: 'semibold',
      align: 'left',
      color: 'white',
    },
    {
      type: 'spacer',
      height: 40,
    },
    {
      type: 'body',
      text: 'This is some text\nwith newlines so you can see they are\npreserved',
      weight: 'normal',
      align: 'left',
      color: 'light',
    },
  ],
}: BrandedV1Props) => (
  <Html>
    <Head>
      <OpenSansFont
        weights={(() => {
          const weights = new Set<number>();
          const numPossibleWeights = Object.keys(fontWeightsByName).length;
          const textTypesSet = new Set(textTypes as unknown as string[]);
          for (const c of components) {
            if (textTypesSet.has(c.type)) {
              weights.add(fontWeightsByName[(c as BrandedV1ComponentBuilder_Text<string>).weight]);
              if (weights.size >= numPossibleWeights) {
                break;
              }
            }
          }
          if (weights.size === 0) {
            weights.add(400);
          }
          return Array.from(weights);
        })()}
      />
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
    {preview && <Preview>{preview}</Preview>}
    <Body
      style={{
        width: '100%',
        padding: '0',
        margin: '0',
      }}>
      {components.map((c, idx) => {
        switch (c.type) {
          case 'h1':
            return <TextBuilder key={idx} size={28} lineHeight={33.6} {...c} />;
          case 'h2':
            return <TextBuilder key={idx} size={22} lineHeight={28.6} {...c} />;
          case 'h3':
            return <TextBuilder key={idx} size={20} lineHeight={24} {...c} />;
          case 'title':
            return <TextBuilder key={idx} size={17} lineHeight={20.4} {...c} />;
          case 'body-large':
            return <TextBuilder key={idx} size={18} lineHeight={27} {...c} />;
          case 'body':
            return <TextBuilder key={idx} size={16} lineHeight={24} {...c} />;
          case 'detail-1':
            return <TextBuilder key={idx} size={14} lineHeight={16.8} {...c} />;
          case 'detail-2':
            return <TextBuilder key={idx} size={12} lineHeight={15.6} {...c} />;
          case 'detail-3':
            return <TextBuilder key={idx} size={10} lineHeight={13} {...c} />;
          case 'spacer':
            return <Spacer key={idx} height={c.height} />;
          case 'banner-2:1':
            return (
              <Section
                key={idx}
                style={{
                  margin: '0 auto',
                  marginTop: '0',
                  marginBottom: '0',
                  padding: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                  maxWidth: '714px',
                  backgroundColor: colorsByName.dark,
                }}>
                <Img
                  src={`${process.env.ROOT_BACKEND_URL}/api/1/image_files/image/email/${c.image}.jpeg`}
                  width="714"
                  height="357"
                  style={{
                    width: '100%',
                    height: 'auto',
                  }}
                />
              </Section>
            );
          case 'horizontal-rule':
            return (
              <React.Fragment key={idx}>
                <Spacer height={c.above} />
                <Section
                  style={{
                    margin: '0 auto',
                    marginTop: '0',
                    marginBottom: '0',
                    padding: '0',
                    paddingTop: '0',
                    paddingBottom: '0',
                    maxWidth: '714px',
                    backgroundColor: colorsByName.dark,
                  }}
                  className={c.width === 'content' ? 'horizontalPadding' : undefined}>
                  <Hr
                    style={{
                      width: c.width === 'half' ? '50%' : '100%',
                      margin: '0 auto',
                      marginTop: '0',
                      marginBottom: '0',
                      padding: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                      border: '0',
                      borderTop: `1px solid ${colorsByName[c.color]}`,
                    }}
                  />
                </Section>
                <Spacer height={c.below} />
              </React.Fragment>
            );
          case 'app-links':
            return (
              <Section
                style={{
                  margin: '0 auto',
                  marginTop: '0',
                  marginBottom: '0',
                  padding: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                  maxWidth: '714px',
                  backgroundColor: colorsByName.dark,
                }}>
                <Section
                  style={{
                    margin: '0 auto',
                    marginTop: '0',
                    marginBottom: '0',
                    padding: '0',
                    paddingTop: '0',
                    paddingBottom: '0',
                  }}
                  width="auto">
                  <Link href="https://apps.apple.com/app/apple-store/id6453520882">
                    <Img
                      alt="Download on the app store"
                      src="https://oseh.io/email-assets/download-on-the-app-store-badge-630w.png"
                      width={630}
                      height={211}
                      style={{
                        width: '210px',
                        height: '70.3333333px',
                      }}
                    />
                  </Link>
                </Section>
                <Spacer height={24} />
                <Section
                  style={{
                    margin: '0 auto',
                    marginTop: '0',
                    marginBottom: '0',
                    padding: '0',
                    paddingTop: '0',
                    paddingBottom: '0',
                  }}
                  width="auto">
                  <Link href="https://apps.apple.com/app/apple-store/id6453520882">
                    <Img
                      alt="Get it on Google Play"
                      src="https://oseh.io/email-assets/google-play-badge-630w.png"
                      width={630}
                      height={187}
                      style={{
                        width: '210px',
                        height: '62.3333333px',
                      }}
                    />
                  </Link>
                </Section>
              </Section>
            );
          case 'text-image-side-by-side':
            const text = (
              <React.Fragment>
                {breakLines(c.text.header).map((line, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontWeight: fontWeightsByName.semibold,
                      textAlign: 'left',
                      color: colorsByName.light,
                      fontSize: '22px',
                      lineHeight: '28.6px',
                      marginLeft: '0',
                      marginRight: '0',
                      marginTop: idx === 0 ? '0' : '14.3px',
                      marginBottom: '0',
                      padding: '0',
                      paddingLeft: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                      paddingRight: '0',
                    }}>
                    {line}
                  </Text>
                ))}
                <Spacer height={8} />
                {breakLines(c.text.body).map((line, idx) => (
                  <Text
                    key={idx}
                    style={{
                      fontWeight: fontWeightsByName.normal,
                      textAlign: 'left',
                      color: colorsByName.light,
                      fontSize: '16px',
                      lineHeight: '24px',
                      marginLeft: '0',
                      marginRight: '0',
                      marginTop: idx === 0 ? '0' : '12px',
                      marginBottom: '0',
                      padding: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                    }}>
                    {line}
                  </Text>
                ))}
              </React.Fragment>
            );
            const img = (
              <Img
                src={`${process.env.ROOT_BACKEND_URL}/api/1/image_files/image/email/${c.image}.${
                  c.alpha ? 'png' : 'jpeg'
                }`}
                width="270"
                height="270"
                style={{
                  width: '270px',
                  height: '270px',
                }}
                className="smallImg"
              />
            );

            return (
              <Section
                key={idx}
                style={{
                  margin: '0 auto',
                  marginTop: '0',
                  marginBottom: '0',
                  padding: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                  maxWidth: '714px',
                  backgroundColor: colorsByName.dark,
                }}>
                <Row
                  style={{
                    margin: '0 auto',
                    marginTop: '0',
                    marginBottom: '0',
                    padding: '0',
                    paddingTop: '0',
                    paddingBottom: '0',
                    maxWidth: '582px',
                  }}>
                  <Column className={c.text.on !== 'left' ? 'smallImg' : undefined}>
                    {c.text.on === 'left' ? text : img}
                  </Column>
                  <Column style={{ width: '8px' }} />
                  <Column className={c.text.on === 'left' ? 'smallImg' : undefined}>
                    {c.text.on === 'left' ? img : text}
                  </Column>
                </Row>
              </Section>
            );
          case 'cta':
            return (
              <Section
                key={idx}
                style={{
                  margin: '0 auto',
                  marginTop: '0',
                  marginBottom: '0',
                  padding: '0',
                  paddingTop: '0',
                  paddingBottom: '0',
                  maxWidth: '714px',
                  backgroundColor: colorsByName.dark,
                }}
                className="horizontalPadding">
                <Section
                  style={{
                    width: 'auto',
                    margin:
                      c.align === 'left' ? '0' : c.align === 'center' ? '0 auto' : '0 0 0 auto',
                  }}>
                  <Link
                    href={c.url}
                    style={{
                      display: 'block',
                      textDecoration: 'none',
                      color: colorsByName.dark,
                      backgroundColor: colorsByName.light,
                      borderRadius: '100px',
                      padding: '16px 80px',
                      paddingTop: '16px',
                      paddingBottom: '16px',
                      paddingLeft: '80px',
                      fontSize: '16px',
                      lineHeight: '24px',
                      fontWeight: '400',
                      textAlign: 'center',
                      margin: '0',
                      marginTop: '0',
                      marginBottom: '0',
                    }}>
                    {c.text}
                  </Link>
                </Section>
              </Section>
            );
          case 'footer':
            return (
              <React.Fragment key={idx}>
                <Section
                  style={{
                    margin: '0 auto',
                    marginTop: '0',
                    marginBottom: '0',
                    padding: '0 9px',
                    paddingTop: '0',
                    paddingBottom: '0',
                    paddingLeft: '9px',
                    paddingRight: '9px',
                    maxWidth: '714px',
                    backgroundColor: colorsByName.dark,
                  }}>
                  <Section
                    style={{
                      margin: '0',
                      marginTop: '0',
                      marginBottom: '0',
                      padding: '0',
                      paddingTop: '0',
                      paddingBottom: '0',
                      maxWidth: '714px',
                      backgroundColor: colorsByName['dark-grey'],
                    }}>
                    <Spacer height={39} noBackground />
                    <Text
                      style={{
                        fontWeight: fontWeightsByName.normal,
                        textAlign: 'center',
                        color: colorsByName.light,
                        fontSize: '18px',
                        lineHeight: '27px',
                        margin: '0 auto',
                        marginTop: '0',
                        marginBottom: '0',
                        padding: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}>
                      Join Our Community
                    </Text>
                    <Spacer height={16} noBackground />
                    <Row
                      width={80}
                      style={{
                        margin: '0 auto',
                        marginTop: '0',
                        marginBottom: '0',
                        padding: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}>
                      <Column
                        width={32}
                        style={{
                          margin: '0',
                          marginTop: '0',
                          marginBottom: '0',
                          padding: '0',
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}>
                        <Link
                          href="https://www.instagram.com/meetoseh"
                          style={{
                            margin: '0',
                            marginTop: '0',
                            marginBottom: '0',
                            padding: '0',
                            paddingTop: '0',
                            paddingBottom: '0',
                          }}>
                          <Img
                            src="https://oseh.io/email-assets/instagram-black-on-white-96w.png"
                            width={96}
                            height={96}
                            style={{ width: '32px', height: '32px' }}
                            alt="Instagram"
                          />
                        </Link>
                      </Column>
                      <Column
                        width={16}
                        style={{
                          margin: '0',
                          marginTop: '0',
                          marginBottom: '0',
                          padding: '0',
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}
                      />
                      <Column
                        width={32}
                        style={{
                          margin: '0',
                          marginTop: '0',
                          marginBottom: '0',
                          padding: '0',
                          paddingTop: '0',
                          paddingBottom: '0',
                        }}>
                        <Link
                          href="https://www.youtube.com/@meetoseh"
                          style={{
                            margin: '0',
                            marginTop: '0',
                            marginBottom: '0',
                            padding: '0',
                            paddingTop: '0',
                            paddingBottom: '0',
                          }}>
                          <Img
                            src="https://oseh.io/email-assets/youtube-black-on-white-96w.png"
                            width={96}
                            height={96}
                            style={{ width: '32px', height: '32px' }}
                            alt="YouTube"
                          />
                        </Link>
                      </Column>
                    </Row>
                    <Spacer height={32} noBackground />
                    <Text
                      style={{
                        fontWeight: fontWeightsByName.normal,
                        textAlign: 'center',
                        color: colorsByName.smoke,
                        fontSize: '12px',
                        lineHeight: '15.6px',
                        margin: '0 auto',
                        marginTop: '0',
                        marginBottom: '0',
                        padding: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}>
                      No longer want to receive these emails?{' '}
                      <Link
                        href={c.unsubscribe}
                        style={{
                          color: colorsByName.smoke,
                          textDecorationColor: colorsByName.smoke,
                          textDecoration: 'underline',
                        }}>
                        Unsubscribe
                      </Link>
                    </Text>
                    <Spacer height={8} noBackground />
                    <Text
                      style={{
                        fontWeight: fontWeightsByName.normal,
                        textAlign: 'center',
                        color: colorsByName.smoke,
                        fontSize: '12px',
                        lineHeight: '15.6px',
                        margin: '0 auto',
                        marginTop: '0',
                        marginBottom: '0',
                        padding: '0',
                        paddingTop: '0',
                        paddingBottom: '0',
                      }}>
                      Oseh | 1752 NW Market Street #4501 | Seattle, Washington 98107
                    </Text>
                    <Spacer height={39} noBackground />
                  </Section>
                </Section>
                <Spacer height={9} />
              </React.Fragment>
            );
          default:
            return <React.Fragment key={idx} />;
        }
      })}
    </Body>
  </Html>
);

const Spacer = ({ height, noBackground }: { height: number; noBackground?: boolean }) => (
  <Section
    style={{
      height: `${height}px`,
      margin: '0 auto',
      marginTop: '0',
      marginBottom: '0',
      padding: '0',
      paddingTop: '0',
      paddingBottom: '0',
      maxWidth: '714px',
      ...(noBackground
        ? {}
        : {
            backgroundColor: colorsByName.dark,
          }),
    }}
  />
);

const fontWeightsByName = {
  normal: 400,
  semibold: 600,
} as const;

const colorsByName = {
  white: '#ffffff',
  light: '#eaeaeb',
  smoke: '#c8cdd0',
  grey: '#8B8E90',
  'dark-grey': '#383838',
  charcoal: '#232323',
  dark: '#191C1D',
} as const;

const TextBuilder = ({
  text,
  weight,
  align,
  color,
  size,
  lineHeight,
}: {
  text: string;
  weight: keyof typeof fontWeightsByName;
  align: 'left' | 'center';
  color: keyof typeof colorsByName;
  size: number;
  lineHeight: number;
}) => {
  return (
    <Section
      style={{
        maxWidth: '714px',
        margin: '0 auto',
        backgroundColor: colorsByName.dark,
      }}
      className="horizontalPadding">
      {breakLines(text).map((line, idx) => (
        <Text
          key={idx}
          style={{
            fontWeight: fontWeightsByName[weight],
            textAlign: align,
            color: colorsByName[color],
            fontSize: `${size}px`,
            lineHeight: `${lineHeight}px`,
            margin: '0 auto',
            marginTop:
              idx === 0
                ? '0'
                : `${(lineHeight * 0.5).toLocaleString(undefined, { maximumFractionDigits: 2 })}px`,
            marginBottom: '0',
            padding: '0',
            paddingTop: '0',
            paddingBottom: '0',
            maxWidth: '582px',
          }}>
          {line}
        </Text>
      ))}
    </Section>
  );
};

const breakLines = (text: string) =>
  text
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

const BrandedV1Plain = ({
  preview = 'Preview text would go here',
  components = [
    {
      type: 'body',
      text: 'This is some text',
      weight: 'normal',
      align: 'left',
      color: 'light',
    },
  ],
}: BrandedV1Props) => {
  return components
    .map((c) => {
      switch (c.type) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'title':
        case 'body-large':
        case 'body':
        case 'detail-1':
        case 'detail-2':
        case 'detail-3':
          return `${c.text}\n\n`;
        case 'horizontal-rule':
          return '---\n\n';
        case 'app-links':
          return 'Links:\n- Download on the App Store: https://oseh.io/email-assets/download-on-the-app-store-badge-630w.png\n- Get it on Google Play: https://play.google.com/store/apps/details?id=com.oseh.frontendapp\n\n';
        case 'text-image-side-by-side':
          return `${c.text.header}\n${c.text.body}\n\n`;
        case 'cta':
          return `${c.text}: ${c.url}\n\n`;
        case 'footer':
          return `Join Our Community:\n- Instagram: https://www.instagram.com/meetoseh\n- YouTube: https://www.youtube.com/@meetoseh\n\nUnsubscribe: ${c.unsubscribe}\nSent By: Oseh, 1752 NW Market Street #4501, Seattle, Washington 98107\n\n`;
        default:
          return '';
      }
    })
    .join('');
};

const makeTextSchema = ({
  type,
  size,
  weight,
  lineHeight,
  title,
}: {
  type: string;
  size: number;
  weight: string[];
  lineHeight: number;
  title: string;
}) =>
  s.object(
    {
      type: s.string(
        {
          title: 'Type',
          description: `${size}px text with a ${lineHeight}px line height`,
          example: type,
        },
        { enum: [type] }
      ),
      text: s.string({
        title: 'Text',
        description:
          'The content to render with this style. Newlines will be extracted and converted into paragraphs',
        format: 'string-long',
        example: 'This is some text',
      }),
      weight: s.string(
        {
          title: 'Font Weight',
          description: 'The font-weight to use',
          example: weight[0],
        },
        {
          enum: weight,
        }
      ),
      align: s.string(
        {
          title: 'Alignment',
          description: 'The text alignment to use',
          example: 'left',
        },
        {
          enum: ['left', 'center'],
        }
      ),
      color: s.string(
        {
          title: 'Color',
          description: 'The color to use',
          example: 'light',
        },
        {
          enum: ['white', 'light', 'smoke'],
        }
      ),
    },
    {
      title,
      example: {
        type,
        text: 'This is some text',
        weight: weight[0],
        align: 'left',
        color: 'light',
      },
    }
  );

export const BrandedV1Route: EmailRoute = simpleEmailRoute<BrandedV1Props>({
  slug: 'branded-v1',
  summary: 'General template using the Oseh design system, adapted for emails',
  description:
    'Build an email from a set of basic components that are laid out from top to bottom on a dark background, ' +
    'including text based on the Oseh design system',
  schema: s.object({
    preview: s.optional(
      s.string(
        {
          title: 'Preview',
          example: null,
          description:
            'If specified, invisible text at the start of the email, ' +
            'so it shows up in the preview pane of most email clients.',
        },
        { nullable: true }
      )
    ),
    components: s.array(
      {
        title: 'Components',
        description:
          'The actually text within the email, broken out by paragraphs and optional bonus spacers',
        example: [
          {
            type: 'body',
            text: 'This is some text',
            weight: 'normal',
            align: 'left',
            color: 'light',
          },
        ],
      },
      {
        items: s.enumDiscriminator(
          'type',
          [
            makeTextSchema({
              type: 'h1',
              size: 28,
              lineHeight: 33.6,
              weight: ['normal', 'semibold'],
              title: 'H1',
            }),
            makeTextSchema({
              type: 'h2',
              size: 22,
              lineHeight: 28.6,
              weight: ['normal', 'semibold'],
              title: 'H2',
            }),
            makeTextSchema({
              type: 'h3',
              size: 20,
              lineHeight: 24,
              weight: ['normal', 'semibold'],
              title: 'H3',
            }),
            makeTextSchema({
              type: 'title',
              size: 17,
              lineHeight: 20.4,
              weight: ['normal', 'semibold'],
              title: 'Title',
            }),
            makeTextSchema({
              type: 'body-large',
              size: 18,
              lineHeight: 27,
              weight: ['normal'],
              title: 'Body Large',
            }),
            makeTextSchema({
              type: 'body',
              size: 16,
              lineHeight: 24,
              weight: ['normal'],
              title: 'Body',
            }),
            makeTextSchema({
              type: 'detail-1',
              size: 14,
              lineHeight: 16.8,
              weight: ['normal'],
              title: 'Detail 1',
            }),
            makeTextSchema({
              type: 'detail-2',
              size: 12,
              lineHeight: 15.6,
              weight: ['normal'],
              title: 'Detail 2',
            }),
            makeTextSchema({
              type: 'detail-3',
              size: 10,
              lineHeight: 13,
              weight: ['normal'],
              title: 'Detail 3',
            }),
            s.object(
              {
                type: s.string(
                  {
                    title: 'Type',
                    description:
                      'A basic spacer on the dark background whose height is specified in pixels',
                    example: 'spacer',
                  },
                  {
                    enum: ['spacer'],
                  }
                ),
                height: s.double(
                  {
                    title: 'Height (pixels)',
                    description: 'The height of the spacer in pixels',
                    example: 40,
                  },
                  {
                    minimum: 0,
                    exclusiveMinimum: true,
                  }
                ),
              },
              {
                title: 'Spacer',
                description:
                  'A basic spacer on the dark background whose height is specified in pixels',
                example: { type: 'spacer', height: 40 },
              }
            ),
            s.object({
              type: s.string(
                {
                  title: 'Type',
                  description: 'A full-width banner image with a 2:1 aspect ratio',
                  example: 'banner-2:1',
                },
                {
                  enum: ['banner-2:1'],
                }
              ),
              image: s.image(
                {
                  title: 'Image',
                  description:
                    'The image to display in the banner. Rendered at full width, maintains 2:1 aspect ratio',
                },
                {
                  'x-size': { width: 714, height: 357 },
                }
              ),
            }),
            s.object(
              {
                type: s.string(
                  {
                    title: 'Type',
                    description: 'A horizontal rule that spans the width of the email',
                    example: 'horizontal-rule',
                  },
                  {
                    enum: ['horizontal-rule'],
                  }
                ),
                width: s.string(
                  {
                    title: 'Width',
                    description:
                      'The width of the horizontal rule relative to the width of the darkened area',
                    example: 'content',
                  },
                  {
                    enum: ['full', 'content', 'half'],
                  }
                ),
                color: s.string(
                  {
                    title: 'Color',
                    description: 'The color of the horizontal rule',
                    example: 'grey',
                  },
                  {
                    enum: ['white', 'light', 'smoke', 'grey', 'dark-grey', 'charcoal', 'dark'],
                  }
                ),
                above: s.double(
                  {
                    title: 'Space Above (pixels)',
                    description: 'The space above the horizontal rule in pixels',
                    example: 24,
                  },
                  {
                    minimum: 0,
                  }
                ),
                below: s.double(
                  {
                    title: 'Space Below (pixels)',
                    description: 'The space below the horizontal rule in pixels',
                    example: 24,
                  },
                  {
                    minimum: 0,
                  }
                ),
              },
              {
                example: {
                  type: 'horizontal-rule',
                  width: 'content',
                  color: 'grey',
                  above: 24,
                  below: 24,
                },
              }
            ),
            s.object({
              type: s.string(
                {
                  title: 'Type',
                  description: 'A set of app download links',
                  example: 'app-links',
                },
                {
                  enum: ['app-links'],
                }
              ),
            }),
            s.object(
              {
                type: s.string(
                  {
                    title: 'Type',
                    description: 'A text section with an image on one side',
                    example: 'text-image-side-by-side',
                  },
                  {
                    enum: ['text-image-side-by-side'],
                  }
                ),
                text: s.object(
                  {
                    header: s.string({
                      title: 'Header',
                      description: 'The header text to display',
                      example: 'Header text',
                    }),
                    body: s.string({
                      title: 'Body',
                      description: 'The body text to display',
                      example: 'Body text',
                    }),
                    on: s.string(
                      {
                        title: 'Image Side',
                        description: 'The side of the image to display the text on',
                        example: 'left',
                      },
                      {
                        enum: ['left', 'right'],
                      }
                    ),
                  },
                  {
                    example: {
                      header: 'Header text',
                      body: 'Body text',
                      on: 'left',
                    },
                  }
                ),
                image: s.image(
                  {
                    title: 'Image',
                    description:
                      'The image to display. This is 180x180 for most users (~85% with @media support for max-width) under 600px wide',
                  },
                  {
                    'x-size': { width: 270, height: 270 },
                  }
                ),
                alpha: s.boolean({
                  title: 'Alpha',
                  description:
                    'Whether the image has an alpha channel (serve with PNG) or not (serve with JPEG)',
                  example: false,
                }),
              },
              {
                example: {
                  type: 'text-image-side-by-side',
                  text: { header: 'Header text', body: 'Body text', on: 'left' },
                  image: 'placeholder',
                  alpha: false,
                },
              }
            ),
            s.object(
              {
                type: s.string(
                  {
                    title: 'Type',
                    description: 'A call to action button',
                    example: 'cta',
                  },
                  {
                    enum: ['cta'],
                  }
                ),
                text: s.string({
                  title: 'Text',
                  description: 'The text to display on the button',
                  example: 'Click here',
                }),
                url: s.string({
                  title: 'URL',
                  description: 'The URL to navigate to when the button is clicked',
                  example: 'https://example.com',
                }),
                align: s.string(
                  {
                    title: 'Alignment',
                    description: 'The alignment of the button',
                    example: 'left',
                  },
                  {
                    enum: ['left', 'center', 'right'],
                  }
                ),
              },
              {
                example: {
                  type: 'cta',
                  text: 'Click here',
                  url: 'https://example.com',
                  align: 'left',
                },
              }
            ),
            s.object(
              {
                type: s.string(
                  {
                    title: 'Type',
                    description: 'A footer section with legal information',
                    example: 'footer',
                  },
                  {
                    enum: ['footer'],
                  }
                ),
                unsubscribe: s.string({
                  title: 'Unsubscribe URL',
                  description:
                    'The URL to unsubscribe from emails. This is usually {unsubscribe_url}.',
                  example: 'https://example.com/unsubscribe',
                }),
              },
              {
                example: {
                  type: 'footer',
                  unsubscribe: 'https://example.com/unsubscribe',
                },
              }
            ),
          ],
          {
            example: {
              type: 'body',
              text: 'This is some text',
              weight: 'normal',
              align: 'left',
              color: 'light',
            },
          }
        ),
      }
    ),
  }),
  render: (props, format) => {
    if (format === 'plain') {
      return BrandedV1Plain(props);
    }

    return render(<BrandedV1Html {...props} />);
  },
});

export default BrandedV1Html;
