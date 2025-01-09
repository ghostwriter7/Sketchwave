import { lazy } from 'solid-js';
import type { RouteDefinition } from '@solidjs/router';

export const routes: RouteDefinition[] = [
  {
    path: '/',
    component: lazy(() => import('./routes/home/Home.tsx'))
  },
  {
    path: '/painter',
    component: lazy(() => import('./routes/Painter.tsx'))
  },
  {
    path: '/juggling',
    component: lazy(() => import('./routes/juggling/Juggling.tsx'))
  }
];
