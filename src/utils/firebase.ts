// src/utils/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signInAnonymously,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import type { RoutineData, Product } from '../types/routine';

// Configuración de Firebase desde variables de entorno
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '',
};

// Validar configuración de Firebase
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('⚠️ Firebase config is missing! Please set environment variables.');
  console.error('Required: PUBLIC_FIREBASE_API_KEY, PUBLIC_FIREBASE_PROJECT_ID');
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Usuario actual
let currentUser: User | null = null;

// Listener de cambios de autenticación
onAuthStateChanged(auth, (user) => {
  currentUser = user;
  console.log('Estado de autenticación:', user ? `Usuario: ${user.email || 'Anónimo'}` : 'No autenticado');
});

// ==================== AUTENTICACIÓN ====================

// Registrar con email y contraseña
export async function signUpWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error en registro:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Iniciar sesión con email y contraseña
export async function signInWithEmail(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error en login:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Iniciar sesión con Google
export async function signInWithGoogle(): Promise<User> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Error en login con Google:', error);
    throw new Error(getAuthErrorMessage(error.code));
  }
}

// Iniciar sesión anónimamente
export async function signInAnonymous(): Promise<User> {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error: any) {
    console.error('Error en login anónimo:', error);
    throw new Error('Error al iniciar sesión anónimamente');
  }
}

// Cerrar sesión
export async function signOut(): Promise<void> {
  try {
    await auth.signOut();
  } catch (error) {
    console.error('Error cerrando sesión:', error);
    throw error;
  }
}

// Obtener usuario actual
export function getCurrentUser(): User | null {
  return currentUser || auth.currentUser;
}

// Esperar a que se inicialice la autenticación
export function waitForAuth(): Promise<User | null> {
  return new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });
}

// Mensajes de error amigables
function getAuthErrorMessage(code: string): string {
  const messages: { [key: string]: string } = {
    'auth/email-already-in-use': 'Este email ya está registrado',
    'auth/invalid-email': 'Email inválido',
    'auth/operation-not-allowed': 'Operación no permitida',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
    'auth/user-disabled': 'Usuario deshabilitado',
    'auth/user-not-found': 'Usuario no encontrado',
    'auth/wrong-password': 'Contraseña incorrecta',
    'auth/popup-closed-by-user': 'Ventana cerrada por el usuario',
    'auth/cancelled-popup-request': 'Solicitud cancelada',
  };
  return messages[code] || 'Error de autenticación';
}

// ==================== RUTINAS ====================

// Función para obtener rutinas desde Firebase
export async function getRoutines(): Promise<RoutineData | null> {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('No hay usuario autenticado');
      return null;
    }

    const docRef = doc(db, 'routines', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as RoutineData;
    } else {
      console.log('No hay rutinas guardadas en Firebase para este usuario');
      return null;
    }
  } catch (error) {
    console.error('Error obteniendo rutinas de Firebase:', error);
    return null;
  }
}

// Función para verificar si el usuario tiene datos y auto-importar si no
export async function checkAndAutoImportRoutines(): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('No hay usuario para auto-importar');
      return;
    }

    const docRef = doc(db, 'routines', user.uid);
    const docSnap = await getDoc(docRef);
    
    // Si NO tiene datos, auto-importar los hardcodeados
    if (!docSnap.exists()) {
      console.log('🔄 Primera vez del usuario, importando rutinas predeterminadas...');
      await migrateHardcodedRoutines();
      console.log('✅ Rutinas predeterminadas importadas automáticamente');
    } else {
      console.log('✅ El usuario ya tiene rutinas guardadas');
    }
  } catch (error) {
    console.error('Error en auto-importación:', error);
  }
}

// Función para guardar rutinas en Firebase
export async function saveRoutines(data: RoutineData): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión para guardar rutinas');
    }

    data.lastUpdated = Date.now();
    const docRef = doc(db, 'routines', user.uid);
    await setDoc(docRef, data);
    console.log('✅ Rutinas guardadas en Firebase');
  } catch (error) {
    console.error('❌ Error guardando rutinas en Firebase:', error);
    throw error;
  }
}

// Función para crear rutina inicial vacía
export function createEmptyRoutineData(): RoutineData {
  return {
    dailyRoutine: [],
    nightlyRoutines: {
      'Lunes': [],
      'Martes': [],
      'Miércoles': [],
      'Jueves': [],
      'Viernes': [],
      'Sábado': [],
      'Domingo': [],
    },
    lastUpdated: Date.now(),
  };
}

// Función para migrar rutinas hardcoded (solo si el usuario está autenticado)
export async function migrateHardcodedRoutines(): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión para importar rutinas');
    }

    // Verificar si ya tiene rutinas
    const existingRoutines = await getRoutines();
    if (existingRoutines && (existingRoutines.dailyRoutine.length > 0 || 
        Object.values(existingRoutines.nightlyRoutines).some(arr => arr.length > 0))) {
      throw new Error('Ya tienes rutinas guardadas. Elimínalas primero si quieres importar las predeterminadas.');
    }

    // Importar las rutinas hardcoded
    const { dailyRoutine, nightlyRoutineWithLactic, nightlyRoutineWithoutLactic } = await import('../data/routines');

    // Convertir al formato Product la rutina diurna
    const dailyProducts: Product[] = dailyRoutine.map((product: any, index: number) => ({
      id: `day-${index}-${Date.now()}`,
      step: product.step,
      title: product.title,
      accessCode: product.accessCode,
      function: product.function,
      usage: product.usage,
      image: product.image,
      routineType: 'day' as const,
      frequency: 'daily' as const,
      enabled: true,
    }));

    // Rutinas nocturnas: usar "con láctico" algunos días y "sin láctico" el resto
    const withLactic = nightlyRoutineWithLactic.map((p: any, index: number) => ({
      id: `night-with-${index}-${Date.now()}`,
      step: p.step,
      title: p.title,
      accessCode: p.accessCode,
      function: p.function,
      usage: p.usage,
      image: p.image,
      routineType: 'night' as const,
      frequency: 'custom' as const,
      enabled: true,
    }));
    const withoutLactic = nightlyRoutineWithoutLactic.map((p: any, index: number) => ({
      id: `night-without-${index}-${Date.now()}`,
      step: p.step,
      title: p.title,
      accessCode: p.accessCode,
      function: p.function,
      usage: p.usage,
      image: p.image,
      routineType: 'night' as const,
      frequency: 'custom' as const,
      enabled: true,
    }));

    // Asignación por defecto:
    // - Con láctico: Miércoles y Domingo
    // - Sin láctico: Lunes, Martes, Jueves, Viernes, Sábado
    const nightlyRoutines: { [day: string]: Product[] } = {};
    nightlyRoutines['Lunes'] = withoutLactic.map((p, i) => ({ ...p, id: `night-Lunes-${i}-${Date.now()}` }));
    nightlyRoutines['Martes'] = withoutLactic.map((p, i) => ({ ...p, id: `night-Martes-${i}-${Date.now()}` }));
    nightlyRoutines['Miércoles'] = withLactic.map((p, i) => ({ ...p, id: `night-Miércoles-${i}-${Date.now()}` }));
    nightlyRoutines['Jueves'] = withoutLactic.map((p, i) => ({ ...p, id: `night-Jueves-${i}-${Date.now()}` }));
    nightlyRoutines['Viernes'] = withoutLactic.map((p, i) => ({ ...p, id: `night-Viernes-${i}-${Date.now()}` }));
    nightlyRoutines['Sábado'] = withoutLactic.map((p, i) => ({ ...p, id: `night-Sábado-${i}-${Date.now()}` }));
    nightlyRoutines['Domingo'] = withLactic.map((p, i) => ({ ...p, id: `night-Domingo-${i}-${Date.now()}` }));

    const data: RoutineData = {
      dailyRoutine: dailyProducts,
      nightlyRoutines,
      lastUpdated: Date.now(),
    };

    await saveRoutines(data);
    console.log('✅ Rutinas hardcoded migradas correctamente - TODOS los productos cargados');
  } catch (error) {
    console.error('Error migrando rutinas:', error);
    throw error;
  }
}

// ==================== SEGUIMIENTO Y RACHAS ====================

export interface CompletionRecord {
  completed: boolean;
  timestamp: number;
}

export interface DayCompletions {
  morning?: CompletionRecord;
  night?: CompletionRecord;
}

export interface ProgressData {
  currentStreak: number;
  longestStreak: number;
  totalCompletions: number;
  lastCompletedDate: string;
  completions: { [date: string]: DayCompletions };
}

// Obtener datos de progreso del usuario
export async function getProgressData(): Promise<ProgressData | null> {
  try {
    const user = getCurrentUser();
    if (!user) {
      console.log('No hay usuario autenticado para obtener progreso');
      return null;
    }

    const docRef = doc(db, 'progress', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data() as ProgressData;
    } else {
      // Crear doc inicial si no existe
      const initialData: ProgressData = {
        currentStreak: 0,
        longestStreak: 0,
        totalCompletions: 0,
        lastCompletedDate: '',
        completions: {},
      };
      await setDoc(docRef, initialData);
      return initialData;
    }
  } catch (error) {
    console.error('Error obteniendo datos de progreso:', error);
    return null;
  }
}

// Marcar una rutina como completada
export async function markRoutineComplete(date: string, routineType: 'morning' | 'night'): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión para marcar rutinas completadas');
    }

    const progressData = await getProgressData();
    if (!progressData) {
      throw new Error('No se pudo obtener datos de progreso');
    }

    // Inicializar el día si no existe
    if (!progressData.completions[date]) {
      progressData.completions[date] = {};
    }

    // Verificar si ya estaba completada
    const wasCompleted = progressData.completions[date][routineType]?.completed;

    // Marcar como completada
    progressData.completions[date][routineType] = {
      completed: true,
      timestamp: Date.now(),
    };

    // Solo incrementar contador si no estaba previamente completada
    if (!wasCompleted) {
      progressData.totalCompletions++;
    }

    // Actualizar última fecha completada
    progressData.lastCompletedDate = date;

    // Recalcular racha
    const streak = calculateStreak(progressData.completions);
    progressData.currentStreak = streak.current;
    progressData.longestStreak = Math.max(progressData.longestStreak, streak.current);

    // Guardar en Firebase
    const docRef = doc(db, 'progress', user.uid);
    await setDoc(docRef, progressData);
    
    console.log(`✅ Rutina ${routineType} del ${date} marcada como completada`);
  } catch (error) {
    console.error('Error marcando rutina como completada:', error);
    throw error;
  }
}

// Verificar si una rutina específica está completada
export async function isRoutineCompleted(date: string, routineType: 'morning' | 'night'): Promise<boolean> {
  try {
    const progressData = await getProgressData();
    if (!progressData) return false;
    
    return progressData.completions[date]?.[routineType]?.completed || false;
  } catch (error) {
    console.error('Error verificando rutina completada:', error);
    return false;
  }
}

// Registrar manualmente una fecha específica como completada
export async function registerManualCompletion(date: string, routineTypes: ('morning' | 'night')[]): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión para registrar rutinas');
    }

    const progressData = await getProgressData();
    if (!progressData) {
      throw new Error('No se pudo obtener datos de progreso');
    }

    // Inicializar el día si no existe
    if (!progressData.completions[date]) {
      progressData.completions[date] = {};
    }

    let newCompletions = 0;

    // Marcar las rutinas seleccionadas
    for (const routineType of routineTypes) {
      const wasCompleted = progressData.completions[date][routineType]?.completed;
      
      progressData.completions[date][routineType] = {
        completed: true,
        timestamp: Date.now(),
      };

      if (!wasCompleted) {
        newCompletions++;
      }
    }

    // Actualizar contador total
    progressData.totalCompletions += newCompletions;

    // Actualizar última fecha completada
    progressData.lastCompletedDate = date;

    // Recalcular racha con las nuevas fechas
    const streak = calculateStreak(progressData.completions);
    progressData.currentStreak = streak.current;
    progressData.longestStreak = Math.max(progressData.longestStreak, streak.current);

    // Guardar en Firebase
    const docRef = doc(db, 'progress', user.uid);
    await setDoc(docRef, progressData);
    
    console.log(`✅ Rutinas del ${date} registradas manualmente`);
  } catch (error) {
    console.error('Error registrando rutina manual:', error);
    throw error;
  }
}

// Eliminar una rutina completada (para corregir errores)
export async function removeCompletion(date: string, routineType: 'morning' | 'night'): Promise<void> {
  try {
    const user = getCurrentUser();
    if (!user) {
      throw new Error('Debes iniciar sesión');
    }

    const progressData = await getProgressData();
    if (!progressData) {
      throw new Error('No se pudo obtener datos de progreso');
    }

    if (progressData.completions[date]?.[routineType]?.completed) {
      progressData.completions[date][routineType] = {
        completed: false,
        timestamp: Date.now(),
      };
      progressData.totalCompletions = Math.max(0, progressData.totalCompletions - 1);

      // Recalcular racha
      const streak = calculateStreak(progressData.completions);
      progressData.currentStreak = streak.current;

      // Guardar en Firebase
      const docRef = doc(db, 'progress', user.uid);
      await setDoc(docRef, progressData);
    }
  } catch (error) {
    console.error('Error eliminando rutina:', error);
    throw error;
  }
}

// Calcular racha actual
export function calculateStreak(completions: { [date: string]: DayCompletions }): { current: number; dates: string[] } {
  const dates = Object.keys(completions).sort().reverse(); // Más reciente primero
  if (dates.length === 0) return { current: 0, dates: [] };

  let streak = 0;
  const streakDates: string[] = [];
  
  // Usar fecha local para evitar problemas de zona horaria
  const now = new Date();
  // Ajustar si es madrugada (antes de las 6 AM cuenta como día anterior)
  if (now.getHours() < 6) {
    now.setDate(now.getDate() - 1);
  }
  
  const today = now.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local
  
  // Buscar desde hoy hacia atrás
  let currentDate = new Date(now);
  
  for (let i = 0; i < 365; i++) { // Máximo un año hacia atrás
    const dateStr = currentDate.toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local
    const dayData = completions[dateStr];
    
    // Si tiene al menos una rutina completada ese día, cuenta
    if (dayData && (dayData.morning?.completed || dayData.night?.completed)) {
      streak++;
      streakDates.push(dateStr);
    } else {
      // Si no encuentra datos para hoy, permitimos que la racha continúe si ayer sí se hizo
      // (Solo si estamos en la primera iteración, es decir, comprobando "hoy")
      if (i === 0) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return { current: streak, dates: streakDates };
}

// Exportar auth y funciones de Firebase para uso externo
export { auth, onAuthStateChanged };
export type { User };
