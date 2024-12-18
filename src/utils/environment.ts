export const isDevMode = () => location.origin === 'http://localhost:5173';

export const isPlaygroundMode = () => location.href === 'http://localhost:5173/playground';
