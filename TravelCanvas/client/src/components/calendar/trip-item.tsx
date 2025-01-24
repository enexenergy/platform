import { useDrag } from 'react-dnd';
import { format } from 'date-fns';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TripItemProps {
  trip: any;
  onDelete: () => void;
}

export function TripItem({ trip, onDelete }: TripItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'trip',
    item: trip,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: trip.color,
        gridColumn: `span ${Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)))}`,
      }}
      className="absolute p-2 rounded-md shadow-sm cursor-move"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{trip.destination}</span>
        <Button
          size="sm"
          variant="ghost"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-xs opacity-75">
        {format(new Date(trip.startDate), 'MMM d')} - {format(new Date(trip.endDate), 'MMM d')}
      </div>
    </div>
  );
}
