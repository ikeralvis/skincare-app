# 📋 Plan de Implementación Inmediata

**Fecha de inicio:** 30 de Octubre, 2025  
**Objetivo:** Implementar 5 features críticas para mejorar la app

---

## 🎯 Features a Implementar

### 1. ✅ Testing Completo (Prioridad: CRÍTICA)
### 2. 🤖 GitHub Actions CI/CD (Prioridad: CRÍTICA)
### 3. 🔔 Sistema de Recordatorios Mejorado (Prioridad: ALTA)
### 4. 🏆 Sistema de Logros Dinámico (Prioridad: ALTA)
### 5. ✨ Animaciones Móviles (Prioridad: MEDIA)

---

## 📅 Timeline

```
Semana 1 (Días 1-7)
├── Día 1-2: Testing + GitHub Actions
├── Día 3-4: Recordatorios mejorados
└── Día 5-7: Sistema de logros

Semana 2 (Días 8-10)
└── Día 8-10: Animaciones + Polish
```

---

## 1️⃣ TESTING COMPLETO

### 📦 Dependencias a Instalar

```bash
npm install -D vitest @vitest/coverage-v8 @vitest/ui
npm install -D @playwright/test
npm install -D @axe-core/playwright
npm install -D jsdom
```

### 📁 Estructura de Carpetas

```
tests/
├── unit/
│   ├── firebase.test.ts          # Tests de Firebase utils
│   ├── streak-calculation.test.ts # Tests del cálculo de racha
│   └── achievements.test.ts       # Tests de logros
├── e2e/
│   ├── auth.spec.ts              # Login/registro
│   ├── complete-routine.spec.ts  # Marcar rutina
│   ├── navigation.spec.ts        # Navegación entre vistas
│   └── reminders.spec.ts         # Recordatorios
└── a11y/
    └── accessibility.spec.ts      # Tests de accesibilidad
```

### 🔧 Archivos de Configuración

#### `vitest.config.ts`
```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.*',
        '**/types/**'
      ],
      include: ['src/**/*.ts', 'src/**/*.astro']
    }
  }
});
```

#### `playwright.config.ts`
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:4321',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
  },
});
```

### 📝 Tests Unitarios Prioritarios

#### `tests/unit/streak-calculation.test.ts`
```typescript
import { describe, it, expect } from 'vitest';

// Simular la función calculateStreak
function calculateStreak(completions: Record<string, any>): number {
  const dates = Object.keys(completions).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  if (dates.length === 0) return 0;
  
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = 0; i < dates.length; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(today.getDate() - i);
    const dateKey = checkDate.toISOString().split('T')[0];
    
    if (completions[dateKey]) {
      const dayData = completions[dateKey];
      if (dayData.morning?.completed || dayData.night?.completed) {
        streak++;
      } else {
        break;
      }
    } else if (i > 1) {
      // Permitir 1 día de gracia
      break;
    }
  }
  
  return streak;
}

describe('calculateStreak', () => {
  it('debe retornar 0 cuando no hay completados', () => {
    expect(calculateStreak({})).toBe(0);
  });
  
  it('debe calcular racha de 1 día correctamente', () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = {
      [today]: { morning: { completed: true } }
    };
    expect(calculateStreak(completions)).toBe(1);
  });
  
  it('debe calcular racha consecutiva de 7 días', () => {
    const completions: Record<string, any> = {};
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      completions[key] = { morning: { completed: true } };
    }
    
    expect(calculateStreak(completions)).toBe(7);
  });
  
  it('debe romper racha después de 2 días sin completar', () => {
    const today = new Date();
    const completions: Record<string, any> = {};
    
    // Hoy y ayer
    for (let i = 0; i < 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      completions[date.toISOString().split('T')[0]] = {
        morning: { completed: true }
      };
    }
    
    // Hace 5 días (gap de 3 días)
    const oldDate = new Date(today);
    oldDate.setDate(today.getDate() - 5);
    completions[oldDate.toISOString().split('T')[0]] = {
      morning: { completed: true }
    };
    
    expect(calculateStreak(completions)).toBe(2);
  });
  
  it('debe permitir 1 día de gracia', () => {
    const today = new Date();
    const completions: Record<string, any> = {};
    
    // Hoy
    completions[today.toISOString().split('T')[0]] = {
      morning: { completed: true }
    };
    
    // Hace 2 días (saltar 1 día)
    const date2 = new Date(today);
    date2.setDate(today.getDate() - 2);
    completions[date2.toISOString().split('T')[0]] = {
      night: { completed: true }
    };
    
    expect(calculateStreak(completions)).toBe(2);
  });
});
```

### 📝 Scripts en package.json

```json
{
  "scripts": {
    "test": "vitest",
    "test:unit": "vitest run",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

---

## 2️⃣ GITHUB ACTIONS CI/CD

### 📁 Estructura de Workflows

```
.github/
└── workflows/
    ├── ci.yml           # Tests + Build + Deploy
    ├── lighthouse.yml   # Performance audit
    └── dependabot.yml   # Auto-updates
```

### 🔧 Workflow Principal: `.github/workflows/ci.yml`

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, v2, develop]
  pull_request:
    branches: [main, v2]

jobs:
  lint:
    name: 🔍 Linting
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run ESLint
        run: npm run lint || echo "Lint no configurado aún"

  test-unit:
    name: 🧪 Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

  test-e2e:
    name: 🎭 E2E Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright Browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload Playwright Report
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30

  build:
    name: 🏗️ Build
    needs: [test-unit, test-e2e]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build project
        run: npm run build
        env:
          PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          PUBLIC_FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          PUBLIC_FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          PUBLIC_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          PUBLIC_FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    name: 🚀 Deploy to Netlify
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' || github.ref == 'refs/heads/v2'
    steps:
      - uses: actions/checkout@v4
      
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

### 🔧 Lighthouse Workflow: `.github/workflows/lighthouse.yml`

```yaml
name: Lighthouse CI

on:
  push:
    branches: [main, v2]
  pull_request:
    branches: [main, v2]

jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            http://localhost:4321/
          uploadArtifacts: true
          temporaryPublicStorage: true
```

### 🔧 Secrets a Configurar en GitHub

```
FIREBASE_API_KEY
FIREBASE_AUTH_DOMAIN
FIREBASE_PROJECT_ID
FIREBASE_STORAGE_BUCKET
FIREBASE_MESSAGING_SENDER_ID
FIREBASE_APP_ID
NETLIFY_SITE_ID
NETLIFY_AUTH_TOKEN
```

---

## 3️⃣ SISTEMA DE RECORDATORIOS MEJORADO

### 🎨 Nuevas Interfaces

```typescript
// src/types/reminder.ts
export interface Reminder {
  id: string;
  userId: string;
  type: 'morning' | 'night';
  time: string; // "08:00" formato HH:mm
  days: number[]; // 0-6, donde 0 = domingo
  enabled: boolean;
  sound: boolean;
  vibrate: boolean;
  message: string;
  createdAt: number;
  updatedAt: number;
}

export interface ReminderSettings {
  morningTime: string;
  nightTime: string;
  morningEnabled: boolean;
  nightEnabled: boolean;
  daysOfWeek: number[];
  sound: boolean;
  vibrate: boolean;
  snoozeMinutes: number;
}
```

### 📁 Estructura de Componentes

```
src/
├── components/
│   ├── reminders/
│   │   ├── ReminderCard.astro       # Card individual
│   │   ├── ReminderModal.astro      # Modal de edición
│   │   ├── ReminderSettings.astro   # Settings generales
│   │   └── ReminderList.astro       # Lista de recordatorios
│   └── ui/
│       ├── TimeInput.astro          # Input de hora personalizado
│       ├── Toggle.astro             # Switch toggle
│       └── DaySelector.astro        # Selector de días
└── utils/
    ├── reminders.ts                 # Lógica de recordatorios
    └── notifications.ts             # Web Notifications API
```

### 🎨 Diseño de UI (Mobile-First)

#### Componente: `ReminderCard.astro`

```astro
---
interface Props {
  reminder: {
    id: string;
    type: 'morning' | 'night';
    time: string;
    enabled: boolean;
  };
}

const { reminder } = Astro.props;
const icon = reminder.type === 'morning' ? '☀️' : '🌙';
---

<div class="reminder-card" data-reminder-id={reminder.id}>
  <div class="reminder-icon">{icon}</div>
  
  <div class="reminder-content">
    <h3 class="reminder-title">
      Rutina {reminder.type === 'morning' ? 'Diurna' : 'Nocturna'}
    </h3>
    <p class="reminder-time">{reminder.time}</p>
  </div>
  
  <label class="toggle-switch">
    <input 
      type="checkbox" 
      checked={reminder.enabled}
      class="toggle-input"
      data-action="toggle-reminder"
    />
    <span class="toggle-slider"></span>
  </label>
  
  <button 
    class="edit-btn"
    data-action="edit-reminder"
    aria-label="Editar recordatorio"
  >
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
    </svg>
  </button>
</div>

<style>
  .reminder-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  
  .reminder-card:active {
    transform: scale(0.98);
  }
  
  .reminder-icon {
    font-size: 2rem;
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 255, 255, 0.1);
    border-radius: 12px;
  }
  
  .reminder-content {
    flex: 1;
  }
  
  .reminder-title {
    font-size: 1rem;
    font-weight: 600;
    margin: 0;
    color: white;
  }
  
  .reminder-time {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0.25rem 0 0;
    color: #00ffff;
  }
  
  .toggle-switch {
    position: relative;
    width: 56px;
    height: 32px;
    cursor: pointer;
  }
  
  .toggle-input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .toggle-slider {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 34px;
    transition: 0.4s;
  }
  
  .toggle-slider:before {
    position: absolute;
    content: "";
    height: 24px;
    width: 24px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    border-radius: 50%;
    transition: 0.4s;
  }
  
  .toggle-input:checked + .toggle-slider {
    background-color: #00ffff;
  }
  
  .toggle-input:checked + .toggle-slider:before {
    transform: translateX(24px);
  }
  
  .edit-btn {
    width: 40px;
    height: 40px;
    border-radius: 10px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
  }
  
  .edit-btn:active {
    transform: scale(0.9);
    background: rgba(255, 255, 255, 0.2);
  }
</style>
```

### 🔔 Lógica de Notificaciones

```typescript
// src/utils/notifications.ts
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.warn('Este navegador no soporta notificaciones');
    return false;
  }
  
  if (Notification.permission === 'granted') {
    return true;
  }
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
}

export function showNotification(title: string, options?: NotificationOptions) {
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      icon: '/images/icon-192.png',
      badge: '/images/badge-72.png',
      vibrate: [200, 100, 200],
      ...options
    });
    
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
    
    return notification;
  }
}

export function scheduleReminder(time: string, type: 'morning' | 'night') {
  // Calcular tiempo hasta el recordatorio
  const [hours, minutes] = time.split(':').map(Number);
  const now = new Date();
  const scheduledTime = new Date();
  scheduledTime.setHours(hours, minutes, 0, 0);
  
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }
  
  const msUntilReminder = scheduledTime.getTime() - now.getTime();
  
  return setTimeout(() => {
    const message = type === 'morning' 
      ? '☀️ ¡Hora de tu rutina diurna!'
      : '🌙 ¡Hora de tu rutina nocturna!';
    
    showNotification('Skincare Reminder', {
      body: message,
      tag: `reminder-${type}`,
      requireInteraction: true,
      actions: [
        { action: 'complete', title: 'Marcar como completada' },
        { action: 'snooze', title: 'Posponer 10 min' }
      ]
    });
  }, msUntilReminder);
}
```

---

## 4️⃣ SISTEMA DE LOGROS DINÁMICO

### 🏆 Nuevas Interfaces

```typescript
// src/types/achievements.ts
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'consistency' | 'milestone' | 'special';
  target: number;
  progress: number;
  unlocked: boolean;
  unlockedAt?: number;
  reward?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  icon: string;
  startDate: string;
  endDate: string;
  target: number;
  progress: number;
  completed: boolean;
  reward: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Categoría: Primeros pasos
  {
    id: 'first-routine',
    name: 'Primer Paso',
    description: 'Completa tu primera rutina',
    icon: '🌟',
    rarity: 'common',
    category: 'milestone',
    target: 1,
    progress: 0,
    unlocked: false
  },
  
  // Categoría: Rachas cortas
  {
    id: 'streak-3',
    name: 'Compromiso Inicial',
    description: 'Mantén una racha de 3 días',
    icon: '🔥',
    rarity: 'common',
    category: 'streak',
    target: 3,
    progress: 0,
    unlocked: false
  },
  {
    id: 'streak-7',
    name: 'Semana Perfecta',
    description: 'Mantén una racha de 7 días',
    icon: '💪',
    rarity: 'rare',
    category: 'streak',
    target: 7,
    progress: 0,
    unlocked: false,
    reward: 'Desbloquea tema Dorado'
  },
  {
    id: 'streak-15',
    name: 'Disciplina',
    description: 'Mantén una racha de 15 días',
    icon: '⚡',
    rarity: 'rare',
    category: 'streak',
    target: 15,
    progress: 0,
    unlocked: false
  },
  {
    id: 'streak-30',
    name: 'Mes Imparable',
    description: 'Mantén una racha de 30 días',
    icon: '👑',
    rarity: 'epic',
    category: 'streak',
    target: 30,
    progress: 0,
    unlocked: false,
    reward: 'Desbloquea tema Diamante'
  },
  {
    id: 'streak-100',
    name: 'Leyenda',
    description: 'Mantén una racha de 100 días',
    icon: '💎',
    rarity: 'legendary',
    category: 'streak',
    target: 100,
    progress: 0,
    unlocked: false,
    reward: 'Insignia de Leyenda + Tema Exclusivo'
  },
  
  // Categoría: Consistencia
  {
    id: 'morning-10',
    name: 'Madrugador',
    description: 'Completa 10 rutinas de mañana',
    icon: '☀️',
    rarity: 'common',
    category: 'consistency',
    target: 10,
    progress: 0,
    unlocked: false
  },
  {
    id: 'night-10',
    name: 'Búho Nocturno',
    description: 'Completa 10 rutinas de noche',
    icon: '🌙',
    rarity: 'common',
    category: 'consistency',
    target: 10,
    progress: 0,
    unlocked: false
  },
  {
    id: 'both-same-day',
    name: 'Día Completo',
    description: 'Completa ambas rutinas el mismo día 5 veces',
    icon: '🌓',
    rarity: 'rare',
    category: 'consistency',
    target: 5,
    progress: 0,
    unlocked: false
  },
  
  // Categoría: Milestones
  {
    id: 'total-50',
    name: 'Medio Siglo',
    description: 'Completa 50 rutinas en total',
    icon: '🎯',
    rarity: 'rare',
    category: 'milestone',
    target: 50,
    progress: 0,
    unlocked: false
  },
  {
    id: 'total-100',
    name: 'Centurión',
    description: 'Completa 100 rutinas en total',
    icon: '💯',
    rarity: 'epic',
    category: 'milestone',
    target: 100,
    progress: 0,
    unlocked: false
  },
  {
    id: 'total-365',
    name: 'Año de Cuidado',
    description: 'Completa 365 rutinas en total',
    icon: '🏆',
    rarity: 'legendary',
    category: 'milestone',
    target: 365,
    progress: 0,
    unlocked: false,
    reward: 'Título de Maestro + Certificado Digital'
  }
];
```

### 🎯 Sistema de Retos Dinámico

```typescript
// src/utils/challenges.ts
export function getCurrentChallenge(streak: number): Challenge | null {
  // Definir siguiente objetivo basado en racha actual
  const nextTargets = [3, 7, 15, 30, 50, 100];
  const nextTarget = nextTargets.find(t => t > streak);
  
  if (!nextTarget) return null;
  
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + (nextTarget - streak));
  
  return {
    id: `challenge-${nextTarget}`,
    name: `Reto: ${nextTarget} días`,
    description: `Alcanza una racha de ${nextTarget} días consecutivos`,
    icon: getIconForTarget(nextTarget),
    startDate: today.toISOString(),
    endDate: endDate.toISOString(),
    target: nextTarget,
    progress: streak,
    completed: false,
    reward: getRewardForTarget(nextTarget)
  };
}

function getIconForTarget(target: number): string {
  if (target <= 7) return '🔥';
  if (target <= 15) return '⚡';
  if (target <= 30) return '👑';
  if (target <= 50) return '💪';
  return '💎';
}

function getRewardForTarget(target: number): string {
  const rewards: Record<number, string> = {
    3: '+10 puntos',
    7: 'Tema Dorado + 25 puntos',
    15: 'Badge "Disciplinado" + 50 puntos',
    30: 'Tema Diamante + 100 puntos',
    50: 'Badge "Imparable" + 200 puntos',
    100: 'Título de Leyenda + 500 puntos'
  };
  return rewards[target] || `+${target * 5} puntos`;
}
```

### 🎨 UI de Retos

```astro
<!-- src/components/challenges/CurrentChallenge.astro -->
<div class="challenge-card">
  <div class="challenge-header">
    <span class="challenge-icon">🎯</span>
    <h3>Reto Actual</h3>
  </div>
  
  <div class="challenge-body">
    <h2 id="challenge-name">Reto: 7 días</h2>
    <p id="challenge-desc">Alcanza una racha de 7 días consecutivos</p>
    
    <div class="progress-section">
      <div class="progress-bar">
        <div class="progress-fill" style="width: 57%"></div>
      </div>
      <div class="progress-text">
        <span id="current-progress">4</span> / <span id="target-progress">7</span> días
      </div>
    </div>
    
    <div class="reward-section">
      <span class="reward-label">🎁 Recompensa:</span>
      <span class="reward-text" id="reward">Tema Dorado + 25 puntos</span>
    </div>
    
    <div class="time-left">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm1-8.5V4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l2.5 2.5a1 1 0 1 0 1.414-1.414L9 7.5z"/>
      </svg>
      <span id="time-remaining">3 días restantes</span>
    </div>
  </div>
</div>

<style>
  .challenge-card {
    background: linear-gradient(135deg, rgba(0, 255, 255, 0.1), rgba(102, 126, 234, 0.1));
    border-radius: 20px;
    padding: 1.5rem;
    border: 2px solid rgba(0, 255, 255, 0.3);
    box-shadow: 0 8px 32px rgba(0, 255, 255, 0.2);
    animation: pulse 3s ease-in-out infinite;
  }
  
  @keyframes pulse {
    0%, 100% {
      box-shadow: 0 8px 32px rgba(0, 255, 255, 0.2);
    }
    50% {
      box-shadow: 0 8px 32px rgba(0, 255, 255, 0.4);
    }
  }
  
  .challenge-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  
  .challenge-icon {
    font-size: 2rem;
  }
  
  .challenge-header h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    opacity: 0.7;
    margin: 0;
  }
  
  .challenge-body h2 {
    font-size: 1.5rem;
    margin: 0 0 0.5rem;
    color: #00ffff;
  }
  
  .challenge-body p {
    opacity: 0.8;
    margin: 0 0 1.5rem;
  }
  
  .progress-section {
    margin-bottom: 1rem;
  }
  
  .progress-bar {
    width: 100%;
    height: 12px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }
  
  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ffff, #667eea);
    border-radius: 10px;
    transition: width 0.5s ease;
    animation: shimmer 2s infinite;
  }
  
  @keyframes shimmer {
    0% { opacity: 1; }
    50% { opacity: 0.8; }
    100% { opacity: 1; }
  }
  
  .progress-text {
    text-align: center;
    font-weight: 600;
    color: #00ffff;
  }
  
  .reward-section {
    background: rgba(0, 255, 255, 0.05);
    padding: 0.75rem;
    border-radius: 10px;
    margin-bottom: 1rem;
  }
  
  .reward-label {
    font-size: 0.875rem;
    opacity: 0.7;
  }
  
  .reward-text {
    display: block;
    font-weight: 600;
    color: #ffcc00;
    margin-top: 0.25rem;
  }
  
  .time-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    justify-content: center;
    opacity: 0.7;
    font-size: 0.875rem;
  }
</style>
```

---

## 5️⃣ ANIMACIONES MÓVILES

### 📦 Librería a Usar

Recomiendo usar **CSS nativo + Web Animations API** para mejor performance en móvil.

### ✨ Animaciones a Implementar

#### 1. Confetti al Completar Rutina
```typescript
// src/utils/confetti.ts
export function launchConfetti() {
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    // Crear partículas desde ambos lados
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
}
```

#### 2. Animaciones de Entrada para Cards
```css
/* src/styles/animations.css */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.5s ease-out forwards;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out forwards;
}

.animate-slide-in-right {
  animation: slideInRight 0.4s ease-out forwards;
}

/* Stagger delay para múltiples elementos */
.stagger-1 { animation-delay: 0.1s; }
.stagger-2 { animation-delay: 0.2s; }
.stagger-3 { animation-delay: 0.3s; }
.stagger-4 { animation-delay: 0.4s; }
```

#### 3. Ripple Effect en Botones
```css
/* Efecto ripple al tocar */
.ripple-effect {
  position: relative;
  overflow: hidden;
}

.ripple-effect::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.ripple-effect:active::after {
  width: 300px;
  height: 300px;
}
```

#### 4. Loading Skeleton
```astro
<!-- src/components/ui/Skeleton.astro -->
<div class="skeleton">
  <div class="skeleton-line"></div>
  <div class="skeleton-line short"></div>
  <div class="skeleton-circle"></div>
</div>

<style>
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }
  
  .skeleton {
    padding: 1rem;
  }
  
  .skeleton-line,
  .skeleton-circle {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.15) 50%,
      rgba(255, 255, 255, 0.05) 100%
    );
    background-size: 1000px 100%;
    animation: shimmer 2s infinite;
    border-radius: 8px;
  }
  
  .skeleton-line {
    height: 20px;
    margin-bottom: 10px;
  }
  
  .skeleton-line.short {
    width: 60%;
  }
  
  .skeleton-circle {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
</style>
```

---

## 📊 Checklist de Implementación

### Semana 1

#### Días 1-2: Testing + CI/CD
- [ ] Instalar dependencias: Vitest, Playwright, Axe
- [ ] Crear `vitest.config.ts`
- [ ] Crear `playwright.config.ts`
- [ ] Escribir 5 tests unitarios básicos
- [ ] Escribir 3 tests E2E
- [ ] Crear workflow `.github/workflows/ci.yml`
- [ ] Configurar secrets en GitHub
- [ ] Hacer primer push y verificar que pasa CI

#### Días 3-4: Recordatorios
- [ ] Crear tipos en `src/types/reminder.ts`
- [ ] Crear componente `ReminderCard.astro`
- [ ] Crear componente `ReminderModal.astro`
- [ ] Crear utils `src/utils/notifications.ts`
- [ ] Implementar lógica de scheduling
- [ ] Integrar con Firebase para persistencia
- [ ] Agregar página de settings de recordatorios
- [ ] Pedir permisos de notificaciones

#### Días 5-7: Logros
- [ ] Definir achievements en `src/types/achievements.ts`
- [ ] Crear sistema de retos dinámicos
- [ ] Crear componente `CurrentChallenge.astro`
- [ ] Crear página de logros `/logros`
- [ ] Implementar lógica de desbloqueo
- [ ] Guardar progreso en Firebase
- [ ] Mostrar confetti al desbloquear

### Semana 2

#### Días 8-10: Animaciones + Polish
- [ ] Crear `src/styles/animations.css`
- [ ] Implementar confetti con `canvas-confetti`
- [ ] Añadir animaciones de entrada a cards
- [ ] Añadir ripple effect a botones
- [ ] Crear skeleton loaders
- [ ] Optimizar animaciones para 60fps
- [ ] Testing en dispositivos reales
- [ ] Ajustes finales y documentación

---

## 🎯 Métricas de Éxito

- ✅ **Tests**: Coverage >80%
- ✅ **CI/CD**: Build time <5min
- ✅ **Recordatorios**: Engagement rate >30%
- ✅ **Logros**: 50% usuarios desbloquean al menos 3
- ✅ **Performance**: Lighthouse >90 en mobile

---

**¿Listo para empezar?** 🚀

Ejecuta:
```bash
npm install -D vitest @vitest/coverage-v8 @playwright/test @axe-core/playwright jsdom
npm install canvas-confetti
npm install -D @types/canvas-confetti
```
