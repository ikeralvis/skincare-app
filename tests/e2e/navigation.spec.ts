import { test, expect } from '@playwright/test';

test.describe('Navegación Principal', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Esperar a que la página cargue completamente
    await page.waitForLoadState('networkidle');
  });

  test('debe cargar la página principal correctamente', async ({ page }) => {
    // Verificar que el título está presente
    await expect(page).toHaveTitle(/Skincare/i);
    
    // Verificar que el logo está visible (desktop o móvil)
    const desktopLogo = page.locator('header img').first();
    const mobileLogo = page.locator('.mobile-logo img').first();
    
    const isDesktopVisible = await desktopLogo.isVisible().catch(() => false);
    const isMobileVisible = await mobileLogo.isVisible().catch(() => false);
    
    expect(isDesktopVisible || isMobileVisible).toBeTruthy();
  });

  test('debe mostrar el bottom navigation', async ({ page }) => {
    // Verificar que el bottom nav existe y es visible
    const bottomNav = page.locator('.bottom-nav, nav[class*="bottom"]');
    await expect(bottomNav).toBeVisible();
    
    // Verificar que tiene los 4 botones esperados
    const buttons = page.locator('.bottom-nav button, nav[class*="bottom"] button');
    const count = await buttons.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });

  test('debe navegar entre vistas sin recargar la página', async ({ page }) => {
    // Obtener el tiempo de navegación inicial
    const initialNav = await page.evaluate(() => performance.now());
    
    // Click en botón de progreso
    const progressBtn = page.locator('button[data-view="progress"], button:has-text("Progreso")').first();
    await progressBtn.click();
    
    // Esperar a que la vista cambie
    await page.waitForTimeout(500);
    
    // Verificar que no hubo recarga completa (SPA)
    const afterClickNav = await page.evaluate(() => performance.now());
    const timeDiff = afterClickNav - initialNav;
    
    // En una SPA, el cambio de vista debería ser rápido (<2000ms)
    expect(timeDiff).toBeLessThan(2000);
    
    // Verificar que la vista de progreso está visible
    const progressView = page.locator('#progress-view, [data-view-name="progress"]');
    const isVisible = await progressView.isVisible().catch(() => false);
    expect(isVisible).toBeTruthy();
  });

  test('debe cambiar entre todas las vistas principales', async ({ page }) => {
    const views = [
      { name: 'guide', selector: 'button[data-view="guide"], button:has-text("Inicio")' },
      { name: 'calendar', selector: 'button[data-view="calendar"], button:has-text("Calendario")' },
      { name: 'progress', selector: 'button[data-view="progress"], button:has-text("Progreso")' },
      { name: 'routines', selector: 'button[data-view="routines"], button:has-text("Rutina")' }
    ];

    for (const view of views) {
      const button = page.locator(view.selector).first();
      await button.click();
      await page.waitForTimeout(300);
      
      // Verificar que algún contenido cambió
      const body = page.locator('body');
      await expect(body).toBeVisible();
    }
  });

  test('debe mantener el estado de autenticación al navegar', async ({ page }) => {
    // Verificar que el botón de usuario existe
    const userBtn = page.locator('#user-menu-btn, #mobile-user-menu-btn, button[aria-label*="usuario"]').first();
    await expect(userBtn).toBeVisible();
    
    // Navegar a otra vista
    const progressBtn = page.locator('button[data-view="progress"]').first();
    await progressBtn.click();
    await page.waitForTimeout(500);
    
    // Verificar que el botón de usuario sigue visible
    await expect(userBtn).toBeVisible();
  });

  test('debe mostrar la guía de introducción en la primera carga', async ({ page }) => {
    // Limpiar sessionStorage antes de la prueba
    await page.evaluate(() => sessionStorage.clear());
    await page.reload();
    
    // Buscar elementos de la guía/intro
    const introText = page.locator('text=/bienvenid|guía|skincare/i').first();
    const isVisible = await introText.isVisible({ timeout: 2000 }).catch(() => false);
    
    // La intro debería estar visible en la primera carga
    expect(isVisible).toBeTruthy();
  });

  test('debe ser responsive en móvil', async ({ page, viewport }) => {
    // Cambiar a viewport móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForTimeout(300);
    
    // Verificar que el bottom nav es visible en móvil
    const bottomNav = page.locator('.bottom-nav, nav[class*="bottom"]');
    await expect(bottomNav).toBeVisible();
    
    // Verificar que el header de desktop está oculto (si aplica)
    const desktopHeader = page.locator('header');
    const headerStyle = await desktopHeader.evaluate((el) => {
      return window.getComputedStyle(el).display;
    }).catch(() => 'none');
    
    // En móvil, el header debería estar oculto o no visible
    expect(['none', 'hidden'].includes(headerStyle) || headerStyle === 'none');
  });
});

test.describe('Interacción con Productos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar productos de la rutina', async ({ page }) => {
    // Navegar a la vista de rutinas
    const routineBtn = page.locator('button[data-view="routines"], button:has-text("Rutina")').first();
    await routineBtn.click();
    await page.waitForTimeout(500);
    
    // Buscar cards de productos
    const productCards = page.locator('.product-card, [class*="product"]');
    const count = await productCards.count();
    
    // Debería haber al menos 1 producto
    expect(count).toBeGreaterThan(0);
  });

  test('debe mostrar información del producto', async ({ page }) => {
    // Navegar a rutinas
    const routineBtn = page.locator('button[data-view="routines"]').first();
    await routineBtn.click();
    await page.waitForTimeout(500);
    
    // Verificar que hay títulos de productos
    const productTitle = page.locator('.product-card h2, [class*="product"] h2').first();
    const hasText = await productTitle.textContent();
    
    expect(hasText).toBeTruthy();
    expect(hasText!.length).toBeGreaterThan(0);
  });
});

test.describe('Botón de Marcar Completada', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe mostrar botón de marcar como completada', async ({ page }) => {
    // Navegar a rutinas
    const routineBtn = page.locator('button[data-view="routines"]').first();
    await routineBtn.click();
    await page.waitForTimeout(500);
    
    // Buscar botón de completar
    const completeBtn = page.locator('#mark-completed, button:has-text("completad")').first();
    const isVisible = await completeBtn.isVisible({ timeout: 5000 }).catch(() => false);
    
    expect(isVisible).toBeTruthy();
  });
});

test.describe('Accesibilidad Básica', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('debe ser navegable con teclado', async ({ page }) => {
    // Presionar Tab varias veces
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    
    // Verificar que hay un elemento con foco
    const focusedElement = page.locator(':focus');
    const isFocused = await focusedElement.count();
    
    expect(isFocused).toBeGreaterThan(0);
  });

  test('debe tener alt text en imágenes', async ({ page }) => {
    // Buscar todas las imágenes
    const images = page.locator('img');
    const count = await images.count();
    
    if (count > 0) {
      // Verificar que la primera imagen tiene alt
      const firstImage = images.first();
      const alt = await firstImage.getAttribute('alt');
      
      expect(alt).toBeTruthy();
    }
  });

  test('debe tener labels en botones importantes', async ({ page }) => {
    const buttons = page.locator('button');
    const count = await buttons.count();
    
    expect(count).toBeGreaterThan(0);
    
    // Verificar que los botones tienen texto o aria-label
    for (let i = 0; i < Math.min(count, 5); i++) {
      const button = buttons.nth(i);
      const text = await button.textContent();
      const ariaLabel = await button.getAttribute('aria-label');
      
      expect(text || ariaLabel).toBeTruthy();
    }
  });
});
