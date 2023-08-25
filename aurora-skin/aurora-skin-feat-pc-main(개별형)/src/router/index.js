import { lazy } from 'react';
import { useRoutes } from 'react-router-dom';

const MemberRoute = lazy(() => import('./MemberRoute'));
const IntroPageRoute = lazy(() => import('./IntroPageRoute'));
const NotAccessLoggedInUserRouter = lazy(() => import('./NotAccessLoggedInUserRouter'));

const Layout = lazy(() => import('../components/Layout'));
const Main = lazy(() => import('../pages/Main'));
const MyPage = lazy(() => import('../pages/MyPage'));
const SignIn = lazy(() => import('../pages/SignIn'));
const OrderSheet = lazy(() => import('../pages/OrderSheet'));
const Notice = lazy(() => import('../pages/Notice'));
const CustomerCenter = lazy(() => import('../pages/CustomerCenter'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const DisplayCategoryList = lazy(() => import('../pages/DisplayCategoryList'));
const SignUp = lazy(() => import('../pages/SignUp'));
const ProductSectionList = lazy(() => import('../pages/ProductSectionList'));
const CallBack = lazy(() => import('../pages/CallBack'));
const FAQ = lazy(() => import('../pages/FAQ'));
const Cart = lazy(() => import('../pages/Cart'));
const OpenIdCallback = lazy(() => import('../pages/OpenIdCallback'));
const SignUpMenu = lazy(() => import('../pages/SignUpMenu'));
const MemberModification = lazy(() => import('../pages/MemberModification'));
const OrderConfirm = lazy(() => import('../pages/OrderConfirm'));
const FindId = lazy(() => import('../pages/FindId'));
const FindPassword = lazy(() => import('../pages/FindPassword'));
const ChangePassword = lazy(() => import('../pages/ChangePassword'));
const NotFound = lazy(() => import('../pages/NotFound'));
const AdultCertification = lazy(() => import('../pages/AdultCertification'));
const MemberWithdrawal = lazy(() => import('../pages/MemberWithdrawal'));
const Event = lazy(() => import('../pages/Event'));
const Claim = lazy(() => import('../pages/Claim'));
const OrderDetail = lazy(() => import('../pages/OrderDetail'));
const DesignWindowPopup = lazy(() => import('../components/DesignPopup/DesignWindowPopup'));

// MyPage
const MyPageProductReview = lazy(() => import('../pages/MyPage/ProductReview'));
const MyPagePersonalInquiry = lazy(() => import('../pages/MyPage/PersonalInquiry'));
const MyPageProductInquiry = lazy(() => import('../pages/MyPage/ProductInquiry'));
const MyPageCoupon = lazy(() => import('../pages/MyPage/Coupon'));
const MyOrders = lazy(() => import('../pages/MyPage/Orders'));
const MyPageAccumulation = lazy(() => import('../pages/MyPage/Accumulation'));
const MyPageLike = lazy(() => import('../pages/MyPage/Like'));
const MyPageShippingAddress = lazy(() => import('../pages/MyPage/ShippingAddress'));
const MyClaims = lazy(() => import('../pages/MyPage/Claims'));

// ETC
const NoAccess = lazy(() => import('../pages/NoAccess'));
const MemberOnly = lazy(() => import('../pages/MemberOnly'));
const ServiceCheck = lazy(() => import('../pages/ServiceCheck'));
const ExpiredMall = lazy(() => import('../pages/ExpiredMall'));

const Router = () =>
  useRoutes([
    {
      path: '/',
      element: (
        <IntroPageRoute>
          <Layout />
        </IntroPageRoute>
      ),
      children: [
        {
          index: true,
          element: <Main />,
        },
        {
          path: 'my-page',
          element: (
            <MemberRoute>
              <MyPage />
            </MemberRoute>
          ),
        },
        {
          path: 'sign-in',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignIn />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'order/:orderSheetNo',
          element: <OrderSheet />,
        },
        {
          path: 'order/confirm',
          element: <OrderConfirm />,
        },
        {
          path: 'orders',
          element: <MyOrders />,
        },
        {
          path: 'orders/:orderNo',
          element: <OrderDetail />,
        },
        {
          path: 'claims',
          element: <MyClaims />,
        },
        {
          path: 'claim/:orderOptionNo',
          element: <Claim />,
        },
        {
          path: 'notice',
          element: <Notice />,
        },
        {
          path: 'customer-center',
          element: <CustomerCenter />,
        },
        {
          path: 'product-detail',
          element: <ProductDetail />,
        },
        {
          path: 'products',
          element: <DisplayCategoryList />,
        },
        {
          path: 'sign-up/form',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignUp />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'display/:sectionsId',
          element: <ProductSectionList />,
        },
        {
          path: 'faq',
          element: <FAQ />,
        },
        {
          path: 'cart',
          element: <Cart />,
        },
        {
          path: 'sign-up',
          element: (
            <NotAccessLoggedInUserRouter>
              <SignUpMenu />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'callback/auth-callback',
          element: <OpenIdCallback />,
        },
        {
          path: 'member-modification',
          element: <MemberModification />,
        },
        {
          path: 'find-id',
          element: (
            <NotAccessLoggedInUserRouter>
              <FindId />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'find-password',
          element: (
            <NotAccessLoggedInUserRouter>
              <FindPassword />
            </NotAccessLoggedInUserRouter>
          ),
        },
        {
          path: 'change-password',
          element: <ChangePassword />,
        },
        {
          path: 'adult-certification',
          element: <AdultCertification />,
        },
        {
          path: 'member-withdrawal',
          element: <MemberWithdrawal />,
        },
        {
          path: 'member-only',
          element: <MemberOnly />,
        },
        {
          path: 'event/:eventNo',
          element: <Event />,
        },
        // my-page
        {
          path: 'my-page',
          element: <MemberRoute />,
          children: [
            {
              path: 'personal-inquiry',
              element: <MyPagePersonalInquiry />,
            },
            {
              path: 'product-review',
              element: <MyPageProductReview />,
            },
            {
              path: 'product-inquiry',
              element: <MyPageProductInquiry />,
            },
            {
              path: 'coupon',
              element: <MyPageCoupon />,
            },
            {
              path: 'accumulation',
              element: <MyPageAccumulation />,
            },
            {
              path: 'like',
              element: <MyPageLike />,
            },
            {
              path: 'shipping-address',
              element: <MyPageShippingAddress />,
            },
          ],
        },
      ],
    },
    {
      path: 'design-popup',
      element: <DesignWindowPopup />,
    },
    {
      path: 'no-access',
      element: <NoAccess />,
    },
    {
      path: 'callback',
      element: <CallBack />,
    },
    {
      path: 'service-check',
      element: <ServiceCheck />,
    },
    {
      path: 'expired-mall',
      element: <ExpiredMall />,
    },
    {
      path: 'not-found',
      element: <NotFound />,
    },
    // {
    //   path: '*',
    //   element: <Navigate to="not-found" />,
    // },
  ]);

export default Router;
