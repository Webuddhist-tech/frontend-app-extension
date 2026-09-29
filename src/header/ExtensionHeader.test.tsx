import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import ExtensionHeader from './ExtensionHeader';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

const mockHeaderProps = jest.fn();
jest.mock('@edx/frontend-component-header', () => (props: unknown) => {
  mockHeaderProps(props);
  return null;
});

it('passes the Extension navigation to the shared header', () => {
  (getConfig as jest.Mock).mockReturnValue({
    LMS_BASE_URL: 'http://local.openedx.io',
    EXTENSION_BASE_URL: 'http://apps.local.openedx.io:2003',
    ENABLE_PROGRAMS: true,
    NON_BROWSABLE_COURSES: false,
  });

  render(
    <IntlProvider locale="en">
      <MemoryRouter initialEntries={['/wishlist']}>
        <ExtensionHeader />
      </MemoryRouter>
    </IntlProvider>,
  );

  expect(mockHeaderProps.mock.calls[0][0].mainMenuItems).toEqual([
    expect.objectContaining({ content: 'Dashboard', href: 'http://local.openedx.io/dashboard' }),
    expect.objectContaining({ content: 'Programs', href: 'http://local.openedx.io/dashboard/programs' }),
    expect.objectContaining({ content: 'Discover New', href: 'http://local.openedx.io/courses' }),
    expect.objectContaining({
      content: 'Wishlist',
      href: 'http://apps.local.openedx.io:2003/wishlist',
      isActive: true,
    }),
  ]);
});
