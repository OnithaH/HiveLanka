import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isPublicRoute = createRouteMatcher([
  '/',
  '/shop(.*)',
  '/product/(.*)',
  '/events(.*)',
  '/tutorials(.*)',
  '/about(.*)',
  '/contact(.*)',
  '/faq(.*)',
  '/signin(.*)',
  '/signup(.*)',
  '/signin-redirect',
  '/visual-search(.*)',
  '/api/webhooks/(.*)',
  '/api/loyalty/(.*)',
  '/api/test(.*)',
  '/api/user/(.*)',
  '/api/orders/(.*)',
  '/api/products/(.*)',
  '/api/visual-search/(.*)',
]);

const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, request) => {
  if (isAdminRoute(request)) {
    await auth.protect();
  }
  
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};