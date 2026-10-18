import { renderToString } from 'react-dom/server'
import App, { PRODUCTS, getRouteFromPath } from './App.jsx'

export function render(url) {
  const html = renderToString(<App initialPath={url} />)
  const route = getRouteFromPath(url)
  return { html, route }
}

export { PRODUCTS, getRouteFromPath }
