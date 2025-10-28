# 🔥 Configuración de Firebase

## 📋 Pasos para Configurar Firebase

### 1. Variables de Entorno
Ya están configuradas en el archivo `.env`. Asegúrate de que tiene este formato:

```env
PUBLIC_FIREBASE_API_KEY=tu_api_key
PUBLIC_FIREBASE_AUTH_DOMAIN=tu_project.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
PUBLIC_FIREBASE_STORAGE_BUCKET=tu_project.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_sender_id
PUBLIC_FIREBASE_APP_ID=tu_app_id
```

⚠️ **IMPORTANTE**: El prefijo `PUBLIC_` es necesario para que Astro exponga las variables al cliente.

---

### 2. Habilitar Métodos de Autenticación en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral, ve a **Authentication** (🔐 Autenticación)
4. Ve a la pestaña **Sign-in method** (Método de inicio de sesión)
5. Habilita los siguientes proveedores:

#### ✅ Email/Password (Correo/Contraseña)
- Click en "Email/Password"
- Activa el primer toggle (Email/Password)
- NO necesitas activar "Email link (passwordless sign-in)"
- Guardar

#### ✅ Google
- Click en "Google"
- Activa el toggle
- Selecciona un email de soporte (tu email de proyecto)
- Guardar

#### ✅ Anonymous (Anónimo)
- Click en "Anonymous"
- Activa el toggle
- Guardar

---

### 3. Configurar Firestore Database

1. En el menú lateral de Firebase Console, ve a **Firestore Database**
2. Si no lo has creado, click en "Create database"
3. Selecciona **Start in production mode** (por seguridad)
4. Elige la región más cercana a tus usuarios (ejemplo: `europe-west`)

---

### 4. Configurar Reglas de Seguridad de Firestore

⚠️ **MUY IMPORTANTE**: Las reglas de seguridad protegen tus datos.

1. En Firestore Database, ve a la pestaña **Rules** (Reglas)
2. Reemplaza el contenido con estas reglas:

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regla para la colección de rutinas
    match /routines/{userId} {
      // Solo el usuario autenticado puede leer/escribir sus propios datos
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Denegar acceso a todo lo demás por defecto
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

3. Click en **Publish** (Publicar)

**Explicación de las reglas:**
- `request.auth != null`: Verifica que el usuario esté autenticado
- `request.auth.uid == userId`: Verifica que el UID del usuario coincida con el ID del documento
- Cada usuario solo puede acceder a su propio documento en `/routines/{userId}`

---

### 5. Reiniciar el Servidor de Desarrollo

Después de configurar Firebase, **DEBES reiniciar el servidor** para que cargue las nuevas variables de entorno:

```powershell
# Detener el servidor (Ctrl+C en la terminal)
# Luego ejecutar:
npm run dev
```

---

## 🧪 Probar la Autenticación

### Test 1: Registro con Email
1. Abre la app en el navegador
2. Deberías ver el modal de autenticación
3. Ve a la pestaña "Registrarse"
4. Ingresa un email y contraseña (mínimo 6 caracteres)
5. Click en "Crear Cuenta"
6. ✅ Deberías ver tu email en la parte inferior del modal

### Test 2: Login con Google
1. Click en el botón "Google"
2. Selecciona tu cuenta de Google en el popup
3. ✅ Deberías ver tu email en la parte inferior del modal

### Test 3: Modo Anónimo
1. Click en "🕶️ Modo Anónimo"
2. ✅ Deberías ver "Usuario Anónimo" en la parte inferior

### Test 4: Importar Rutinas Hardcodeadas
1. Después de autenticarte (cualquier método)
2. Click en "📦 Importar Rutinas Predeterminadas"
3. Confirma la acción
4. ✅ La página se recargará con las rutinas importadas

### Test 5: Editar Rutinas
1. Ve a la vista "Rutinas" en el navegador inferior
2. Deberías ver la interfaz del editor
3. Añade un producto, guárdalo
4. ✅ Los cambios se guardan en Firebase automáticamente

### Test 6: Cerrar Sesión
1. Click en "Cerrar Sesión" en el modal de autenticación
2. ✅ Volverás a la pantalla de login
3. Las rutinas ya no serán visibles hasta que inicies sesión de nuevo

---

## 🐛 Solución de Problemas

### Error: "projectId undefined"
**Causa**: Las variables de entorno no tienen el prefijo `PUBLIC_`
**Solución**: Verifica que TODAS las variables en `.env` empiecen con `PUBLIC_FIREBASE_`

### Error: "Auth operation not allowed"
**Causa**: No has habilitado el método de autenticación en Firebase Console
**Solución**: Ve a Authentication > Sign-in method y habilita el método que quieres usar

### Error: "Missing or insufficient permissions"
**Causa**: Las reglas de Firestore no permiten el acceso
**Solución**: Copia las reglas de seguridad del paso 4 y publícalas en Firestore

### Los cambios no se reflejan
**Causa**: No reiniciaste el servidor después de cambiar `.env`
**Solución**: Detén el servidor (Ctrl+C) y ejecuta `npm run dev` de nuevo

### No puedo iniciar sesión con Google
**Causa**: El dominio no está autorizado en Firebase
**Solución**: Ve a Authentication > Settings > Authorized domains y añade `localhost`

---

## 📊 Verificar en Firebase Console

Después de usar la app, puedes verificar que todo funciona:

1. **Authentication**:
   - Ve a Authentication > Users
   - Deberías ver los usuarios que has creado

2. **Firestore**:
   - Ve a Firestore Database > Data
   - Deberías ver una colección `routines`
   - Cada documento tiene el UID del usuario como ID
   - Al expandir el documento, verás `dailyRoutine` y `nightlyRoutines`

---

## 🔒 Seguridad

### Buenas Prácticas Implementadas:
✅ Variables de entorno para credenciales
✅ Reglas de Firestore que requieren autenticación
✅ Cada usuario solo puede acceder a sus propios datos
✅ Los datos no se comparten entre usuarios

### NO Hagas Esto:
❌ No subas el archivo `.env` a Git
❌ No uses reglas de Firestore en modo "test" (allow read, write: if true) en producción
❌ No compartas tus credenciales de Firebase públicamente

---

## 📝 Estructura de Datos en Firestore

```
routines (colección)
  └── {userId} (documento - UID del usuario)
      ├── dailyRoutine (array)
      │   └── [
      │       {
      │         accessCode: string,
      │         image: string,
      │         step: number,
      │         enabled: boolean
      │       }
      │     ]
      └── nightlyRoutines (objeto)
          ├── lunes (array)
          ├── martes (array)
          ├── miércoles (array)
          ├── jueves (array)
          ├── viernes (array)
          ├── sábado (array)
          └── domingo (array)
```

Cada día contiene un array de productos con la misma estructura que `dailyRoutine`.

---

## 🚀 ¡Listo!

Si has seguido todos los pasos:
1. ✅ Firebase está configurado
2. ✅ La autenticación funciona
3. ✅ Los datos se guardan de forma segura
4. ✅ Cada usuario tiene sus propias rutinas
5. ✅ Puedes importar las rutinas predeterminadas

**Disfruta tu app de skincare! 💙**
