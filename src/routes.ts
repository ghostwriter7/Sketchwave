import { lazy } from 'solid-js';

export const routes = [
  {
    path: '/',
    component: lazy(() => import('./routes/Home'))
  },
  {
    path: '/painter',
    component: lazy(() => import('./routes/Painter.tsx'))
  },
  {
    path: '/juggling',
    component: lazy(() => import('./routes/Juggling'))
  }
];
