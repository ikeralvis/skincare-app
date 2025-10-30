import { describe, it, expect } from 'vitest';

/**
 * Tests para validación de datos de rutinas y productos
 */

interface Product {
  id: string;
  step: number;
  title: string;
  accessCode: string;
  function: string;
  usage: string;
  image: string;
  routineType: 'day' | 'night';
  frequency: 'daily' | 'lactic' | 'non-lactic';
  enabled: boolean;
}

interface RoutineData {
  userId: string;
  dailyRoutine: Product[];
  nightlyRoutines: {
    [key: string]: Product[];
  };
  lastUpdated: number;
}

// Función de validación
function validateProduct(product: any): boolean {
  if (!product) return false;
  if (typeof product.id !== 'string' || product.id.length === 0) return false;
  if (typeof product.step !== 'number' || product.step < 1) return false;
  if (typeof product.title !== 'string' || product.title.length === 0) return false;
  if (typeof product.accessCode !== 'string') return false;
  if (typeof product.function !== 'string') return false;
  if (typeof product.usage !== 'string') return false;
  if (typeof product.image !== 'string') return false;
  if (!['day', 'night'].includes(product.routineType)) return false;
  if (!['daily', 'lactic', 'non-lactic'].includes(product.frequency)) return false;
  if (typeof product.enabled !== 'boolean') return false;
  return true;
}

function validateRoutineData(data: any): boolean {
  if (!data) return false;
  if (typeof data.userId !== 'string' || data.userId.length === 0) return false;
  if (!Array.isArray(data.dailyRoutine)) return false;
  if (!data.nightlyRoutines || typeof data.nightlyRoutines !== 'object') return false;
  if (typeof data.lastUpdated !== 'number' || data.lastUpdated <= 0) return false;
  
  // Validar cada producto en dailyRoutine
  for (const product of data.dailyRoutine) {
    if (!validateProduct(product)) return false;
  }
  
  // Validar rutinas nocturnas
  const days = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  for (const day of days) {
    if (!Array.isArray(data.nightlyRoutines[day])) return false;
    for (const product of data.nightlyRoutines[day]) {
      if (!validateProduct(product)) return false;
    }
  }
  
  return true;
}

describe('Validación de Productos', () => {
  it('debe validar un producto correcto', () => {
    const product: Product = {
      id: 'prod-1',
      step: 1,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia la piel',
      usage: 'Aplicar en rostro húmedo',
      image: '/images/product.jpg',
      routineType: 'day',
      frequency: 'daily',
      enabled: true
    };
    
    expect(validateProduct(product)).toBe(true);
  });

  it('debe rechazar producto sin ID', () => {
    const product = {
      step: 1,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia',
      usage: 'Aplicar',
      image: '/img.jpg',
      routineType: 'day',
      frequency: 'daily',
      enabled: true
    };
    
    expect(validateProduct(product)).toBe(false);
  });

  it('debe rechazar producto con step inválido', () => {
    const product = {
      id: 'prod-1',
      step: 0,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia',
      usage: 'Aplicar',
      image: '/img.jpg',
      routineType: 'day',
      frequency: 'daily',
      enabled: true
    };
    
    expect(validateProduct(product)).toBe(false);
  });

  it('debe rechazar producto con routineType inválido', () => {
    const product = {
      id: 'prod-1',
      step: 1,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia',
      usage: 'Aplicar',
      image: '/img.jpg',
      routineType: 'invalid',
      frequency: 'daily',
      enabled: true
    };
    
    expect(validateProduct(product)).toBe(false);
  });

  it('debe rechazar producto con frequency inválida', () => {
    const product = {
      id: 'prod-1',
      step: 1,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia',
      usage: 'Aplicar',
      image: '/img.jpg',
      routineType: 'day',
      frequency: 'weekly',
      enabled: true
    };
    
    expect(validateProduct(product)).toBe(false);
  });

  it('debe rechazar producto sin enabled', () => {
    const product = {
      id: 'prod-1',
      step: 1,
      title: 'Limpiador',
      accessCode: 'ABC123',
      function: 'Limpia',
      usage: 'Aplicar',
      image: '/img.jpg',
      routineType: 'day',
      frequency: 'daily'
    };
    
    expect(validateProduct(product)).toBe(false);
  });
});

describe('Validación de RoutineData', () => {
  it('debe validar RoutineData correcta', () => {
    const data: RoutineData = {
      userId: 'user123',
      dailyRoutine: [
        {
          id: 'prod-1',
          step: 1,
          title: 'Limpiador',
          accessCode: 'ABC',
          function: 'Limpia',
          usage: 'Aplicar',
          image: '/img.jpg',
          routineType: 'day',
          frequency: 'daily',
          enabled: true
        }
      ],
      nightlyRoutines: {
        Lunes: [],
        Martes: [],
        Miércoles: [],
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: []
      },
      lastUpdated: Date.now()
    };
    
    expect(validateRoutineData(data)).toBe(true);
  });

  it('debe rechazar RoutineData sin userId', () => {
    const data = {
      dailyRoutine: [],
      nightlyRoutines: {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [],
        Viernes: [], Sábado: [], Domingo: []
      },
      lastUpdated: Date.now()
    };
    
    expect(validateRoutineData(data)).toBe(false);
  });

  it('debe rechazar RoutineData sin dailyRoutine', () => {
    const data = {
      userId: 'user123',
      nightlyRoutines: {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [],
        Viernes: [], Sábado: [], Domingo: []
      },
      lastUpdated: Date.now()
    };
    
    expect(validateRoutineData(data)).toBe(false);
  });

  it('debe rechazar RoutineData con día faltante en nightlyRoutines', () => {
    const data = {
      userId: 'user123',
      dailyRoutine: [],
      nightlyRoutines: {
        Lunes: [],
        Martes: [],
        // Falta Miércoles
        Jueves: [],
        Viernes: [],
        Sábado: [],
        Domingo: []
      },
      lastUpdated: Date.now()
    };
    
    expect(validateRoutineData(data)).toBe(false);
  });

  it('debe rechazar RoutineData con producto inválido en dailyRoutine', () => {
    const data = {
      userId: 'user123',
      dailyRoutine: [
        {
          id: '',  // ID inválido
          step: 1,
          title: 'Limpiador',
          accessCode: 'ABC',
          function: 'Limpia',
          usage: 'Aplicar',
          image: '/img.jpg',
          routineType: 'day',
          frequency: 'daily',
          enabled: true
        }
      ],
      nightlyRoutines: {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [],
        Viernes: [], Sábado: [], Domingo: []
      },
      lastUpdated: Date.now()
    };
    
    expect(validateRoutineData(data)).toBe(false);
  });

  it('debe rechazar RoutineData con lastUpdated inválido', () => {
    const data = {
      userId: 'user123',
      dailyRoutine: [],
      nightlyRoutines: {
        Lunes: [], Martes: [], Miércoles: [], Jueves: [],
        Viernes: [], Sábado: [], Domingo: []
      },
      lastUpdated: -1
    };
    
    expect(validateRoutineData(data)).toBe(false);
  });
});

describe('Validación de Datos de Progreso', () => {
  interface ProgressData {
    currentStreak: number;
    longestStreak: number;
    totalCompletions: number;
    lastCompletedDate: string;
    completions: Record<string, any>;
  }

  function validateProgressData(data: any): boolean {
    if (!data) return false;
    if (typeof data.currentStreak !== 'number' || data.currentStreak < 0) return false;
    if (typeof data.longestStreak !== 'number' || data.longestStreak < 0) return false;
    if (typeof data.totalCompletions !== 'number' || data.totalCompletions < 0) return false;
    if (typeof data.lastCompletedDate !== 'string') return false;
    if (typeof data.completions !== 'object') return false;
    return true;
  }

  it('debe validar ProgressData correcta', () => {
    const data: ProgressData = {
      currentStreak: 5,
      longestStreak: 10,
      totalCompletions: 25,
      lastCompletedDate: '2025-10-30',
      completions: {}
    };
    
    expect(validateProgressData(data)).toBe(true);
  });

  it('debe rechazar ProgressData con streak negativo', () => {
    const data = {
      currentStreak: -1,
      longestStreak: 10,
      totalCompletions: 25,
      lastCompletedDate: '2025-10-30',
      completions: {}
    };
    
    expect(validateProgressData(data)).toBe(false);
  });

  it('debe validar ProgressData con completions', () => {
    const data: ProgressData = {
      currentStreak: 1,
      longestStreak: 1,
      totalCompletions: 1,
      lastCompletedDate: '2025-10-30',
      completions: {
        '2025-10-30': {
          morning: { completed: true, timestamp: Date.now() }
        }
      }
    };
    
    expect(validateProgressData(data)).toBe(true);
  });
});
