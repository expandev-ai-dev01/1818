import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { RootLayout } from '@/pages/layouts/RootLayout';
import { LoadingSpinner } from '@/core/components/LoadingSpinner';

const HomePage = lazy(() => import('@/pages/Home'));
const GradesPage = lazy(() => import('@/pages/Grades'));
const GradeOverviewPage = lazy(() => import('@/pages/GradeOverview'));
const SubjectGradesPage = lazy(() => import('@/pages/SubjectGrades'));
const NotFoundPage = lazy(() => import('@/pages/NotFound'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'grades',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <GradesPage />
          </Suspense>
        ),
      },
      {
        path: 'grades/overview',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <GradeOverviewPage />
          </Suspense>
        ),
      },
      {
        path: 'grades/subject/:subject',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <SubjectGradesPage />
          </Suspense>
        ),
      },
      {
        path: '*',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <NotFoundPage />
          </Suspense>
        ),
      },
    ],
  },
]);

export const AppRouter = () => {
  return <RouterProvider router={router} />;
};
