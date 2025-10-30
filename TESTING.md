# 🧪 Testing Guide - Skincare App

## 📋 Tabla de Contenidos

- [Instalación](#instalación)
- [Tests Unitarios](#tests-unitarios)
- [Tests E2E](#tests-e2e)
- [Tests de Accesibilidad](#tests-de-accesibilidad)
- [Coverage](#coverage)
- [CI/CD](#cicd)

---

## 🚀 Instalación

Las dependencias de testing ya están instaladas. Si necesitas reinstalarlas:

```bash
# Instalar todas las dependencias
npm install

# Instalar navegadores de Playwright
npx playwright install
```

---

## 🧪 Tests Unitarios

Los tests unitarios verifican la lógica de negocio y funciones individuales.

### Ejecutar Tests

```bash
# Ejecutar tests una vez
npm run test:unit

# Ejecutar tests en modo watch (se ejecutan al guardar cambios)
npm run test

# Ejecutar tests con interfaz visual
npm run test:ui
```

### Archivos de Test

- `tests/unit/streak-calculation.test.ts` - Tests del cálculo de racha
  - ✅ Cálculo de racha de 0 días
  - ✅ Cálculo de racha de 1 día
  - ✅ Cálculo de racha consecutiva (7, 30 días)
  - ✅ Romper racha después de días sin completar
  - ✅ Día de gracia
  - ✅ Fechas desordenadas

- `tests/unit/data-validation.test.ts` - Validación de datos
  - ✅ Validación de productos
  - ✅ Validación de rutinas
  - ✅ Validación de datos de progreso

### Coverage

```bash
# Generar reporte de cobertura
npm run test:coverage

# El reporte HTML estará en: coverage/index.html
```

**Objetivo:** >80% de cobertura en funciones críticas

---

## 🎭 Tests E2E (End-to-End)

Los tests E2E verifican el flujo completo de la aplicación.

### Ejecutar Tests E2E

```bash
# Ejecutar todos los tests E2E
npm run test:e2e

# Ejecutar con interfaz visual
npm run test:e2e:ui

# Ejecutar en modo debug (paso a paso)
npm run test:e2e:debug

# Ejecutar solo en Chrome
npx playwright test --project=chromium

# Ejecutar solo en móvil
npx playwright test --project="Mobile Chrome"
```

### Archivos de Test

- `tests/e2e/navigation.spec.ts` - Navegación principal
  - ✅ Carga de página principal
  - ✅ Bottom navigation visible
  - ✅ Navegación entre vistas sin recarga (SPA)
  - ✅ Responsive en móvil
  - ✅ Mostrar productos
  - ✅ Botón de marcar completada
  - ✅ Accesibilidad básica

### Proyectos Configurados

1. **Desktop Chrome** - Navegador principal
2. **Mobile Chrome (Pixel 5)** - Android
3. **Mobile Safari (iPhone 12)** - iOS

### Ver Reportes

```bash
# Abrir reporte HTML después de ejecutar tests
npx playwright show-report
```

---

## ♿ Tests de Accesibilidad

Los tests de accesibilidad verifican WCAG compliance.

### Crear Tests de Accesibilidad

```typescript
// tests/a11y/accessibility.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('debe pasar auditoría de accesibilidad', async ({ page }) => {
  await page.goto('/');
  
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze();
  
  expect(results.violations).toEqual([]);
});
```

---

## 📊 Coverage

### Ver Coverage

```bash
npm run test:coverage
```

Esto genera:
- **Terminal:** Resumen de cobertura
- **HTML:** `coverage/index.html` (reporte interactivo)
- **LCOV:** `coverage/lcov.info` (para CI/CD)

### Métricas Actuales

| Tipo | Coverage | Objetivo |
|------|----------|----------|
| Statements | - | >80% |
| Branches | - | >75% |
| Functions | - | >80% |
| Lines | - >80% |

---

## 🤖 CI/CD

### GitHub Actions

Los tests se ejecutan automáticamente en:
- ✅ Cada push a `main`, `v2`, `develop`
- ✅ Cada Pull Request
- ✅ Deploy a Netlify (solo si todos los tests pasan)

### Workflow

```
1. Lint → 2. Unit Tests → 3. E2E Tests → 4. Build → 5. Deploy
```

### Ver Estado

Badges en README:
- ![Tests](https://github.com/ikeralvis/skincare-app/workflows/CI/badge.svg)
- ![Coverage](https://codecov.io/gh/ikeralvis/skincare-app/branch/v2/graph/badge.svg)

---

## 📝 Escribir Nuevos Tests

### Test Unitario

```typescript
// tests/unit/mi-test.test.ts
import { describe, it, expect } from 'vitest';
import { miFuncion } from '../../src/utils/miFuncion';

describe('miFuncion', () => {
  it('debe hacer algo', () => {
    const resultado = miFuncion('input');
    expect(resultado).toBe('output esperado');
  });
});
```

### Test E2E

```typescript
// tests/e2e/mi-flujo.spec.ts
import { test, expect } from '@playwright/test';

test('debe completar el flujo', async ({ page }) => {
  await page.goto('/');
  await page.click('button#mi-boton');
  await expect(page.locator('.resultado')).toBeVisible();
});
```

---

## 🐛 Debug

### Debug de Tests Unitarios

```bash
# Ejecutar un solo archivo
npx vitest tests/unit/streak-calculation.test.ts

# Ejecutar con breakpoints
npx vitest --inspect-brk
```

### Debug de Tests E2E

```bash
# Modo debug con Playwright Inspector
npm run test:e2e:debug

# Ver trazas de ejecución
npx playwright show-trace trace.zip
```

---

## 📚 Recursos

- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [Testing Library](https://testing-library.com)
- [Axe Accessibility](https://www.deque.com/axe/)

---

## ✅ Checklist de Testing

Antes de hacer un PR, verifica:

- [ ] `npm run test:unit` pasa ✅
- [ ] `npm run test:e2e` pasa ✅
- [ ] Coverage >80% en archivos modificados
- [ ] Tests E2E cubren el flujo principal
- [ ] No hay violaciones de accesibilidad

---

**¡Happy Testing!** 🚀
