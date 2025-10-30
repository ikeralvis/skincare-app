// src/utils/reminders.ts
// Sistema de gestión de recordatorios con notificaciones

export interface Reminder {
  id: string;
  title: string;
  type: 'morning' | 'evening' | 'custom';
  when: number; // timestamp
  fired: boolean;
  createdAt: number;
}

const REMINDERS_KEY = 'skincareReminders_v2';
const sessionTimers: Record<string, number> = {};

// ==================== STORAGE ====================

export function loadReminders(): Reminder[] {
  try {
    const data = localStorage.getItem(REMINDERS_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
}

export function saveReminders(reminders: Reminder[]): void {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminders:', error);
  }
}

// ==================== NOTIFICACIONES ====================

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied';
  }
  
  if (Notification.permission === 'granted') {
    return 'granted';
  }
  
  if (Notification.permission === 'denied') {
    return 'denied';
  }
  
  return await Notification.requestPermission();
}

export async function ensureServiceWorkerReady(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) {
    return null;
  }
  
  try {
    return await navigator.serviceWorker.ready;
  } catch (error) {
    console.warn('Service Worker not ready:', error);
    return null;
  }
}

export function showToast(message: string): void {
  let toast = document.getElementById('reminder-toast');
  
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'reminder-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: linear-gradient(135deg, rgba(147, 51, 234, 0.95) 0%, rgba(79, 70, 229, 0.95) 100%);
      padding: 12px 20px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      opacity: 0;
      transition: opacity 0.3s ease;
      box-shadow: 0 8px 24px rgba(147, 51, 234, 0.4);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(147, 51, 234, 0.3);
    `;
    document.body.appendChild(toast);
  }
  
  toast.textContent = message;
  toast.style.opacity = '1';
  
  clearTimeout((toast as any)._hideTimer);
  (toast as any)._hideTimer = setTimeout(() => {
    toast!.style.opacity = '0';
  }, 3000);
}

export async function showNotification(
  title: string,
  body: string,
  data: Record<string, any> = {}
): Promise<void> {
  if (!('Notification' in window)) {
    showToast(body);
    return;
  }
  
  const permission = Notification.permission;
  if (permission !== 'granted') {
    showToast(body);
    return;
  }
  
  const options: NotificationOptions = {
    body,
    tag: 'skincare-reminder',
    icon: '/images/icon-192.png',
    badge: '/images/icon-72.png',
    data,
    requireInteraction: false,
  };
  
  try {
    const registration = await ensureServiceWorkerReady();
    
    if (registration && typeof registration.showNotification === 'function') {
      await registration.showNotification(title, options);
    } else {
      new Notification(title, options);
    }
  } catch (error) {
    console.warn('Failed to show notification via SW, using fallback:', error);
    try {
      new Notification(title, options);
    } catch (fallbackError) {
      showToast(body);
    }
  }
}

// ==================== GESTIÓN DE RECORDATORIOS ====================

export function createReminder(
  type: 'morning' | 'evening' | 'custom',
  when: number,
  title?: string
): Reminder {
  const typeLabels = {
    morning: '🌅 Rutina Matutina',
    evening: '🌙 Rutina Nocturna',
    custom: '⏰ Recordatorio',
  };
  
  return {
    id: `reminder-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    title: title || typeLabels[type],
    type,
    when,
    fired: false,
    createdAt: Date.now(),
  };
}

export async function addReminder(reminder: Reminder): Promise<void> {
  const reminders = loadReminders();
  reminders.push(reminder);
  saveReminders(reminders);
  scheduleReminder(reminder);
  
  // Mostrar confirmación
  const timeUntil = Math.ceil((reminder.when - Date.now()) / 1000 / 60);
  showToast(`✅ Recordatorio programado en ${timeUntil} minutos`);
}

export function deleteReminder(id: string): void {
  const reminders = loadReminders();
  const filtered = reminders.filter((r) => r.id !== id);
  saveReminders(filtered);
  
  if (sessionTimers[id]) {
    clearTimeout(sessionTimers[id]);
    delete sessionTimers[id];
  }
  
  showToast('🗑️ Recordatorio eliminado');
}

export function snoozeReminder(id: string, minutes: number = 5): void {
  const reminders = loadReminders();
  const reminder = reminders.find((r) => r.id === id);
  
  if (!reminder) return;
  
  reminder.when = Date.now() + minutes * 60 * 1000;
  reminder.fired = false;
  saveReminders(reminders);
  scheduleReminder(reminder);
  
  showToast(`💤 Pospuesto ${minutes} minutos`);
}

export async function fireReminder(reminder: Reminder): Promise<void> {
  // Marcar como fired
  const reminders = loadReminders();
  const index = reminders.findIndex((r) => r.id === reminder.id);
  
  if (index !== -1) {
    reminders[index].fired = true;
    saveReminders(reminders);
  }
  
  if (sessionTimers[reminder.id]) {
    clearTimeout(sessionTimers[reminder.id]);
    delete sessionTimers[reminder.id];
  }
  
  // Mostrar notificación
  await showNotification(
    '⏰ Recordatorio Skincare',
    reminder.title,
    { reminderId: reminder.id }
  );
}

export function scheduleReminder(reminder: Reminder): void {
  const remaining = reminder.when - Date.now();
  
  if (remaining <= 0 || reminder.fired) {
    return;
  }
  
  // Limpiar timeout anterior si existe
  if (sessionTimers[reminder.id]) {
    clearTimeout(sessionTimers[reminder.id]);
  }
  
  // Programar nuevo timeout
  sessionTimers[reminder.id] = window.setTimeout(() => {
    fireReminder(reminder);
  }, remaining);
}

export function initReminders(): void {
  const reminders = loadReminders();
  const now = Date.now();
  
  // Limpiar recordatorios expirados (más de 24 horas)
  const validReminders = reminders.filter((r) => {
    const age = now - r.createdAt;
    return age < 24 * 60 * 60 * 1000; // 24 horas
  });
  
  if (validReminders.length !== reminders.length) {
    saveReminders(validReminders);
  }
  
  // Reprogramar recordatorios pendientes
  validReminders.forEach((reminder) => {
    if (!reminder.fired && reminder.when > now) {
      scheduleReminder(reminder);
    }
  });
}

// ==================== HELPERS DE TIEMPO ====================

export function getTimeUntil(timestamp: number): string {
  const diff = timestamp - Date.now();
  
  if (diff <= 0) return 'Expirado';
  
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ${hours % 24}h`;
  if (hours > 0) return `${hours}h ${minutes % 60}m`;
  return `${minutes}m`;
}

export function formatReminderTime(timestamp: number): string {
  const date = new Date(timestamp);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  
  const timeStr = date.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  if (isToday) {
    return `Hoy a las ${timeStr}`;
  }
  
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = date.toDateString() === tomorrow.toDateString();
  
  if (isTomorrow) {
    return `Mañana a las ${timeStr}`;
  }
  
  return date.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}
