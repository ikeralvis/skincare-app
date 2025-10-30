# 🚀 Roadmap de Mejoras - Skincare App

## 📊 Análisis del Estado Actual

### ✅ Fortalezas
- **Arquitectura SPA sólida**: Navegación fluida sin recargas
- **Firebase integrado**: Autenticación y base de datos en tiempo real
- **PWA funcional**: Installable, offline-ready con service worker
- **Sistema de racha**: Gamificación básica implementada
- **Responsive**: Adaptado a móvil y desktop
- **Bottom navigation**: UX móvil nativa

### ⚠️ Áreas de Mejora Críticas
1. **Testing**: Sin tests unitarios ni e2e
2. **Accesibilidad**: Sin soporte para lectores de pantalla
3. **Performance**: Falta optimización de imágenes y lazy loading
4. **Gestión de errores**: Manejo básico, sin retry logic
5. **Internacionalización**: Solo español
6. **Analytics**: Sin tracking de uso

---

## 🎨 FASE 1: Mejoras de UI/UX (1-2 semanas)

### 1.1 Sistema de Diseño Completo
**Prioridad: ALTA**

```typescript
// Crear sistema de tokens de diseño
// src/styles/tokens.css
:root {
  /* Colores primarios */
  --color-primary: #00ffff;
  --color-primary-dark: #00dddd;
  --color-primary-light: #66ffff;
  
  /* Gradientes */
  --gradient-card: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
  --gradient-primary: linear-gradient(135deg, #00ffff 0%, #0099ff 100%);
  
  /* Espaciado */
  --space-xs: 0.25rem;
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 1.5rem;
  --space-xl: 2rem;
  
  /* Sombras */
  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
  --shadow-md: 0 4px 6px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.2);
  --shadow-glow-cyan: 0 0 20px rgba(0,255,255,0.5);
  
  /* Transiciones */
  --transition-fast: 150ms ease;
  --transition-normal: 300ms ease;
  --transition-slow: 500ms ease;
}
```

**Archivos a crear:**
- `src/styles/tokens.css` - Tokens de diseño
- `src/styles/animations.css` - Animaciones reutilizables
- `src/components/ui/Button.astro` - Componente de botón reutilizable
- `src/components/ui/Card.astro` - Componente de tarjeta
- `src/components/ui/Modal.astro` - Modal genérico

### 1.2 Animaciones y Microinteracciones
**Prioridad: MEDIA**

```typescript
// Animaciones avanzadas con View Transitions API
// src/utils/animations.ts
export const pageTransitions = {
  fadeIn: 'view-transition-name: fade-in',
  slideUp: 'view-transition-name: slide-up',
  scaleIn: 'view-transition-name: scale-in'
};

// Ejemplo de uso en componentes
export function setupProductCardAnimations() {
  document.querySelectorAll('.product-card').forEach((card, index) => {
    card.style.animation = `fadeInUp 0.5s ease ${index * 0.1}s both`;
  });
}
```

**Animaciones a implementar:**
- ✨ Skeleton loaders durante carga de datos
- 🎯 Confetti al completar racha de 7, 30, 100 días
- 📈 Animación de números contadores (progress stats)
- 🔄 Loading spinners con marca personalizada
- 💫 Parallax sutil en scroll
- 🎨 Gradientes animados en backgrounds

### 1.3 Dark/Light Mode
**Prioridad: ALTA**

```typescript
// src/utils/theme.ts
export type Theme = 'dark' | 'light' | 'auto';

export function initTheme() {
  const stored = localStorage.getItem('theme') as Theme | null;
  const theme = stored || 'auto';
  
  if (theme === 'auto') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
  } else {
    document.documentElement.setAttribute('data-theme', theme);
  }
}
```

**Archivos:**
- `src/components/ThemeToggle.astro` - Botón de cambio de tema
- `src/styles/themes.css` - Variables CSS para temas
- Añadir al `BottomNav` o settings

### 1.4 Onboarding Interactivo
**Prioridad: MEDIA**

```typescript
// src/components/Onboarding.astro
// Tour guiado para nuevos usuarios con:
// 1. Bienvenida personalizada
// 2. Explicación de cada sección
// 3. Tutorial de marcar rutina
// 4. Tutorial de añadir productos
// 5. Explicación de racha

// Usar librería como Shepherd.js o Driver.js
```

---

## 🚀 FASE 2: Nuevas Funcionalidades (2-4 semanas)

### 2.1 Sistema de Recordatorios Push Mejorado
**Prioridad: ALTA**

```typescript
// src/utils/notifications.ts
import { getMessaging, getToken } from 'firebase/messaging';

export async function requestPushPermission() {
  const messaging = getMessaging();
  try {
    const token = await getToken(messaging, {
      vapidKey: 'TU_VAPID_KEY'
    });
    // Guardar token en Firestore
    await savePushToken(token);
  } catch (error) {
    console.error('Error obteniendo token push:', error);
  }
}

// Recordatorios inteligentes basados en horarios
export function scheduleSmartReminders(userRoutine: Routine) {
  // Si rutina de mañana: recordar a las 8am
  // Si rutina de noche: recordar a las 10pm
  // Personalizable por usuario
}
```

**Funcionalidades:**
- ⏰ Horarios personalizables por rutina
- 📅 Recordatorios recurrentes (diario, días específicos)
- 🔕 Snooze de 5, 10, 15 minutos
- 📊 Estadísticas de cuándo completas normalmente
- 🎯 Recordatorios "inteligentes" basados en patrones

### 2.2 Sistema de Logros y Badges
**Prioridad: MEDIA**

```typescript
// src/types/achievements.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: number;
  progress: number;
  total: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-routine',
    name: 'Primer Paso',
    description: 'Completa tu primera rutina',
    icon: '🌟',
    rarity: 'common',
    progress: 0,
    total: 1
  },
  {
    id: 'week-streak',
    name: 'Semana Perfecta',
    description: 'Mantén una racha de 7 días',
    icon: '🔥',
    rarity: 'rare',
    progress: 0,
    total: 7
  },
  {
    id: 'month-streak',
    name: 'Mes Imparable',
    description: 'Mantén una racha de 30 días',
    icon: '👑',
    rarity: 'epic',
    progress: 0,
    total: 30
  },
  {
    id: 'hundred-days',
    name: 'Leyenda',
    description: 'Completa 100 rutinas',
    icon: '💎',
    rarity: 'legendary',
    progress: 0,
    total: 100
  },
  {
    id: 'morning-person',
    name: 'Madrugador',
    description: 'Completa 20 rutinas de mañana',
    icon: '☀️',
    rarity: 'common',
    progress: 0,
    total: 20
  },
  {
    id: 'night-owl',
    name: 'Búho Nocturno',
    description: 'Completa 20 rutinas de noche',
    icon: '🌙',
    rarity: 'common',
    progress: 0,
    total: 20
  }
];
```

**UI:**
- Página `/logros` con grid de badges
- Animación de confetti al desbloquear
- Barra de progreso por logro
- Compartir logros en redes sociales

### 2.3 Análisis de Piel con IA (Futuro)
**Prioridad: BAJA (Requiere backend)**

```typescript
// Integración con API de análisis de piel
// Ejemplos: AWS Rekognition, Azure Computer Vision, Google Cloud Vision

export async function analyzeSkinPhoto(imageFile: File) {
  const formData = new FormData();
  formData.append('image', imageFile);
  
  const response = await fetch('/api/analyze-skin', {
    method: 'POST',
    body: formData
  });
  
  const result = await response.json();
  
  return {
    skinType: result.skinType, // Seca, grasa, mixta
    concerns: result.concerns, // Acné, manchas, arrugas
    recommendations: result.recommendations
  };
}
```

**Funcionalidades:**
- 📸 Tomar foto de la piel
- 🤖 Análisis con IA
- 📊 Tracking de evolución con fotos antes/después
- 💡 Recomendaciones personalizadas de productos

### 2.4 Compartir Rutinas
**Prioridad: MEDIA**

```typescript
// src/utils/sharing.ts
export async function shareRoutine(routine: Routine) {
  // Generar código único
  const shareCode = await generateShareCode(routine);
  
  // Guardar en Firestore bajo /shared-routines/{code}
  await db.collection('shared-routines').doc(shareCode).set({
    routine,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 días
  });
  
  // Generar URL
  const shareUrl = `${window.location.origin}/import/${shareCode}`;
  
  // Usar Web Share API
  if (navigator.share) {
    await navigator.share({
      title: 'Mi Rutina de Skincare',
      text: 'Mira mi rutina de skincare',
      url: shareUrl
    });
  }
  
  return shareUrl;
}
```

**UI:**
- Botón "Compartir" en página de rutinas
- Generar QR code para compartir
- Importar rutina de otro usuario con código

### 2.5 Modo Offline Avanzado
**Prioridad: ALTA**

```typescript
// src/utils/offline.ts
export class OfflineQueue {
  private queue: Array<QueuedAction> = [];
  
  async addToQueue(action: QueuedAction) {
    this.queue.push(action);
    await this.saveToIndexedDB();
  }
  
  async syncWhenOnline() {
    if (!navigator.onLine) return;
    
    for (const action of this.queue) {
      try {
        await this.executeAction(action);
        this.queue = this.queue.filter(a => a.id !== action.id);
      } catch (error) {
        console.error('Error syncing action:', error);
      }
    }
    
    await this.saveToIndexedDB();
  }
}
```

**Funcionalidades:**
- 💾 Cola de acciones offline (marcar rutina, editar productos)
- 🔄 Sincronización automática al recuperar conexión
- 📡 Indicador visual de estado offline
- 🗂️ Usar IndexedDB para cache robusta

### 2.6 Notas y Diario de Piel
**Prioridad: MEDIA**

```typescript
// src/types/journal.ts
export interface JournalEntry {
  id: string;
  date: string; // YYYY-MM-DD
  skinCondition: 1 | 2 | 3 | 4 | 5; // Rating de 1-5
  notes: string;
  photos?: string[]; // URLs de fotos
  weather?: string; // Soleado, nublado, etc.
  mood?: string; // Estado de ánimo
  sleep?: number; // Horas de sueño
  water?: number; // Vasos de agua
}
```

**UI:**
- Página `/diario` con entradas diarias
- Campo de notas al completar rutina
- Estadísticas correlacionando condición de piel con:
  - Racha de rutinas
  - Horas de sueño
  - Hidratación
  - Clima

---

## 🧪 FASE 3: Testing y CI/CD (1 semana)

### 3.1 Testing Unitario con Vitest
**Prioridad: CRÍTICA**

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/']
    }
  }
});
```

**Tests a crear:**

```typescript
// tests/utils/firebase.test.ts
import { describe, it, expect, vi } from 'vitest';
import { calculateStreak } from '../../src/utils/firebase';

describe('calculateStreak', () => {
  it('debe calcular racha de 0 si no hay completados', () => {
    const result = calculateStreak({});
    expect(result).toBe(0);
  });
  
  it('debe calcular racha consecutiva correctamente', () => {
    const completions = {
      '2025-10-27': { morning: { completed: true } },
      '2025-10-28': { night: { completed: true } },
      '2025-10-29': { morning: { completed: true } }
    };
    const result = calculateStreak(completions);
    expect(result).toBe(3);
  });
  
  it('debe romper racha si falta un día', () => {
    const completions = {
      '2025-10-25': { morning: { completed: true } },
      // Falta el 26
      '2025-10-27': { morning: { completed: true } },
      '2025-10-28': { morning: { completed: true } }
    };
    const result = calculateStreak(completions);
    expect(result).toBe(2); // Solo cuenta desde el 27
  });
});
```

**Archivos de test:**
- `tests/utils/firebase.test.ts` - Funciones de Firebase
- `tests/components/ProductCard.test.ts` - Componente de producto
- `tests/utils/animations.test.ts` - Funciones de animación
- `tests/utils/offline.test.ts` - Cola offline

### 3.2 Testing E2E con Playwright
**Prioridad: ALTA**

```typescript
// tests/e2e/complete-routine.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Completar Rutina', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Login como usuario de prueba
    await page.click('#auth-modal button:has-text("Iniciar Sesión")');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'testpass123');
    await page.click('button[type="submit"]');
    await page.waitForSelector('#mark-completed');
  });
  
  test('debe marcar rutina como completada', async ({ page }) => {
    // Click en botón de completar
    await page.click('#mark-completed');
    
    // Verificar que el botón cambia de estado
    const button = page.locator('#mark-completed');
    await expect(button).toBeDisabled();
    await expect(button).toContainText('✅ Rutina completada');
    
    // Ir a progreso y verificar racha
    await page.click('[data-view="progress"]');
    await page.waitForSelector('#streak-number');
    
    const streak = await page.textContent('#streak-number');
    expect(parseInt(streak!)).toBeGreaterThan(0);
  });
  
  test('debe persistir estado al recargar', async ({ page }) => {
    await page.click('#mark-completed');
    await page.reload();
    
    const button = page.locator('#mark-completed');
    await expect(button).toBeDisabled();
  });
});
```

**Tests E2E a crear:**
- Login/registro de usuarios
- Completar rutina
- Añadir/editar/borrar productos
- Navegación entre vistas
- Modo offline
- Notificaciones

### 3.3 GitHub Actions CI/CD
**Prioridad: ALTA**

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop, v2]
  pull_request:
    branches: [main, v2]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
  
  build:
    needs: test
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/v2'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
```

**Workflows adicionales:**
- `lighthouse.yml` - Auditoría de performance automática
- `security.yml` - Escaneo de vulnerabilidades con Snyk
- `dependabot.yml` - Actualización automática de dependencias

### 3.4 Netlify Deploy Preview
**Prioridad: MEDIA**

```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[plugins]]
  package = "@netlify/plugin-lighthouse"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), microphone=(), camera=()"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Funcionalidades:**
- 🔍 Preview automático en cada PR
- 📊 Lighthouse score en comentarios de PR
- 🔒 Headers de seguridad
- 📱 PWA optimizado

---

## ♿ FASE 4: Accesibilidad (1 semana)

### 4.1 ARIA Labels y Semántica
**Prioridad: ALTA**

```astro
<!-- Ejemplo de ProductCard accesible -->
<article 
  class="product-card" 
  role="article"
  aria-labelledby={`product-title-${accessCode}`}
  aria-describedby={`product-desc-${accessCode}`}
>
  <div class="step-badge" aria-label={`Paso ${step}`}>{step}</div>
  
  <img 
    src={image} 
    alt={`Producto ${title}`}
    loading="lazy"
    decoding="async"
  />
  
  <div class="card-content">
    <h2 id={`product-title-${accessCode}`} class="card-title">
      {title}
    </h2>
    
    <p id={`product-desc-${accessCode}`} class="card-function">
      <span class="sr-only">Función:</span>
      {function}
    </p>
    
    <button 
      aria-label={`Editar producto ${title}`}
      class="edit-btn"
    >
      ✏️
      <span class="sr-only">Editar</span>
    </button>
  </div>
</article>
```

**Mejoras:**
- 🎯 Focus visible en todos los elementos interactivos
- ⌨️ Navegación completa por teclado
- 📢 Anuncios de screen reader para acciones (rutina completada, etc.)
- 🎨 Contraste WCAG AAA en todos los textos
- 🔍 Skip links para navegación rápida

### 4.2 Testing de Accesibilidad
**Prioridad: ALTA**

```typescript
// tests/a11y/accessibility.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accesibilidad', () => {
  test('debe pasar auditoría de axe en home', async ({ page }) => {
    await page.goto('/');
    
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();
    
    expect(results.violations).toEqual([]);
  });
  
  test('debe ser navegable con teclado', async ({ page }) => {
    await page.goto('/');
    
    // Tab a través de elementos interactivos
    await page.keyboard.press('Tab');
    await expect(page.locator(':focus')).toBeVisible();
    
    // Enter para activar botón
    await page.keyboard.press('Enter');
  });
});
```

---

## 📊 FASE 5: Analytics y Monitoreo (3 días)

### 5.1 Firebase Analytics
**Prioridad: MEDIA**

```typescript
// src/utils/analytics.ts
import { logEvent, setUserId } from 'firebase/analytics';
import { analytics } from './firebase';

export const trackEvent = (eventName: string, params?: Record<string, any>) => {
  if (!analytics) return;
  logEvent(analytics, eventName, params);
};

// Eventos personalizados
export const AnalyticsEvents = {
  ROUTINE_COMPLETED: 'routine_completed',
  PRODUCT_ADDED: 'product_added',
  STREAK_MILESTONE: 'streak_milestone',
  ACHIEVEMENT_UNLOCKED: 'achievement_unlocked',
  SHARE_ROUTINE: 'share_routine'
};

// Ejemplo de uso
export function trackRoutineCompleted(routineType: 'morning' | 'night') {
  trackEvent(AnalyticsEvents.ROUTINE_COMPLETED, {
    routine_type: routineType,
    timestamp: Date.now()
  });
}
```

**Métricas clave:**
- 📊 Usuarios activos diarios/mensuales
- 🎯 Tasa de completado de rutinas
- 🔥 Duración promedio de rachas
- 📱 Tasa de instalación de PWA
- ⏱️ Tiempo de sesión promedio
- 🚪 Puntos de abandono

### 5.2 Error Tracking con Sentry
**Prioridad: ALTA**

```typescript
// src/utils/sentry.ts
import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 1.0,
  
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  
  beforeSend(event, hint) {
    // Filtrar errores conocidos
    if (event.exception?.values?.[0]?.value?.includes('ResizeObserver')) {
      return null;
    }
    return event;
  }
});
```

---

## 🌍 FASE 6: Internacionalización (1 semana)

### 6.1 i18n con Astro
**Prioridad: BAJA**

```typescript
// src/i18n/index.ts
export const languages = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  pt: 'Português'
};

export const translations = {
  es: {
    'nav.home': 'Inicio',
    'nav.calendar': 'Calendario',
    'nav.progress': 'Progreso',
    'nav.routine': 'Rutina',
    'routine.complete': 'Marcar como completada',
    'routine.completed': 'Rutina completada',
    'streak.days': 'días de racha'
  },
  en: {
    'nav.home': 'Home',
    'nav.calendar': 'Calendar',
    'nav.progress': 'Progress',
    'nav.routine': 'Routine',
    'routine.complete': 'Mark as completed',
    'routine.completed': 'Routine completed',
    'streak.days': 'day streak'
  }
};

export function t(key: string, lang: string = 'es'): string {
  return translations[lang]?.[key] || key;
}
```

---

## 🚀 FASE 7: Performance y Optimización (3 días)

### 7.1 Lazy Loading de Imágenes
**Prioridad: ALTA**

```astro
---
// src/components/OptimizedImage.astro
import { getImage } from 'astro:assets';

interface Props {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  loading?: 'lazy' | 'eager';
}

const { src, alt, width = 400, height = 400, loading = 'lazy' } = Astro.props;

// Generar múltiples tamaños
const optimizedImage = await getImage({
  src,
  width,
  height,
  format: 'webp'
});
---

<img
  src={optimizedImage.src}
  alt={alt}
  width={width}
  height={height}
  loading={loading}
  decoding="async"
  class="optimized-image"
/>
```

### 7.2 Code Splitting
**Prioridad: MEDIA**

```typescript
// Cargar componentes pesados solo cuando se necesiten
const loadProgressView = async () => {
  const module = await import('../components/ProgressView');
  return module.default;
};

// Usar dynamic imports en rutas
```

### 7.3 Service Worker Cache Strategy
**Prioridad: ALTA**

```javascript
// public/sw.js (mejorado)
const CACHE_NAME = 'skincare-v2';
const RUNTIME_CACHE = 'runtime';

// Cache first para assets estáticos
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Estrategia: Cache First para imágenes y fonts
  if (request.destination === 'image' || request.destination === 'font') {
    event.respondWith(cacheFirst(request));
  }
  
  // Estrategia: Network First para API calls
  else if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
  }
  
  // Estrategia: Stale While Revalidate para páginas
  else {
    event.respondWith(staleWhileRevalidate(request));
  }
});
```

---

## 📱 FASE 8: Features Nativas (Si se convierte en app nativa)

### 8.1 Capacitor para iOS/Android
**Prioridad: BAJA (Futuro)**

```typescript
// capacitor.config.ts
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.skincare.app',
  appName: 'Skincare Tracker',
  webDir: 'dist',
  plugins: {
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_icon_config_sample',
      iconColor: '#00ffff'
    },
    Camera: {
      ios: {
        photosPermissions: true
      }
    }
  }
};

export default config;
```

**Features nativas:**
- 📸 Cámara nativa para fotos de piel
- 📲 Push notifications nativas
- 📂 Acceso a galería
- 🔔 Notificaciones locales programadas
- 📊 Widgets para home screen
- 🌙 Soporte para modo oscuro del sistema
- 🔐 Biometric authentication (FaceID, TouchID)

---

## 📋 Resumen de Prioridades

### 🔴 CRÍTICO (Hacer YA)
1. ✅ Testing unitario con Vitest
2. ✅ Testing E2E con Playwright
3. ✅ GitHub Actions CI/CD
4. ✅ Error tracking con Sentry
5. ✅ Accesibilidad básica (ARIA, keyboard nav)

### 🟠 ALTA (1-2 semanas)
1. 🎨 Sistema de diseño completo
2. 🌓 Dark/Light mode
3. 🔔 Recordatorios push mejorados
4. 📴 Modo offline avanzado
5. 🏆 Sistema de logros
6. 🖼️ Optimización de imágenes

### 🟡 MEDIA (1 mes)
1. ✨ Animaciones y microinteracciones
2. 📓 Diario de piel
3. 🤝 Compartir rutinas
4. 📊 Analytics con Firebase
5. 🎓 Onboarding interactivo

### 🟢 BAJA (Futuro)
1. 🌍 Internacionalización
2. 🤖 Análisis de piel con IA
3. 📱 App nativa con Capacitor
4. 🎮 Gamificación avanzada

---

## 📦 Dependencias Recomendadas

```json
{
  "devDependencies": {
    "@axe-core/playwright": "^4.8.0",
    "@playwright/test": "^1.40.0",
    "@sentry/astro": "^7.91.0",
    "@vitest/coverage-v8": "^1.0.0",
    "axe-core": "^4.8.3",
    "eslint": "^8.55.0",
    "eslint-plugin-astro": "^0.31.0",
    "prettier": "^3.1.1",
    "prettier-plugin-astro": "^0.12.2",
    "vitest": "^1.0.4"
  },
  "dependencies": {
    "@sentry/browser": "^7.91.0",
    "firebase": "^10.7.1",
    "framer-motion": "^10.16.16"
  }
}
```

---

## 🎯 Objetivos de Métricas

### Performance
- ⚡ Lighthouse Score: >90 en todas las categorías
- 🚀 First Contentful Paint: <1.5s
- 📊 Time to Interactive: <3s
- 📦 Bundle size: <300kb (gzipped)

### Accesibilidad
- ♿ Axe violations: 0
- ⌨️ 100% navegable por teclado
- 🎨 Contraste mínimo: WCAG AA

### Testing
- 🧪 Code coverage: >80%
- ✅ Tests E2E: Flujos críticos cubiertos
- 🤖 CI/CD: Deploy automático en <5min

### UX
- 😊 Tasa de retención D1: >60%
- 🔥 Tasa de completado: >40%
- 📱 Tasa de instalación PWA: >20%

---

## 💰 Estimación de Tiempo Total

| Fase | Tiempo Estimado | Prioridad |
|------|----------------|-----------|
| Fase 1: UI/UX | 1-2 semanas | Alta |
| Fase 2: Funcionalidades | 2-4 semanas | Media |
| Fase 3: Testing | 1 semana | Crítica |
| Fase 4: Accesibilidad | 1 semana | Alta |
| Fase 5: Analytics | 3 días | Media |
| Fase 6: i18n | 1 semana | Baja |
| Fase 7: Performance | 3 días | Alta |
| Fase 8: Features Nativas | 2-4 semanas | Baja |
| **TOTAL** | **8-14 semanas** | - |

---

## 🤝 Recomendación Final

**Para los próximos 30 días, enfócate en:**

1. ✅ **Semana 1**: Testing (Vitest + Playwright + CI/CD)
2. 🎨 **Semana 2**: Sistema de diseño + Dark mode
3. 🏆 **Semana 3**: Sistema de logros + Recordatorios mejorados
4. ♿ **Semana 4**: Accesibilidad + Performance

Esto te dará una base sólida, mantenible y escalable para continuar añadiendo features sin technical debt.

**¿Por dónde empezar?** Ejecuta esto:

```bash
# 1. Instalar dependencias de testing
npm install -D vitest @vitest/coverage-v8 @playwright/test @axe-core/playwright

# 2. Crear estructura de tests
mkdir -p tests/{unit,e2e,a11y}

# 3. Configurar Vitest
touch vitest.config.ts

# 4. Escribir primer test
# tests/unit/firebase.test.ts

# 5. Setup GitHub Actions
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

---

## 🔄 Plan de Implementación Inmediata

### Día 1-2: Setup de Testing
- [ ] Instalar Vitest y Playwright
- [ ] Configurar `vitest.config.ts`
- [ ] Crear primer test unitario para `calculateStreak`
- [ ] Configurar Playwright para E2E

### Día 3-4: CI/CD
- [ ] Crear workflow de GitHub Actions
- [ ] Configurar secrets en GitHub
- [ ] Crear workflow de Lighthouse
- [ ] Setup Netlify deploy previews

### Día 5-7: Tests Críticos
- [ ] Test E2E: Login flow
- [ ] Test E2E: Completar rutina
- [ ] Test E2E: Navegación
- [ ] Test unitario: Firebase utils
- [ ] Test accesibilidad con Axe

### Semana 2: Dark Mode + Sistema de Diseño
- [ ] Crear `tokens.css` con variables
- [ ] Implementar ThemeToggle component
- [ ] Añadir localStorage para persistencia
- [ ] Actualizar todos los componentes
- [ ] Crear componentes UI reutilizables

### Semana 3-4: Features y Performance
- [ ] Sistema de logros básico
- [ ] Optimizar imágenes (webp, lazy load)
- [ ] Mejorar service worker
- [ ] Añadir analytics básico
- [ ] Implementar error tracking

---

## 📝 Notas Adicionales

### ⚠️ Advertencias
- **No optimizar prematuramente**: Enfócate primero en testing
- **Mobile first**: Siempre diseña para móvil primero
- **Progressive enhancement**: La app debe funcionar sin JS
- **Accesibilidad no es opcional**: Es un requisito legal en muchos países

### 💡 Tips
- Usa feature flags para releases graduales
- Implementa analytics antes de A/B testing
- Documenta decisiones arquitectónicas (ADR)
- Mantén el bundle size bajo control
- Usa semantic versioning (semver)

### 🔗 Recursos Útiles
- [Astro Docs](https://docs.astro.build)
- [Firebase Docs](https://firebase.google.com/docs)
- [Vitest Docs](https://vitest.dev)
- [Playwright Docs](https://playwright.dev)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Web.dev Performance](https://web.dev/performance)

---

**¡Manos a la obra! 🚀**

*Última actualización: 30 de Octubre, 2025*
