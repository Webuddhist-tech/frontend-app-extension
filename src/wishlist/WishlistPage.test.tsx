import { render, screen } from '@testing-library/react';

import WishlistPage from './WishlistPage';

describe('WishlistPage', () => {
  it('renders the wishlist page', () => {
    render(<WishlistPage />);

    expect(screen.getByTestId('wishlist-page')).not.toBeNull();
  });
});
