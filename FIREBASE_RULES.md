# 🔐 Reglas de Firebase para Skincare App

## Reglas de Firestore

Copia estas reglas en la consola de Firebase (Firestore Database → Rules):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    
    // Función auxiliar: verificar que el usuario está autenticado
    function isAuthenticated() {
      return request.auth != null;
    }
    
    // Función auxiliar: verificar que el usuario es el propietario del documento
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Colección: routines (rutinas de skincare por usuario)
    // Cada usuario solo puede leer/escribir sus propias rutinas
    match /routines/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Colección: progress (seguimiento y rachas por usuario)
    // Cada usuario solo puede leer/escribir su propio progreso
    match /progress/{userId} {
      allow read, write: if isOwner(userId);
    }
    
    // Denegar acceso a cualquier otra colección no especificada
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

## Explicación de las Reglas

### 1. **Colección `routines`**
- **Ruta**: `/routines/{userId}`
- **Acceso**: Solo el usuario propietario (`userId == auth.uid`)
- **Operaciones**: Lectura y escritura completa
- **Contenido**: Rutinas diarias y nocturnas (productos, pasos, configuración)

### 2. **Colección `progress`** ✨ **NUEVA**
- **Ruta**: `/progress/{userId}`
- **Acceso**: Solo el usuario propietario (`userId == auth.uid`)
- **Operaciones**: Lectura y escritura completa
- **Contenido**:
  - `currentStreak`: Racha actual (días consecutivos)
  - `longestStreak`: Récord personal de racha
  - `totalCompletions`: Total de rutinas completadas
  - `lastCompletedDate`: Última fecha de completado
  - `completions`: Objeto con fechas y completados por día/noche

### 3. **Seguridad**
- ✅ Los usuarios **solo** pueden ver y modificar sus propios datos
- ✅ Los usuarios anónimos también tienen su propio espacio aislado
- ❌ Nadie puede acceder a datos de otros usuarios
- ❌ Sin autenticación no se puede acceder a nada

## Cómo Aplicar las Reglas

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Selecciona tu proyecto
3. En el menú lateral: **Firestore Database** → **Reglas**
4. Reemplaza el contenido con las reglas de arriba
5. Click en **Publicar**

## Estructura de Datos en Firestore

```
firestore/
├── routines/
│   └── {userId}/
│       ├── dailyRoutine: Product[]
│       ├── nightlyRoutines: { [day: string]: Product[] }
│       └── lastUpdated: number
│
└── progress/          ← NUEVA COLECCIÓN
    └── {userId}/
        ├── currentStreak: number
        ├── longestStreak: number
        ├── totalCompletions: number
        ├── lastCompletedDate: string (YYYY-MM-DD)
        └── completions: {
            "2025-10-29": {
              morning: { completed: true, timestamp: 1234567890 },
              night: { completed: true, timestamp: 1234567891 }
            },
            "2025-10-28": { ... }
          }
```

## Testing de Reglas (Opcional)

Puedes probar las reglas en Firebase Console → Firestore → Reglas → **Simulador de reglas**:

### Test 1: Usuario puede leer sus propias rutinas
```
Operación: get
Ruta: /routines/USER_ID_123
Auth: { uid: "USER_ID_123" }
Resultado esperado: ✅ Permitido
```

### Test 2: Usuario NO puede leer rutinas de otro
```
Operación: get
Ruta: /routines/USER_ID_456
Auth: { uid: "USER_ID_123" }
Resultado esperado: ❌ Denegado
```

### Test 3: Usuario puede escribir su progreso
```
Operación: create
Ruta: /progress/USER_ID_123
Auth: { uid: "USER_ID_123" }
Resultado esperado: ✅ Permitido
```

## ⚠️ Importante

- **Aplica estas reglas ANTES de usar la app en producción**
- Las reglas actuales protegen la privacidad de cada usuario
- Si necesitas agregar más colecciones en el futuro, añade reglas similares
- Revisa periódicamente los logs de Firebase para detectar intentos de acceso no autorizado

## 🚀 Próximas Fases

Para las próximas fases del sistema de seguimiento **NO necesitas cambiar las reglas**. La colección `progress` ya cubre:
- ✅ Fase 1: Botón de completar y racha básica (implementada)
- ✅ Fase 2: Lógica de rachas (implementada)
- ✅ Fase 3: Página de estadísticas (usará los mismos datos)
- ✅ Fase 4: Notificaciones (no requiere Firestore adicional)
