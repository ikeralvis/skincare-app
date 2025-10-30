// Setup file para tests
import { expect } from 'vitest';

// Configuración global para tests
global.window = global.window || {};
global.localStorage = global.localStorage || {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};
