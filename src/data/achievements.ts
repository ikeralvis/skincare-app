// src/data/achievements.ts
// Definición de logros y desafíos del sistema

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: UserStats) => boolean;
  reward?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  icon: string;
  target: number;
  current: number;
  reward: {
    icon: string;
    name: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
  };
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  perfectWeeks: number;
  morningRoutines: number;
  nightRoutines: number;
  consecutiveDays: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Common Achievements (Básicos - 1-3 días)
  {
    id: 'first-day',
    name: 'Primer Día',
    description: 'Completa tu primera rutina',
    icon: '✨',
    rarity: 'common',
    condition: (stats) => stats.totalDaysCompleted >= 1,
  },
  {
    id: 'three-days',
    name: 'Constancia',
    description: 'Completa 3 días seguidos',
    icon: '🌟',
    rarity: 'common',
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: 'morning-person',
    name: 'Madrugador',
    description: 'Completa 5 rutinas matutinas',
    icon: '🌅',
    rarity: 'common',
    condition: (stats) => stats.morningRoutines >= 5,
  },
  {
    id: 'night-owl',
    name: 'Nocturno',
    description: 'Completa 5 rutinas nocturnas',
    icon: '🌙',
    rarity: 'common',
    condition: (stats) => stats.nightRoutines >= 5,
  },

  // Rare Achievements (Intermedio - 7-15 días)
  {
    id: 'week-warrior',
    name: 'Guerrero Semanal',
    description: 'Completa 7 días seguidos',
    icon: '🔥',
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: 'two-weeks',
    name: 'Quincena Perfecta',
    description: 'Completa 15 días seguidos',
    icon: '💪',
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 15,
  },
  {
    id: 'perfect-week',
    name: 'Semana Impecable',
    description: 'Completa mañana y noche toda una semana',
    icon: '⭐',
    rarity: 'rare',
    condition: (stats) => stats.perfectWeeks >= 1,
  },
  {
    id: 'dedicated',
    name: 'Dedicado',
    description: 'Completa 20 rutinas en total',
    icon: '🎯',
    rarity: 'rare',
    condition: (stats) => stats.totalDaysCompleted >= 20,
  },

  // Epic Achievements (Avanzado - 30 días)
  {
    id: 'monthly-master',
    name: 'Maestro Mensual',
    description: 'Completa 30 días seguidos',
    icon: '👑',
    rarity: 'epic',
    condition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: 'habit-former',
    name: 'Formador de Hábitos',
    description: 'Completa 50 rutinas en total',
    icon: '🏅',
    rarity: 'epic',
    condition: (stats) => stats.totalDaysCompleted >= 50,
  },

  // Legendary Achievements (Experto - 100+ días)
  {
    id: 'century-club',
    name: 'Club del Centenario',
    description: 'Completa 100 días seguidos',
    icon: '💎',
    rarity: 'legendary',
    condition: (stats) => stats.currentStreak >= 100,
  },
  {
    id: 'skincare-legend',
    name: 'Leyenda del Skincare',
    description: 'Completa 100 rutinas en total',
    icon: '🌈',
    rarity: 'legendary',
    condition: (stats) => stats.totalDaysCompleted >= 100,
  },
];

export const CHALLENGES: Challenge[] = [
  {
    id: 'challenge-3-days',
    title: 'Racha de 3 días',
    description: 'Completa tu rutina 3 días seguidos',
    icon: '🌟',
    target: 3,
    current: 0,
    reward: {
      icon: '✨',
      name: 'Común',
      rarity: 'common',
    },
  },
  {
    id: 'challenge-7-days',
    title: 'Racha de 7 días',
    description: 'Completa tu rutina 7 días seguidos',
    icon: '🔥',
    target: 7,
    current: 0,
    reward: {
      icon: '⭐',
      name: 'Raro',
      rarity: 'rare',
    },
  },
  {
    id: 'challenge-15-days',
    title: 'Racha de 15 días',
    description: 'Completa tu rutina 15 días seguidos',
    icon: '💪',
    target: 15,
    current: 0,
    reward: {
      icon: '👑',
      name: 'Épico',
      rarity: 'epic',
    },
  },
  {
    id: 'challenge-30-days',
    title: 'Racha de 30 días',
    description: 'Completa tu rutina 30 días seguidos',
    icon: '👑',
    target: 30,
    current: 0,
    reward: {
      icon: '💎',
      name: 'Legendario',
      rarity: 'legendary',
    },
  },
  {
    id: 'challenge-100-days',
    title: 'Racha de 100 días',
    description: 'Completa tu rutina 100 días seguidos',
    icon: '💎',
    target: 100,
    current: 0,
    reward: {
      icon: '🌈',
      name: 'Legendario',
      rarity: 'legendary',
    },
  },
];

// Helper para obtener el desafío actual según la racha
export function getCurrentChallenge(currentStreak: number): Challenge {
  const challenges = [...CHALLENGES].sort((a, b) => a.target - b.target);
  
  // Encontrar el primer desafío no completado
  for (const challenge of challenges) {
    if (currentStreak < challenge.target) {
      return {
        ...challenge,
        current: currentStreak,
      };
    }
  }
  
  // Si completó todos, devolver el último
  const lastChallenge = challenges[challenges.length - 1];
  return {
    ...lastChallenge,
    current: currentStreak,
  };
}

// Helper para verificar si se desbloqueó un nuevo logro
export function checkNewAchievements(
  stats: UserStats,
  previousUnlocked: string[]
): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    if (achievement.condition(stats) && !previousUnlocked.includes(achievement.id)) {
      newAchievements.push(achievement);
    }
  }
  
  return newAchievements;
}

// Helper para obtener todos los logros desbloqueados
export function getUnlockedAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS.filter((achievement) => achievement.condition(stats));
}
