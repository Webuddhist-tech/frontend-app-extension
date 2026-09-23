import { getConfig } from '@edx/frontend-platform';
import { Helmet } from 'react-helmet';

type HeadProps = {
  title: string;
};

const Head = ({ title }: HeadProps) => {
  const siteName = String(getConfig().SITE_NAME || '');

  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <link rel="shortcut icon" href={getConfig().FAVICON_URL} type="image/x-icon" />
    </Helmet>
  );
};

export default Head;
