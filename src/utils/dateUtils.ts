export const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
  });
};

export const isSameDay = (date1: string, date2: string): boolean => {
  return date1 === date2;
};

export const getWeekRange = (date: Date): { start: string; end: string } => {
  const start = new Date(date);
  start.setDate(start.getDate() - start.getDay()); // Start from Sunday
  
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export const getMonthRange = (date: Date): { start: string; end: string } => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

export const getDaysInMonth = (year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const getCurrentMonthName = (): string => {
  return new Date().toLocaleDateString('id-ID', { month: 'long' });
};

export const getCurrentWeekNumber = (): number => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneWeek = 1000 * 60 * 60 * 24 * 7;
  return Math.floor(diff / oneWeek);
};

export const isToday = (dateString: string): boolean => {
  return dateString === getTodayDate();
};

// Tambahan untuk debugging
export const formatDateForDebug = (dateString: string): string => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

export const getCurrentDateTime = (): string => {
  const now = new Date();
  return now.toISOString();
};