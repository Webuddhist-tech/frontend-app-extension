import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render, screen, waitFor } from '@testing-library/react';

import WishlistPage from './WishlistPage';
import messages from './messages';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

describe('WishlistPage', () => {
  it('renders the wishlist page with its document title', async () => {
    (getConfig as jest.Mock).mockReturnValue({
      FAVICON_URL: 'https://example.com/favicon.ico',
      SITE_NAME: process.env.SITE_NAME,
    });

    render(
      <IntlProvider locale="en">
        <WishlistPage />
      </IntlProvider>,
    );

    expect(screen.getByTestId('wishlist-page')).not.toBeNull();
    await waitFor(() => {
      expect(document.title).toBe(`${messages.pageTitle.defaultMessage} | ${getConfig().SITE_NAME}`);
    });
  });
});
