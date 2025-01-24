import { addDays, isSameDay, isWithinInterval } from 'date-fns';

export function getTripsForDate(trips: any[], date: Date) {
  return trips.filter(trip => 
    isWithinInterval(date, {
      start: new Date(trip.startDate),
      end: new Date(trip.endDate)
    })
  );
}

export function calculateTripDuration(startDate: Date, endDate: Date) {
  return Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
}

export function generateDateRange(startDate: Date, days: number) {
  return Array.from({ length: days }, (_, i) => addDays(startDate, i));
}
