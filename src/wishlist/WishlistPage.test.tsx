import { getConfig } from '@edx/frontend-platform';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import WishlistPage from './WishlistPage';
import { fetchWishlist, removeFromWishlist } from './api';
import messages from './messages';

jest.mock('@edx/frontend-platform', () => ({
  getConfig: jest.fn(),
}));

jest.mock('./api', () => ({
  fetchWishlist: jest.fn(),
  removeFromWishlist: jest.fn(),
}));

const mockFetchWishlist = fetchWishlist as jest.MockedFunction<typeof fetchWishlist>;
const mockRemoveFromWishlist = removeFromWishlist as jest.MockedFunction<typeof removeFromWishlist>;

const renderPage = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <IntlProvider locale="en">
      <QueryClientProvider client={queryClient}>
        <WishlistPage />
      </QueryClientProvider>
    </IntlProvider>,
  );
};

describe('WishlistPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getConfig as jest.Mock).mockReturnValue({
      FAVICON_URL: 'https://example.com/favicon.ico',
      LMS_BASE_URL: 'http://local.openedx.io',
      SITE_NAME: process.env.SITE_NAME,
    });
  });

  it('loads and removes a wishlisted course', async () => {
    const user = userEvent.setup();
    mockFetchWishlist
      .mockResolvedValueOnce({
        count: 1,
        next: null,
        previous: null,
        results: [{
          courseId: 'course-v1:Sherab+Demo+2026',
          title: 'Demo course',
          imageUrl: '/asset-v1:Sherab+Demo+2026+type@asset+block@course.jpg',
          org: 'Sherab',
          start: '2026-10-05T00:00:00Z',
          advertisedStart: null,
          created: '2026-09-21T00:00:00Z',
        }],
      })
      .mockResolvedValue({
        count: 0, next: null, previous: null, results: [],
      });
    mockRemoveFromWishlist.mockResolvedValue();

    renderPage();

    expect(await screen.findByText('Demo course')).not.toBeNull();
    expect(screen.getByText('1 course saved')).not.toBeNull();
    expect(screen.getByText(/Starts.*Oct.*2026/)).not.toBeNull();
    await waitFor(() => {
      expect(document.title).toBe(`${messages.pageTitle.defaultMessage} | ${getConfig().SITE_NAME}`);
    });

    await user.click(screen.getByRole('button', { name: 'Remove Demo course from wishlist' }));

    expect(mockRemoveFromWishlist.mock.calls[0][0]).toBe('course-v1:Sherab+Demo+2026');
    expect(await screen.findByText('You have no courses in your wishlist.')).not.toBeNull();
  });

  it('shows the empty state', async () => {
    mockFetchWishlist.mockResolvedValue({
      count: 0, next: null, previous: null, results: [],
    });

    renderPage();

    expect(await screen.findByText('You have no courses in your wishlist.')).not.toBeNull();
    expect(screen.getByRole('link', { name: 'Explore courses' }).getAttribute('href'))
      .toBe('http://local.openedx.io/courses');
  });

  it('loads the selected wishlist page', async () => {
    const user = userEvent.setup();
    mockFetchWishlist
      .mockResolvedValueOnce({
        count: 6,
        next: 'http://local.openedx.io/api/wishlist/?page=2',
        previous: null,
        results: [{
          courseId: 'course-v1:Sherab+First+2026',
          title: 'First page course',
          imageUrl: '',
          org: 'Sherab',
          start: null,
          advertisedStart: null,
          created: '2026-09-21T00:00:00Z',
        }],
      })
      .mockResolvedValueOnce({
        count: 6,
        next: null,
        previous: 'http://local.openedx.io/api/wishlist/',
        results: [{
          courseId: 'course-v1:Sherab+Second+2026',
          title: 'Second page course',
          imageUrl: '',
          org: 'Sherab',
          start: null,
          advertisedStart: null,
          created: '2026-09-20T00:00:00Z',
        }],
      });

    renderPage();

    expect(await screen.findByText('First page course')).not.toBeNull();
    await user.click(screen.getByRole('button', { name: 'Page 2' }));

    expect(await screen.findByText('Second page course')).not.toBeNull();
    expect(mockFetchWishlist).toHaveBeenLastCalledWith(2);
  });
});
