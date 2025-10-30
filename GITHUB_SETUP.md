# Configuración GitHub CI/CD

Este documento explica cómo configurar todos los workflows y secretos necesarios en GitHub para que el proyecto funcione correctamente.

## 📋 Índice

1. [Secretos de GitHub](#-secretos-de-github)
2. [Configuración de Netlify](#-configuración-de-netlify)
3. [Configuración de Firebase](#-configuración-de-firebase)
4. [Configuración de Codecov](#-configuración-de-codecov)
5. [Variables de Entorno](#-variables-de-entorno)
6. [Verificación de Workflows](#-verificación-de-workflows)

---

## 🔐 Secretos de GitHub

Ve a **Settings → Secrets and variables → Actions** y añade los siguientes secretos:

### Firebase (Obligatorios)

```
FIREBASE_API_KEY: Tu API Key de Firebase
FIREBASE_AUTH_DOMAIN: proyecto-id.firebaseapp.com
FIREBASE_PROJECT_ID: proyecto-id
FIREBASE_STORAGE_BUCKET: proyecto-id.appspot.com
FIREBASE_MESSAGING_SENDER_ID: 123456789
FIREBASE_APP_ID: 1:123456789:web:abcdef123456
```

**Cómo obtenerlos:**
1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️)
4. En la sección **Your apps**, selecciona tu app web
5. Copia los valores de `firebaseConfig`

### Netlify (Obligatorios para Deploy)

```
NETLIFY_AUTH_TOKEN: Token personal de Netlify
NETLIFY_SITE_ID: ID del sitio en Netlify
```

**Cómo obtenerlos:**

#### NETLIFY_AUTH_TOKEN
1. Ve a [Netlify](https://app.netlify.com/)
2. Haz clic en tu avatar → **User settings**
3. Ve a **Applications** → **Personal access tokens**
4. Clic en **New access token**
5. Dale un nombre descriptivo (ej: "GitHub Actions CI/CD")
6. Copia el token generado

#### NETLIFY_SITE_ID
1. Ve a tu sitio en Netlify
2. Ve a **Site settings** → **General**
3. Copia el **Site ID** (ej: `abc123-456def-789ghi`)

### Codecov (Opcional)

```
CODECOV_TOKEN: Token de Codecov para reportes de cobertura
```

**Cómo obtenerlo:**
1. Ve a [Codecov](https://codecov.io/)
2. Conecta tu repositorio de GitHub
3. Ve a **Settings** del repositorio
4. Copia el **Repository Upload Token**

> **Nota:** Codecov funciona sin token para repositorios públicos, pero se recomienda para privados.

---

## 🌐 Configuración de Netlify

### 1. Crear Sitio

1. Ve a [Netlify](https://app.netlify.com/)
2. Clic en **Add new site** → **Import an existing project**
3. Selecciona GitHub y autoriza
4. Selecciona tu repositorio `skincare-app`

### 2. Configurar Build Settings

En **Site settings → Build & deploy → Build settings**:

```
Build command: npm run build
Publish directory: dist
```

### 3. Variables de Entorno en Netlify

En **Site settings → Environment variables**, añade:

```
PUBLIC_FIREBASE_API_KEY
PUBLIC_FIREBASE_AUTH_DOMAIN
PUBLIC_FIREBASE_PROJECT_ID
PUBLIC_FIREBASE_STORAGE_BUCKET
PUBLIC_FIREBASE_MESSAGING_SENDER_ID
PUBLIC_FIREBASE_APP_ID
```

> **Importante:** Netlify necesita las mismas variables de Firebase que GitHub Actions.

### 4. Desactivar Auto-Deploy

Para que solo se despliegue desde GitHub Actions:

1. Ve a **Site settings → Build & deploy → Continuous deployment**
2. En **Build settings**, clic en **Stop builds**
3. Selecciona **Stop auto-publishing**

---

## 🔥 Configuración de Firebase

### 1. Habilitar Servicios

En [Firebase Console](https://console.firebase.google.com/):

#### Authentication
1. Ve a **Authentication** → **Sign-in method**
2. Habilita **Email/Password**
3. Habilita **Google** (opcional pero recomendado)

#### Firestore Database
1. Ve a **Firestore Database** → **Create database**
2. Selecciona **Start in production mode**
3. Elige la región más cercana (ej: `europe-west1`)

#### Storage
1. Ve a **Storage** → **Get started**
2. Usa las reglas por defecto (las personalizaremos después)

### 2. Configurar Security Rules

Aplica las reglas de seguridad del archivo `FIREBASE_RULES.md`:

```bash
# Firestore
firebase deploy --only firestore:rules

# Storage
firebase deploy --only storage:rules
```

### 3. Configurar Dominios Autorizados

En **Authentication → Settings → Authorized domains**:

Añade:
- `localhost`
- Tu dominio de Netlify: `tu-sitio.netlify.app`
- Tu dominio personalizado (si lo tienes)

---

## 📊 Configuración de Codecov

### 1. Conectar Repositorio

1. Ve a [Codecov](https://codecov.io/)
2. Inicia sesión con GitHub
3. Clic en **Add new repository**
4. Selecciona `skincare-app`

### 2. Configurar Badge

Añade el badge de cobertura a tu `README.md`:

```markdown
[![codecov](https://codecov.io/gh/USUARIO/skincare-app/branch/main/graph/badge.svg)](https://codecov.io/gh/USUARIO/skincare-app)
```

### 3. Configurar Umbrales (Opcional)

Crea un archivo `codecov.yml` en la raíz del proyecto:

```yaml
coverage:
  status:
    project:
      default:
        target: 80%
        threshold: 5%
    patch:
      default:
        target: 70%
```

---

## 🌍 Variables de Entorno

### Variables Públicas (Prefijo PUBLIC_)

Estas son seguras de exponer en el cliente:

```env
PUBLIC_FIREBASE_API_KEY=AIza...
PUBLIC_FIREBASE_AUTH_DOMAIN=proyecto.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=proyecto-id
PUBLIC_FIREBASE_STORAGE_BUCKET=proyecto.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Variables Privadas (Solo en GitHub/Netlify)

Estas **NUNCA** deben exponerse en el cliente:

```env
NETLIFY_AUTH_TOKEN=secret_token_here
NETLIFY_SITE_ID=abc123-456def
CODECOV_TOKEN=token_here
```

---

## ✅ Verificación de Workflows

### 1. Verificar que los archivos existen

```bash
ls .github/workflows/
```

Deberías ver:
- `ci.yml` - Pipeline principal de CI/CD
- `lighthouse.yml` - Auditoría de performance
- `security.yml` - Escaneo de seguridad

### 2. Verificar Sintaxis

```bash
# Usar GitHub CLI (opcional)
gh workflow list
gh workflow view ci
```

### 3. Commit y Push

```bash
git add .github/
git commit -m "feat: add GitHub Actions workflows for CI/CD, performance, and security"
git push origin develop
```

### 4. Verificar Ejecución

1. Ve a tu repositorio en GitHub
2. Haz clic en la pestaña **Actions**
3. Verás los workflows ejecutándose:
   - ✅ CI/CD Pipeline
   - ✅ Lighthouse Performance Audit
   - ✅ Security Scan

### 5. Crear un Pull Request de Prueba

```bash
git checkout -b test/ci-pipeline
echo "# Test CI" >> TEST.md
git add TEST.md
git commit -m "test: verify CI pipeline"
git push origin test/ci-pipeline
```

Luego crea un PR en GitHub y verifica:
- ✅ Todos los checks pasan
- ✅ Se crea un preview deployment en Netlify
- ✅ Lighthouse ejecuta auditoría
- ✅ Security scan completa
- ✅ Codecov reporta cobertura

---

## 🔧 Troubleshooting

### Error: "Secret not found"

**Solución:** Verifica que has añadido todos los secretos en GitHub Settings → Secrets and variables → Actions.

### Error: "Netlify deploy failed"

**Solución:** 
1. Verifica que `NETLIFY_AUTH_TOKEN` y `NETLIFY_SITE_ID` son correctos
2. Verifica que el sitio existe en Netlify
3. Verifica que el token tiene permisos suficientes

### Error: "Firebase configuration invalid"

**Solución:**
1. Verifica que todos los secretos de Firebase están configurados
2. Verifica que no hay espacios extra o caracteres especiales
3. Verifica que el proyecto de Firebase existe y está activo

### Error: "Tests failing in CI but passing locally"

**Solución:**
1. Asegúrate de que todas las dependencias están en `package.json`
2. Verifica que no hay dependencias de variables de entorno no configuradas
3. Ejecuta `npm ci` localmente para simular instalación limpia

### Error: "Lighthouse scores too low"

**Solución:**
1. Revisa el reporte de Lighthouse (artifacts en GitHub Actions)
2. Optimiza imágenes y assets
3. Revisa las recomendaciones específicas en el reporte
4. Ajusta los umbrales en `lighthouse.yml` si es necesario

---

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Netlify Deploy Documentation](https://docs.netlify.com/)
- [Firebase Setup Guide](https://firebase.google.com/docs/web/setup)
- [Codecov Documentation](https://docs.codecov.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

---

## 🎯 Checklist Final

Antes de marcar como completo, verifica:

- [ ] Todos los secretos de GitHub configurados
- [ ] Sitio de Netlify creado y configurado
- [ ] Variables de entorno de Netlify configuradas
- [ ] Firebase Authentication habilitado
- [ ] Firestore Database creado
- [ ] Security rules desplegadas
- [ ] Codecov conectado (opcional)
- [ ] Workflows commiteados y pusheados
- [ ] Al menos un workflow ejecutado exitosamente
- [ ] PR de prueba creado y verificado
- [ ] Preview deployment funcionando
- [ ] Lighthouse audit completada
- [ ] Security scan completado

Una vez completado todo, ¡tu CI/CD está listo! 🚀
