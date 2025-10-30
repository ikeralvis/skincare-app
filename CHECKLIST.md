# ✅ Checklist de Configuración CI/CD

Esta es tu guía paso a paso para configurar todo el sistema CI/CD. Marca cada ítem según lo completes.

---

## 🔥 Fase 1: Configuración de Firebase

### Firebase Console

- [ ] **Crear/Verificar Proyecto Firebase**
  - Ir a: https://console.firebase.google.com/
  - Crear proyecto o seleccionar existente
  - Proyecto ID: `___________________`

- [ ] **Habilitar Authentication**
  - Ir a: Authentication → Sign-in method
  - Habilitar: Email/Password ✅
  - Habilitar: Google (opcional) ⭕

- [ ] **Crear Firestore Database**
  - Ir a: Firestore Database → Create database
  - Modo: Production mode
  - Región: europe-west1 (o más cercana)

- [ ] **Habilitar Storage**
  - Ir a: Storage → Get started
  - Usar reglas por defecto

- [ ] **Obtener Configuración Web**
  - Ir a: Project Settings (⚙️) → Your apps
  - Seleccionar Web app
  - Copiar valores de `firebaseConfig`:
    ```
    API Key:         ___________________
    Auth Domain:     ___________________
    Project ID:      ___________________
    Storage Bucket:  ___________________
    Messaging ID:    ___________________
    App ID:          ___________________
    ```

- [ ] **Configurar Dominios Autorizados**
  - Ir a: Authentication → Settings → Authorized domains
  - Añadir: localhost
  - Añadir: tu-sitio.netlify.app
  - Añadir: dominio personalizado (si aplica)

---

## 🌐 Fase 2: Configuración de Netlify

### Crear Sitio en Netlify

- [ ] **Conectar Repositorio**
  - Ir a: https://app.netlify.com/
  - Clic en "Add new site" → "Import an existing project"
  - Conectar con GitHub
  - Seleccionar: skincare-app

- [ ] **Configurar Build Settings**
  - Build command: `npm run build`
  - Publish directory: `dist`
  - Node version: 18

- [ ] **Obtener Site ID**
  - Ir a: Site settings → General
  - Copiar Site ID: `___________________`

- [ ] **Generar Personal Access Token**
  - Ir a: User settings → Applications → Personal access tokens
  - Clic en "New access token"
  - Nombre: "GitHub Actions CI/CD"
  - Copiar token: `___________________` (¡guárdalo, no lo verás de nuevo!)

- [ ] **Configurar Variables de Entorno en Netlify**
  - Ir a: Site settings → Environment variables
  - Añadir todas las variables de Firebase (con prefijo PUBLIC_):
    - `PUBLIC_FIREBASE_API_KEY`
    - `PUBLIC_FIREBASE_AUTH_DOMAIN`
    - `PUBLIC_FIREBASE_PROJECT_ID`
    - `PUBLIC_FIREBASE_STORAGE_BUCKET`
    - `PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
    - `PUBLIC_FIREBASE_APP_ID`

- [ ] **Desactivar Auto-Deploy** (opcional, para controlar desde GitHub)
  - Ir a: Site settings → Build & deploy → Continuous deployment
  - Clic en "Stop builds"
  - Seleccionar "Stop auto-publishing"

---

## 📊 Fase 3: Configuración de Codecov (Opcional)

### Conectar Codecov

- [ ] **Crear Cuenta/Login**
  - Ir a: https://codecov.io/
  - Iniciar sesión con GitHub

- [ ] **Añadir Repositorio**
  - Clic en "Add new repository"
  - Buscar: skincare-app
  - Seleccionar y activar

- [ ] **Obtener Token** (solo si repo es privado)
  - Ir a: Settings del repositorio en Codecov
  - Copiar "Repository Upload Token": `___________________`

- [ ] **Configurar Badge** (opcional)
  - Copiar Markdown del badge
  - Añadir a README.md (ya está en el README actualizado)

---

## 🔐 Fase 4: Configurar Secretos en GitHub

### GitHub Repository Secrets

- [ ] **Ir a Configuración de Secretos**
  - Repositorio en GitHub → Settings
  - Ir a: Secrets and variables → Actions
  - Clic en "New repository secret"

- [ ] **Añadir Secretos de Firebase**
  ```
  Nombre: FIREBASE_API_KEY
  Valor: [tu-api-key]
  ```
  ```
  Nombre: FIREBASE_AUTH_DOMAIN
  Valor: [tu-proyecto.firebaseapp.com]
  ```
  ```
  Nombre: FIREBASE_PROJECT_ID
  Valor: [tu-proyecto-id]
  ```
  ```
  Nombre: FIREBASE_STORAGE_BUCKET
  Valor: [tu-proyecto.appspot.com]
  ```
  ```
  Nombre: FIREBASE_MESSAGING_SENDER_ID
  Valor: [123456789]
  ```
  ```
  Nombre: FIREBASE_APP_ID
  Valor: [1:123456789:web:abc123]
  ```

- [ ] **Añadir Secretos de Netlify**
  ```
  Nombre: NETLIFY_AUTH_TOKEN
  Valor: [token-de-netlify]
  ```
  ```
  Nombre: NETLIFY_SITE_ID
  Valor: [site-id-de-netlify]
  ```

- [ ] **Añadir Secreto de Codecov** (opcional)
  ```
  Nombre: CODECOV_TOKEN
  Valor: [token-de-codecov]
  ```

- [ ] **Verificar Todos los Secretos**
  - Deberías ver 8 secretos (6 Firebase + 2 Netlify)
  - O 9 secretos si añadiste Codecov

---

## 📝 Fase 5: Preparar Código

### Archivo .env Local

- [ ] **Crear archivo .env**
  ```bash
  # En la raíz del proyecto
  touch .env
  ```

- [ ] **Añadir variables de Firebase**
  ```env
  PUBLIC_FIREBASE_API_KEY=tu-api-key
  PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
  PUBLIC_FIREBASE_PROJECT_ID=tu-proyecto-id
  PUBLIC_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
  PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
  PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
  ```

- [ ] **Verificar que .env está en .gitignore**
  ```bash
  # Verificar
  cat .gitignore | grep .env
  ```

### Verificar Workflows

- [ ] **Verificar archivos de workflows**
  ```bash
  ls .github/workflows/
  # Debería mostrar:
  # ci.yml
  # lighthouse.yml
  # security.yml
  ```

- [ ] **Verificar dependabot**
  ```bash
  ls .github/dependabot.yml
  ```

---

## 🚀 Fase 6: Commit y Push

### Preparar Commit

- [ ] **Ver cambios**
  ```bash
  git status
  ```

- [ ] **Añadir archivos**
  ```bash
  git add .github/
  git add GITHUB_SETUP.md
  git add CI_CD_SUMMARY.md
  git add CHECKLIST.md
  git add README.md
  git add tests/
  git add vitest.config.ts
  git add playwright.config.ts
  git add package.json
  git add package-lock.json
  ```

- [ ] **Hacer commit**
  ```bash
  git commit -m "feat: add complete CI/CD pipeline with testing infrastructure

  - Add CI/CD workflow with 7 jobs (lint, test-unit, test-e2e, build, deploy-preview, deploy-production, notify)
  - Add Lighthouse performance auditing workflow
  - Add security scanning workflow (npm audit, CodeQL, dependency review)
  - Add Dependabot configuration for automated updates
  - Add 27 unit tests (streak calculation, data validation)
  - Add E2E tests with Playwright (navigation, accessibility)
  - Add comprehensive documentation (GITHUB_SETUP.md, CI_CD_SUMMARY.md, TESTING.md)
  - Update README.md with badges and documentation
  - Configure Vitest and Playwright
  - Add test scripts to package.json"
  ```

- [ ] **Push a rama develop**
  ```bash
  git push origin develop
  ```

---

## 🧪 Fase 7: Verificación Inicial

### Verificar en GitHub

- [ ] **Ver Actions Tab**
  - Ir a: tu-repo → Actions
  - Verificar que aparecen los workflows:
    - ✅ CI/CD Pipeline
    - ✅ Lighthouse Performance Audit
    - ✅ Security Scan

- [ ] **Ver Primera Ejecución**
  - Debería iniciarse automáticamente al hacer push
  - Ver progreso en tiempo real
  - Verificar que todos los jobs pasan

- [ ] **Revisar Logs si hay Errores**
  - Clic en el workflow fallido
  - Clic en el job con error
  - Revisar logs detallados
  - Corregir errores y hacer nuevo push

---

## 🔬 Fase 8: Pull Request de Prueba

### Crear PR de Prueba

- [ ] **Crear rama de prueba**
  ```bash
  git checkout -b test/verify-ci-pipeline
  ```

- [ ] **Hacer un cambio pequeño**
  ```bash
  echo "# CI/CD Pipeline Test" >> CI_TEST.md
  git add CI_TEST.md
  git commit -m "test: verify complete CI/CD pipeline"
  git push origin test/verify-ci-pipeline
  ```

- [ ] **Crear Pull Request en GitHub**
  - Ir a: tu-repo → Pull requests
  - Clic en "New pull request"
  - Base: develop
  - Compare: test/verify-ci-pipeline
  - Clic en "Create pull request"

### Verificar Checks en el PR

- [ ] **Verificar que aparecen todos los checks**
  - ✅ lint
  - ✅ test-unit
  - ✅ test-e2e
  - ✅ build
  - ✅ deploy-preview
  - ✅ lighthouse
  - ✅ security-scan
  - ✅ codeql

- [ ] **Verificar Netlify Preview**
  - Buscar comentario de Netlify bot en el PR
  - Clic en "Visit Preview"
  - Verificar que la app funciona correctamente

- [ ] **Verificar Lighthouse Report**
  - Ver resultados en el check de Lighthouse
  - Verificar que pasa los umbrales:
    - Performance ≥ 80%
    - Accessibility ≥ 90%
    - Best Practices ≥ 85%
    - SEO ≥ 90%

- [ ] **Verificar Codecov Report**
  - Ver comentario de Codecov bot en el PR
  - Verificar cobertura de código
  - Target: ≥ 80%

---

## ✨ Fase 9: Merge y Deploy a Producción

### Merge del PR

- [ ] **Verificar que todos los checks pasan**
  - Todos los checks en verde ✅

- [ ] **Merge Pull Request**
  - Clic en "Merge pull request"
  - Seleccionar: "Squash and merge" (recomendado)
  - Clic en "Confirm merge"

- [ ] **Eliminar rama de prueba**
  ```bash
  git checkout develop
  git pull origin develop
  git branch -d test/verify-ci-pipeline
  git push origin --delete test/verify-ci-pipeline
  ```

### Deploy a Main/V2

- [ ] **Merge a rama principal**
  ```bash
  git checkout main  # o v2
  git merge develop
  git push origin main  # o v2
  ```

- [ ] **Verificar Deploy a Producción**
  - Ir a: tu-repo → Actions
  - Ver workflow de CI/CD
  - Verificar que el job `deploy-production` se ejecuta
  - Ver URL de producción en Netlify
  - Visitar sitio de producción y verificar funcionamiento

---

## 📊 Fase 10: Monitoreo Continuo

### Configurar Notificaciones

- [ ] **Habilitar notificaciones de GitHub**
  - Watch del repositorio
  - Notificaciones de Actions failures

- [ ] **Configurar alertas en Netlify**
  - Deploy notifications
  - Error tracking

### Revisiones Semanales

- [ ] **Lunes: Revisar Dependabot PRs**
  - Ver PRs automáticos de Dependabot
  - Revisar changelogs
  - Mergear si tests pasan

- [ ] **Revisar Lighthouse Reports**
  - Ver ejecución semanal de Lighthouse
  - Verificar que scores se mantienen
  - Investigar degradaciones

- [ ] **Revisar Security Scans**
  - Ver reporte diario de security
  - Actuar sobre vulnerabilidades encontradas
  - Mantener 0 vulnerabilidades críticas

---

## 🎉 ¡Completado!

Una vez que todas las casillas están marcadas, tu CI/CD está completamente configurado y funcionando. 

### 🎯 Checklist Rápido Final

- [ ] Firebase configurado y funcionando
- [ ] Netlify configurado con preview y producción
- [ ] Todos los secretos de GitHub configurados
- [ ] Workflows ejecutándose sin errores
- [ ] PR de prueba creado y mergeado exitosamente
- [ ] Deploy a producción funcionando
- [ ] Lighthouse scores aceptables
- [ ] Security scans sin vulnerabilidades críticas
- [ ] Codecov reportando cobertura
- [ ] Dependabot activo y funcionando

### 📈 Métricas Objetivo

- ✅ Tests: 100% passing
- ✅ Cobertura: ≥ 80%
- ✅ Performance: ≥ 80%
- ✅ Accessibility: ≥ 90%
- ✅ Best Practices: ≥ 85%
- ✅ SEO: ≥ 90%
- ✅ Vulnerabilidades: 0 críticas

---

**¡Felicidades! Tu pipeline de CI/CD está listo para producción.** 🚀

**Próximo paso**: Continuar con las siguientes funcionalidades del IMPLEMENTATION_PLAN.md:
- Sistema de recordatorios mejorado
- Sistema de logros dinámico
- Animaciones móviles
