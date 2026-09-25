import 'core-js/stable';
import 'regenerator-runtime/runtime';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import {
  AppProvider, AuthenticatedPageRoute, ErrorPage,
} from '@edx/frontend-platform/react';
import { createRoot } from 'react-dom/client';
import {
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Header from '@edx/frontend-component-header';
import { FooterSlot } from '@edx/frontend-component-footer';

import WishlistPage from './wishlist/WishlistPage';

import messages from './i18n';
import './index.scss';

const queryClient = new QueryClient();

const container = document.getElementById('root');
const root = createRoot(container!);

subscribe(APP_READY, () => {
  root.render(
    <AppProvider wrapWithRouter={false}>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <div className="d-flex flex-column min-dvh-100">
            <Header />
            <main className="d-flex flex-column flex-grow-1">
              <Routes>
                <Route
                  path="/wishlist"
                  element={<AuthenticatedPageRoute><WishlistPage /></AuthenticatedPageRoute>}
                />
              </Routes>
            </main>
            <FooterSlot />
          </div>
        </QueryClientProvider>
      </BrowserRouter>
    </AppProvider>,
  );
});

subscribe(APP_INIT_ERROR, (error: { message: any }) => {
  root.render(<ErrorPage message={error.message} />);
});

initialize({
  messages,
});
