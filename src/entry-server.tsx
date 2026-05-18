import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

export function render() {
  const helmetContext: any = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <App />
    </HelmetProvider>
  );
  const { helmet } = helmetContext;
  return { 
    html,
    head: helmet ? `
      ${helmet.title.toString()}
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
    ` : ''
  };
}
