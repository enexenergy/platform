import { useDrop } from 'react-dnd';
import { format, addDays } from 'date-fns';
import { TripItem } from './trip-item';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useState } from 'react';
import { DestinationAutocomplete } from './destination-autocomplete';

interface CalendarGridProps {
  startDate: Date;
  trips: any[];
  onAddTrip: (data: any) => void;
  onUpdateTrip: (data: any) => void;
  onDeleteTrip: (id: number) => void;
}

export function CalendarGrid({ startDate, trips, onAddTrip, onUpdateTrip, onDeleteTrip }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [destination, setDestination] = useState('');

  const dates = Array.from({ length: 28 }, (_, i) => addDays(startDate, i));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'trip',
    drop: (item: any, monitor) => {
      const delta = monitor.getDifferenceFromInitialOffset();
      if (delta) {
        onUpdateTrip({
          ...item,
          startDate: addDays(new Date(item.startDate), Math.round(delta.x / 100)),
          endDate: addDays(new Date(item.endDate), Math.round(delta.x / 100))
        });
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      className={`grid grid-cols-7 gap-1 ${isOver ? 'bg-muted/50' : ''}`}
    >
      {/* Day headers */}
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
        <div key={day} className="p-2 text-sm font-medium text-muted-foreground">
          {day}
        </div>
      ))}

      {/* Calendar cells */}
      {dates.map((date) => (
        <Dialog key={date.toISOString()}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="h-24 p-2 hover:bg-muted"
              onClick={() => setSelectedDate(date)}
            >
              <div className="text-sm">{format(date, 'd')}</div>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Trip on {format(date, 'MMM d, yyyy')}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <DestinationAutocomplete
                value={destination}
                onChange={setDestination}
              />
              <Button
                onClick={() => {
                  if (destination && selectedDate) {
                    onAddTrip({
                      destination,
                      startDate: selectedDate,
                      endDate: addDays(selectedDate, 1),
                    });
                    setDestination('');
                  }
                }}
              >
                Add Trip
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      ))}

      {/* Render trips */}
      {trips.map((trip) => (
        <TripItem
          key={trip.id}
          trip={trip}
          onDelete={() => onDeleteTrip(trip.id)}
        />
      ))}
    </div>
  );
}