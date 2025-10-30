# 🔧 Fix: Firebase Invalid API Key Error

## Error Encontrado
```
Firebase: Error (auth/invalid-api-key)
```

## Causa
Las variables de entorno de Firebase no se estaban pasando correctamente a todos los pasos del CI/CD, especialmente al servidor de preview y tests E2E.

## Soluciones Aplicadas

### 1. Variables de entorno añadidas a más steps

#### `.github/workflows/ci.yml`
- ✅ Añadidas variables Firebase al step `🎭 Run E2E tests`

#### `.github/workflows/lighthouse.yml`
- ✅ Añadidas variables Firebase al step `🚀 Start server`

#### `src/utils/firebase.ts`
- ✅ Añadidos valores por defecto (`|| ''`) para evitar `undefined`
- ✅ Añadida validación con mensaje de error claro

### 2. Verificar Secretos en GitHub

Ve a tu repositorio en GitHub y verifica que TODOS estos secretos estén configurados:

**Ruta**: `Settings` → `Secrets and variables` → `Actions` → `Repository secrets`

Deben existir estos 6 secretos (sin el prefijo PUBLIC_):

```
✅ FIREBASE_API_KEY
✅ FIREBASE_AUTH_DOMAIN
✅ FIREBASE_PROJECT_ID
✅ FIREBASE_STORAGE_BUCKET
✅ FIREBASE_MESSAGING_SENDER_ID
✅ FIREBASE_APP_ID
```

**IMPORTANTE**: Los secretos en GitHub Actions NO llevan el prefijo `PUBLIC_`, pero al pasarlos como variables de entorno SÍ se les añade:

```yaml
env:
  PUBLIC_FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
  #    ↑ prefijo PUBLIC_       ↑ sin prefijo en secret
```

### 3. Verificar Valores de los Secretos

Los valores deben verse así (ejemplo):

```
FIREBASE_API_KEY=AIzaSyB1234567890abcdefghijklmnopqrstu
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-proyecto-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=123456789012
FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

**Errores comunes**:
- ❌ API Key vacía o con espacios extras
- ❌ API Key incorrecta o de otro proyecto
- ❌ Copiar el valor con comillas `"` al principio/final
- ❌ Project ID incorrecto

### 4. Cómo Obtener los Valores Correctos

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. Ve a **Project Settings** (⚙️ arriba a la izquierda)
4. Baja hasta **Your apps** → selecciona tu Web App
5. Copia los valores de `firebaseConfig`:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",              // ← FIREBASE_API_KEY
  authDomain: "proyecto.firebaseapp.com", // ← FIREBASE_AUTH_DOMAIN
  projectId: "proyecto-id",       // ← FIREBASE_PROJECT_ID
  storageBucket: "proyecto.appspot.com", // ← FIREBASE_STORAGE_BUCKET
  messagingSenderId: "123456",    // ← FIREBASE_MESSAGING_SENDER_ID
  appId: "1:123456:web:abc123"    // ← FIREBASE_APP_ID
};
```

### 5. Verificación Manual

Puedes verificar localmente que los valores son correctos:

```bash
# Crear archivo .env temporal (NO subir a git)
echo PUBLIC_FIREBASE_API_KEY=AIza... > .env
echo PUBLIC_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com >> .env
# ... etc

# Probar build local
npm run build

# Si el build pasa, los valores son correctos
```

### 6. Verificar en GitHub Actions

Después de actualizar los secretos:

1. Ve a: https://github.com/ikeralvis/skincare-app/actions
2. Clic en el workflow que falló
3. Clic en "Re-run all jobs" (arriba a la derecha)
4. Verifica que ya no aparece el error `invalid-api-key`

---

## Checklist de Verificación

- [ ] Todos los 6 secretos están configurados en GitHub
- [ ] Los valores no tienen espacios al inicio/final
- [ ] Los valores coinciden con Firebase Console
- [ ] El API Key es válido y del proyecto correcto
- [ ] Se hizo commit y push de los cambios en workflows
- [ ] Se re-ejecutó el workflow en GitHub Actions
- [ ] El error `invalid-api-key` ya no aparece

---

## Si el Error Persiste

### Opción 1: Verificar que el API Key es válido

Prueba hacer una request simple:
```bash
curl "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=TU_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"returnSecureToken":true}'
```

Si devuelve `"error": { "code": 400, "message": "API key not valid" }`, entonces el API Key está mal.

### Opción 2: Regenerar API Key

1. Ve a Firebase Console → Project Settings
2. Baja hasta **Web API Key**
3. Copia el nuevo valor
4. Actualiza el secreto `FIREBASE_API_KEY` en GitHub

### Opción 3: Verificar restricciones del API Key

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Selecciona tu proyecto de Firebase
3. Ve a **APIs & Services** → **Credentials**
4. Encuentra tu Browser Key (API key)
5. Verifica que:
   - No tenga restricciones de IP
   - Tenga las APIs necesarias habilitadas (Identity Toolkit API)
   - No esté restringido a dominios específicos

---

## Cambios Realizados

```bash
# Archivos modificados
.github/workflows/ci.yml          # Añadidas env vars a E2E tests
.github/workflows/lighthouse.yml   # Añadidas env vars a preview server
src/utils/firebase.ts              # Añadida validación y defaults
```

Hacer commit y push:
```bash
git add .
git commit -m "fix: add Firebase env vars to all CI steps and add validation"
git push origin v2
```
