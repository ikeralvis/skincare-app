// src/types/routine.ts

export interface Product {
  id: string;
  step: number;
  title: string;
  accessCode: string;
  function: string;
  usage: string;
  image: string;
  // Nuevos campos para gestión
  routineType: 'day' | 'night' | 'both'; // día, noche o ambos
  frequency?: 'daily' | 'alternate' | 'custom'; // diario, alterno, o personalizado
  daysOfWeek?: string[]; // Para rutinas nocturnas: ['Lunes', 'Miércoles', 'Viernes']
  enabled: boolean; // Para poder desactivar productos sin borrarlos
}

export interface RoutineData {
  dailyRoutine: Product[];
  nightlyRoutines: {
    [day: string]: Product[]; // 'Lunes', 'Martes', etc.
  };
  lastUpdated: number; // timestamp
}
