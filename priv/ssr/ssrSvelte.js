async function renderPage(pagePath, props = {}, ctx = {}) {
  if (process.env.NODE_ENV !== "production") {
    pagePath = `${pagePath}?cachebust=${Date.now()}`;
  }
  const module = await import(pagePath);

  const context = new Map();
  Object.entries(ctx).forEach(([key, value]) => {
    context.set(key, value);
  });

  return module.default.render(props, { context });
}

export { renderPage };
