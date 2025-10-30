# 🧴 Skincare App - Rutina de Cuidado Personal

[![CI/CD Pipeline](https://github.com/ikeralvis/skincare-app/actions/workflows/ci.yml/badge.svg)](https://github.com/ikeralvis/skincare-app/actions/workflows/ci.yml)
[![Lighthouse Performance](https://github.com/ikeralvis/skincare-app/actions/workflows/lighthouse.yml/badge.svg)](https://github.com/ikeralvis/skincare-app/actions/workflows/lighthouse.yml)
[![Security Scan](https://github.com/ikeralvis/skincare-app/actions/workflows/security.yml/badge.svg)](https://github.com/ikeralvis/skincare-app/actions/workflows/security.yml)
[![codecov](https://codecov.io/gh/ikeralvis/skincare-app/branch/main/graph/badge.svg)](https://codecov.io/gh/ikeralvis/skincare-app)

Aplicación web progresiva (PWA) para gestionar y hacer seguimiento de rutinas diarias y nocturnas de cuidado personal, con sistema de rachas, logros y recordatorios.

## ✨ Características

- � **Gestión de Rutinas**: Rutinas matutinas y nocturnas personalizables
- 🔥 **Sistema de Rachas**: Seguimiento de días consecutivos completados
- 🏆 **Logros y Desafíos**: Desbloquea logros por tu constancia
- � **PWA Completa**: Instalable, funciona offline, notificaciones
- 🔔 **Recordatorios Inteligentes**: Notificaciones personalizadas
- 📊 **Estadísticas**: Progreso visual con gráficos
- 🎨 **Animaciones**: Experiencia fluida y atractiva
- 🔐 **Autenticación**: Login con Firebase (Email/Google)
- ☁️ **Sincronización Cloud**: Datos guardados en Firestore

## 🚀 Estructura del Proyecto

```text
skincare-app/
├── .github/
│   └── workflows/          # CI/CD workflows (CI, Lighthouse, Security)
├── public/
│   ├── images/             # Imágenes de productos
│   ├── manifest.webmanifest # PWA manifest
│   └── sw.js               # Service Worker
├── src/
│   ├── components/         # Componentes Astro
│   │   ├── AuthModal.astro
│   │   ├── BottomNav.astro
│   │   ├── Calendar.astro
│   │   ├── Header.astro
│   │   ├── ProductCard.astro
│   │   └── RoutineEditor.astro
│   ├── data/
│   │   └── routines.ts     # Datos de productos
│   ├── pages/
│   │   └── index.astro     # Página principal
│   ├── types/
│   │   └── routine.ts      # TypeScript types
│   └── utils/
│       └── firebase.ts     # Configuración Firebase
└── tests/
    ├── unit/               # Tests unitarios (Vitest)
    ├── e2e/                # Tests E2E (Playwright)
    └── a11y/               # Tests de accesibilidad
```

## 🧞 Comandos

### Desarrollo

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instala dependencias                             |
| `npm run dev`             | Inicia servidor de desarrollo en `localhost:4321`|
| `npm run build`           | Construye el sitio para producción en `./dist/`  |
| `npm run preview`         | Previsualiza el build localmente                 |

### Testing

| Comando                   | Acción                                           |
| :------------------------ | :----------------------------------------------- |
| `npm run test`            | Ejecuta todos los tests                          |
| `npm run test:unit`       | Ejecuta tests unitarios (Vitest)                 |
| `npm run test:ui`         | Abre interfaz visual de Vitest                   |
| `npm run test:coverage`   | Genera reporte de cobertura                      |
| `npm run test:e2e`        | Ejecuta tests E2E (Playwright)                   |
| `npm run test:e2e:ui`     | Abre interfaz visual de Playwright               |
| `npm run test:e2e:debug`  | Debug tests E2E con inspector                    |

## 🔧 Configuración Inicial

### 1. Clonar el Repositorio

```bash
git clone https://github.com/USUARIO/skincare-app.git
cd skincare-app
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Firebase

Crea un archivo `.env` en la raíz del proyecto:

```env
PUBLIC_FIREBASE_API_KEY=tu-api-key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### 4. Iniciar Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:4321`

## 🧪 Testing

El proyecto incluye una suite completa de tests:

- **27 tests unitarios** para lógica de negocio (cálculo de rachas, validación de datos)
- **Tests E2E** para flujos de usuario críticos (navegación, autenticación, completar rutinas)
- **Tests de accesibilidad** con Axe para WCAG compliance

Ver [TESTING.md](./TESTING.md) para más detalles.

## 🚀 CI/CD Pipeline

El proyecto incluye workflows automatizados de GitHub Actions:

### 🔄 CI/CD Principal (`ci.yml`)
- ✅ Linting y validación de código
- ✅ Tests unitarios con cobertura (Codecov)
- ✅ Tests E2E en múltiples navegadores
- ✅ Build de producción
- ✅ Deploy automático a Netlify (preview para PRs, producción para main/v2)

### ⚡ Performance Audit (`lighthouse.yml`)
- 📊 Auditoría de rendimiento con Lighthouse
- 🎯 Umbrales: Performance 80%, Accessibility 90%, Best Practices 85%, SEO 90%
- 📅 Ejecución semanal + en cada push/PR

### 🔒 Security Scan (`security.yml`)
- 🔍 npm audit para vulnerabilidades
- 🔎 CodeQL analysis para análisis estático
- 📦 Dependency review en PRs
- 📅 Ejecución diaria

### 🤖 Dependabot
- 📦 Actualizaciones automáticas de dependencias
- 📅 Semanalmente los lunes
- 🏷️ Agrupadas por categorías (dev, firebase, astro)

Ver [GITHUB_SETUP.md](./GITHUB_SETUP.md) para configuración completa.

## 📚 Documentación

- [ROADMAP.md](./ROADMAP.md) - Plan de desarrollo a largo plazo (8 fases, 8-14 semanas)
- [IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md) - Plan de implementación inmediato (30 días)
- [TESTING.md](./TESTING.md) - Guía completa de testing
- [GITHUB_SETUP.md](./GITHUB_SETUP.md) - Configuración de CI/CD y secretos
- [FIREBASE_RULES.md](./FIREBASE_RULES.md) - Reglas de seguridad de Firebase

## 🛠️ Stack Tecnológico

- **Framework**: [Astro](https://astro.build/) - Para SSG/SSR optimizado
- **Lenguaje**: TypeScript - Para type safety
- **Backend**: Firebase (Auth + Firestore + Storage)
- **Estilos**: CSS custom properties con diseño mobile-first
- **Testing**: Vitest + Playwright + Axe
- **CI/CD**: GitHub Actions + Netlify
- **PWA**: Service Worker + Web App Manifest

## 🎯 Próximas Funcionalidades

- [ ] Sistema de recordatorios mejorado con snooze y prioridades
- [ ] Sistema de logros dinámico con desafíos semanales
- [ ] Animaciones avanzadas (confetti, ripples, skeletons)
- [ ] Modo oscuro con preferencias del sistema
- [ ] Internacionalización (i18n) - Español/Inglés/Euskera
- [ ] Gráficos avanzados con Chart.js
- [ ] Compartir logros en redes sociales
- [ ] Exportar datos a CSV/JSON

Ver [ROADMAP.md](./ROADMAP.md) para el plan completo.

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'feat: add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

Asegúrate de que:
- ✅ Todos los tests pasan (`npm run test`)
- ✅ El código cumple con el linting (`npm run lint`)
- ✅ La cobertura de código se mantiene o mejora
- ✅ Incluyes tests para nuevas funcionalidades

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👤 Autor

**ikeralvis** - Desarrollo completo de la aplicación

---

⭐ Si este proyecto te resulta útil, ¡considera darle una estrella en GitHub!
