// Calendar utility functions for Live Classes

export interface CalendarEvent {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  location?: string;
}

/**
 * Format date for Google Calendar URL
 */
const formatGoogleDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d+/g, '');
};

/**
 * Format date for ICS file
 */
const formatICSDate = (date: Date): string => {
  return date.toISOString().replace(/-|:|\.\d+/g, '').slice(0, 15) + 'Z';
};

/**
 * Add event to Google Calendar
 */
export const addToGoogleCalendar = (event: CalendarEvent): void => {
  const startDate = formatGoogleDate(event.startTime);
  const endDate = formatGoogleDate(event.endTime);
  
  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.set('action', 'TEMPLATE');
  url.searchParams.set('text', event.title);
  url.searchParams.set('dates', `${startDate}/${endDate}`);
  
  if (event.description) {
    url.searchParams.set('details', event.description);
  }
  
  url.searchParams.set('location', event.location || 'FUN Academy Online');
  
  window.open(url.toString(), '_blank');
};

/**
 * Download ICS file for calendar apps
 */
export const downloadICS = (event: CalendarEvent): void => {
  const startDate = formatICSDate(event.startTime);
  const endDate = formatICSDate(event.endTime);
  
  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//FUN Academy//Live Classes//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `DTSTART:${startDate}`,
    `DTEND:${endDate}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${(event.description || '').replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location || 'FUN Academy Online'}`,
    `UID:${Date.now()}@funacademy.io`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${event.title.replace(/[^a-zA-Z0-9]/g, '_')}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Schedule a local notification reminder
 */
export const scheduleReminder = (classId: string, title: string, scheduledAt: string): void => {
  const reminders = JSON.parse(localStorage.getItem('class_reminders') || '[]');
  
  // Check if reminder already exists
  const exists = reminders.some((r: { classId: string }) => r.classId === classId);
  if (exists) return;
  
  const reminderTime = new Date(scheduledAt);
  reminderTime.setMinutes(reminderTime.getMinutes() - 30);
  
  reminders.push({
    classId,
    title,
    scheduledAt,
    reminderAt: reminderTime.toISOString()
  });
  
  localStorage.setItem('class_reminders', JSON.stringify(reminders));
};

/**
 * Cancel a scheduled reminder
 */
export const cancelReminder = (classId: string): void => {
  const reminders = JSON.parse(localStorage.getItem('class_reminders') || '[]');
  const filtered = reminders.filter((r: { classId: string }) => r.classId !== classId);
  localStorage.setItem('class_reminders', JSON.stringify(filtered));
};

/**
 * Check and show any due reminders
 */
export const checkReminders = (): void => {
  if (!('Notification' in window)) return;
  
  const reminders = JSON.parse(localStorage.getItem('class_reminders') || '[]');
  const now = new Date();
  const remaining: typeof reminders = [];
  
  reminders.forEach((reminder: { classId: string; title: string; reminderAt: string; scheduledAt: string }) => {
    const reminderTime = new Date(reminder.reminderAt);
    const classTime = new Date(reminder.scheduledAt);
    
    // If class already passed, remove it
    if (classTime < now) return;
    
    // If reminder time has passed but class hasn't started
    if (reminderTime <= now && classTime > now) {
      if (Notification.permission === 'granted') {
        new Notification('FUN Academy - Nhắc nhở lớp học', {
          body: `Lớp học "${reminder.title}" sẽ bắt đầu trong 30 phút!`,
          icon: '/favicon.ico'
        });
      }
      return; // Remove this reminder after showing
    }
    
    remaining.push(reminder);
  });
  
  localStorage.setItem('class_reminders', JSON.stringify(remaining));
};

/**
 * Request notification permission
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false;
  
  if (Notification.permission === 'granted') return true;
  
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }
  
  return false;
};
