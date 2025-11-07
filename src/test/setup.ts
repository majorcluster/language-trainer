import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';

// Mock methods not implemented in jsdom
if (typeof window !== 'undefined') {
  // Mock scrollIntoView
  Element.prototype.scrollIntoView = () => {};
  
  // Mock pointer capture methods
  HTMLElement.prototype.hasPointerCapture = () => false;
  HTMLElement.prototype.setPointerCapture = () => {};
  HTMLElement.prototype.releasePointerCapture = () => {};
}

// Cleanup after each test
afterEach(() => {
  cleanup();
});

