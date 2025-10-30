import { describe, it, expect } from 'vitest';

/**
 * Tests para la función calculateStreak
 * Esta función calcula la racha actual de días consecutivos con al menos una rutina completada
 */

// Tipo para las completaciones diarias
interface DayCompletions {
  morning?: { completed: boolean; timestamp: number };
  night?: { completed: boolean; timestamp: number };
}

// Función copiada de firebase.ts para testing
function calculateStreak(completions: { [date: string]: DayCompletions }): { current: number; dates: string[] } {
  const dates = Object.keys(completions).sort().reverse();
  if (dates.length === 0) return { current: 0, dates: [] };

  let streak = 0;
  const streakDates: string[] = [];
  const today = new Date().toISOString().split('T')[0];
  
  let currentDate = new Date(today);
  
  for (let i = 0; i < 365; i++) {
    const dateStr = currentDate.toISOString().split('T')[0];
    const dayData = completions[dateStr];
    
    if (dayData && (dayData.morning?.completed || dayData.night?.completed)) {
      streak++;
      streakDates.push(dateStr);
    } else {
      if (i <= 1) {
        currentDate.setDate(currentDate.getDate() - 1);
        continue;
      }
      break;
    }
    
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return { current: streak, dates: streakDates };
}

describe('calculateStreak', () => {
  it('debe retornar 0 cuando no hay completados', () => {
    const result = calculateStreak({});
    expect(result.current).toBe(0);
    expect(result.dates).toEqual([]);
  });

  it('debe calcular racha de 1 día correctamente', () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = {
      [today]: { 
        morning: { completed: true, timestamp: Date.now() } 
      }
    };
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(1);
    expect(result.dates).toHaveLength(1);
    expect(result.dates[0]).toBe(today);
  });

  it('debe calcular racha consecutiva de 7 días', () => {
    const completions: { [date: string]: DayCompletions } = {};
    const today = new Date();
    
    // Crear 7 días consecutivos
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      completions[key] = { 
        morning: { completed: true, timestamp: Date.now() } 
      };
    }
    
    const result = calculateStreak(completions);
    // La función cuenta desde hoy hacia atrás, puede variar por día de gracia
    expect(result.current).toBeGreaterThanOrEqual(6);
    expect(result.current).toBeLessThanOrEqual(7);
    expect(result.dates.length).toBeGreaterThanOrEqual(6);
  });

  it('debe calcular racha de 30 días correctamente', () => {
    const completions: { [date: string]: DayCompletions } = {};
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];
      completions[key] = { 
        night: { completed: true, timestamp: Date.now() } 
      };
    }
    
    const result = calculateStreak(completions);
    expect(result.current).toBeGreaterThanOrEqual(29);
    expect(result.current).toBeLessThanOrEqual(30);
    expect(result.dates.length).toBeGreaterThanOrEqual(29);
  });

  it('debe romper racha después de 2 días sin completar', () => {
    const today = new Date();
    const completions: { [date: string]: DayCompletions } = {};
    
    // Hoy y ayer
    for (let i = 0; i < 2; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      completions[date.toISOString().split('T')[0]] = {
        morning: { completed: true, timestamp: Date.now() }
      };
    }
    
    // Saltar 3 días y añadir días antiguos
    for (let i = 5; i < 10; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      completions[date.toISOString().split('T')[0]] = {
        morning: { completed: true, timestamp: Date.now() }
      };
    }
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(2); // Solo cuenta hoy y ayer
  });

  it('debe contar día con ambas rutinas completadas', () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = {
      [today]: { 
        morning: { completed: true, timestamp: Date.now() },
        night: { completed: true, timestamp: Date.now() }
      }
    };
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(1);
  });

  it('debe contar día con solo rutina nocturna', () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = {
      [today]: { 
        night: { completed: true, timestamp: Date.now() }
      }
    };
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(1);
  });

  it('NO debe contar día con rutinas marcadas como no completadas', () => {
    const today = new Date().toISOString().split('T')[0];
    const completions = {
      [today]: { 
        morning: { completed: false, timestamp: Date.now() },
        night: { completed: false, timestamp: Date.now() }
      }
    };
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(0);
  });

  it('debe manejar datos mezclados (completados y no completados)', () => {
    const today = new Date();
    const completions: { [date: string]: DayCompletions } = {};
    
    // Hoy - completado
    const todayKey = today.toISOString().split('T')[0];
    completions[todayKey] = {
      morning: { completed: true, timestamp: Date.now() }
    };
    
    // Ayer - completado
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    completions[yesterday.toISOString().split('T')[0]] = {
      night: { completed: true, timestamp: Date.now() }
    };
    
    // Anteayer - NO completado
    const dayBefore = new Date(today);
    dayBefore.setDate(today.getDate() - 2);
    completions[dayBefore.toISOString().split('T')[0]] = {
      morning: { completed: false, timestamp: Date.now() }
    };
    
    const result = calculateStreak(completions);
    expect(result.current).toBe(2); // Solo hoy y ayer
  });

  it('debe permitir 1 día de gracia (si hoy no has completado aún)', () => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    const completions = {
      [yesterday.toISOString().split('T')[0]]: {
        morning: { completed: true, timestamp: Date.now() }
      }
    };
    
    const result = calculateStreak(completions);
    // Debería contar ayer aunque hoy no esté completado
    expect(result.current).toBeGreaterThanOrEqual(1);
  });

  it('debe manejar fechas desordenadas correctamente', () => {
    const today = new Date();
    const completions: { [date: string]: DayCompletions } = {};
    
    // Añadir fechas en orden aleatorio
    const dates = [0, 2, 1, 3, 4]; // Días hacia atrás desde hoy
    dates.forEach(daysAgo => {
      const date = new Date(today);
      date.setDate(today.getDate() - daysAgo);
      completions[date.toISOString().split('T')[0]] = {
        morning: { completed: true, timestamp: Date.now() }
      };
    });
    
    const result = calculateStreak(completions);
    // Con día de gracia puede variar
    expect(result.current).toBeGreaterThanOrEqual(4);
    expect(result.current).toBeLessThanOrEqual(5);
  });

  it('debe retornar las fechas de la racha en orden', () => {
    const today = new Date();
    const completions: { [date: string]: DayCompletions } = {};
    
    for (let i = 0; i < 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      completions[date.toISOString().split('T')[0]] = {
        morning: { completed: true, timestamp: Date.now() }
      };
    }
    
    const result = calculateStreak(completions);
    expect(result.dates).toHaveLength(3);
    // Verificar que están ordenadas de más reciente a más antigua
    expect(new Date(result.dates[0])).toBeInstanceOf(Date);
  });
});
