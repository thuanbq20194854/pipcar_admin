import { default as NextHead } from 'next/head';

interface THeadProps {
  title?: string;
  desc?: string;
  image?: string;
}
function Head({ title = 'ADMIN', desc = 'PIPCAR ADMIN', image = '/favicon.ico' }: THeadProps) {
  return (
    <NextHead>
      <title>{title}</title>
      <meta name='description' content={desc} />
      <meta property='og:type' content='website' />
      <meta property='og:title' content={title} />
      <meta property='og:description' content={desc} />
      <meta property='og:image' content={image} />

      <meta property='twitter:card' content='summary_large_image' />
      <meta property='twitter:title' content={title} />
      <meta property='twitter:description' content={desc} />
      <meta property='twitter:image' content={image} />
    </NextHead>
  );
}

export default Head;
