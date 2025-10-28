# 🔥 Configuración de Firebase

## 📝 Pasos para Configurar

### 1. Edita el archivo `.env`

Abre el archivo `.env` en la raíz del proyecto y reemplaza los valores con tus credenciales de Firebase:

```env
FIREBASE_API_KEY=tu-api-key-aqui
FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
FIREBASE_PROJECT_ID=tu-project-id
FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
FIREBASE_MESSAGING_SENDER_ID=tu-sender-id
FIREBASE_APP_ID=tu-app-id
FIREBASE_MEASUREMENT_ID=tu-measurement-id
```

### 2. Configurar Firestore Database

1. Ve a Firebase Console: https://console.firebase.google.com
2. Selecciona tu proyecto
3. Ve a **Firestore Database**
4. Si no está creado, clic en **Crear base de datos**
5. Elige **modo de producción** o **modo de prueba** según prefieras
6. Selecciona la ubicación más cercana (ej: europe-west1)

### 3. Configurar Reglas de Seguridad

Para empezar, usa estas reglas básicas (luego puedes añadir autenticación):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /routines/{userId} {
      allow read, write: if true; // TEMPORAL - Cambia esto después
    }
  }
}
```

⚠️ **IMPORTANTE**: Estas reglas permiten acceso a todos. Para producción, añade autenticación.

### 4. Iniciar la Aplicación

```powershell
npm run dev
```

## 🎯 Cómo Funciona

- Todas las rutinas se guardan en Firestore en la colección `routines`
- El documento se identifica por `USER_ID` (por defecto: 'default_user')
- Los cambios se sincronizan automáticamente con Firebase
- Si no hay conexión, se usan las rutinas hardcoded como fallback

## 🔒 Seguridad (Opcional - para después)

Para añadir autenticación de usuario:

1. En Firebase Console > Authentication
2. Habilita Email/Password o Google Sign-In
3. Actualiza `src/utils/firebase.ts` para usar el UID real del usuario
4. Actualiza las reglas de Firestore:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /routines/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 📱 Optimizaciones Móviles Incluidas

- Selector de días con esferas táctiles más grandes
- Formularios optimizados (font-size 16px para evitar zoom en iOS)
- Botones más espaciados para mejor touch
- Modal responsive que se adapta a pantallas pequeñas

## ✅ Todo Listo

Ahora puedes:
- ✅ Crear productos desde el editor
- ✅ Ver tus rutinas en cualquier dispositivo
- ✅ Los datos persisten en Firebase
- ✅ Selector de días mejorado con esferas
