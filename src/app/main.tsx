import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';
import { createBrowserDependencies } from './dependencies';
import './global.css';

const dependencies = createBrowserDependencies();

// Browsers keep audio silent until the first gesture, and iOS can suspend it again later.
window.addEventListener('pointerdown', () => dependencies.sound.unlock());

// A long press or a pinch must not interrupt play with a browser menu or a zoom.
document.addEventListener('contextmenu', (event) => event.preventDefault());
document.addEventListener('gesturestart', (event) => event.preventDefault());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App dependencies={dependencies} />
  </StrictMode>,
);
