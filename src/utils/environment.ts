const localPorts = ['5174', '5173']
export const isDevMode = () => localPorts.some((port) => location.origin.includes(port));

export const isPlaygroundMode = () => location.href === 'http://localhost:5173/playground';
