import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const pages = ['index.html', 'consultoria.html', 'enterprise.html', 'enterprise-conceitual.html', 'landing-v1.html'];
let browser, server, origin;
before(async () => {
  const root = fileURLToPath(new URL('..', import.meta.url));
  const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.jpg': 'image/jpeg', '.png': 'image/png' };
  server = createServer(async (request, response) => {
    const relative = decodeURIComponent(new URL(request.url, 'http://localhost').pathname).slice(1);
    if (relative.includes('..') || !(pages.includes(relative) || relative.startsWith('assets/') || relative.startsWith('img/'))) {
      response.writeHead(404).end();
      return;
    }
    try {
      const body = await readFile(path.join(root, relative));
      response.writeHead(200, { 'Content-Type': mime[path.extname(relative)] || 'application/octet-stream' }).end(body);
    } catch {
      response.writeHead(404).end();
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = 'http://127.0.0.1:' + server.address().port;
  browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_EXECUTABLE });
});
after(async () => {
  await browser?.close();
  if (server) await new Promise(resolve => server.close(resolve));
});

test('mobile navigation exposes its state and returns focus on Escape', async () => {
  for (const name of pages) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(origin + '/' + name);
      const toggle = page.getByRole('button', { name: 'Abrir menu', exact: true });
      await toggle.click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'true', name);
      assert.equal(await page.locator('#navLinks a').first().evaluate(el => el === document.activeElement), true, name);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator('#navLinks a').nth(1).evaluate(el => el === document.activeElement), true, name);
      await page.keyboard.press('Escape');
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false', name);
      assert.equal(await toggle.evaluate(el => el === document.activeElement), true, name);
      assert.equal(await page.locator('#navLinks').isVisible(), false, name);
      await toggle.click();
      await page.locator('#navLinks a').first().click();
      assert.equal(await toggle.getAttribute('aria-expanded'), 'false', name);
    } finally {
      await page.close();
    }
  }
});

test('FAQ questions expose their expanded state and work from the keyboard', async () => {
  for (const name of pages.filter(name => name.includes('enterprise') || name === 'landing-v1.html')) {
    const page = await browser.newPage();
    try {
      await page.goto(origin + '/' + name);
      const question = page.locator('.faq-q').first();
      const label = (await question.textContent()).replace('+', '').trim();
      await question.focus();
      await page.keyboard.press('Enter');
      // Native summary has a browser disclosure role, not an ARIA button role.
      const session = await page.context().newCDPSession(page);
      const { nodes } = await session.send('Accessibility.getFullAXTree');
      assert.ok(nodes.some(node => node.name?.value === label &&
        node.properties?.some(property => property.name === 'expanded' && property.value.value === true)), name);
      assert.equal(await page.locator('.faq-a').first().isVisible(), true, name);
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('.faq-a').first().isVisible(), false, name);
    } finally {
      await page.close();
    }
  }
});

test('contact form focuses an invalid email instead of opening the mail application', async () => {
  const page = await browser.newPage();
  try {
    await page.goto(origin + '/landing-v1.html');
    await page.getByLabel('E-mail corporativo').fill('invalid-address');
    await page.locator('button[type=submit]').click();
    assert.equal(await page.getByLabel('E-mail corporativo').evaluate(el => el === document.activeElement), true);
    assert.ok(await page.getByLabel('E-mail corporativo').evaluate(el => el.validationMessage));
  } finally {
    await page.close();
  }
});

test('all entry points load their content and local assets without browser errors', async () => {
  for (const name of pages) {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('requestfailed', request => errors.push(request.url()));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url()); });
    try {
      await page.goto(origin + '/' + name);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.locator('main h1').count(), 1, name);
      for (const img of await page.locator('img').all()) {
        await img.scrollIntoViewIfNeeded();
        await img.evaluate(el => el.decode());
      }
      assert.deepEqual(errors, [], name);
    } finally {
      await page.close();
    }
  }
});
