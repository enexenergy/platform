import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { DateRangePicker } from "@/components/calendar/date-range-picker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Calendar() {
  const [startDate, setStartDate] = useState<Date>(new Date(2024, 5, 1)); // June 1st
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: trips = [] } = useQuery({
    queryKey: ['/api/trips'],
  });

  const addTrip = useMutation({
    mutationFn: async (tripData: any) => {
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: "Trip added",
        description: "Your trip has been successfully added to the calendar."
      });
    },
  });

  const updateTrip = useMutation({
    mutationFn: async ({ id, ...tripData }: any) => {
      const res = await fetch(`/api/trips/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tripData),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: "Trip updated",
        description: "Your trip has been successfully updated."
      });
    },
  });

  const deleteTrip = useMutation({
    mutationFn: async (id: number) => {
      await fetch(`/api/trips/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/trips'] });
      toast({
        title: "Trip deleted",
        description: "Your trip has been removed from the calendar."
      });
    },
  });

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <Card className="max-w-[1200px] mx-auto">
        <CardHeader>
          <CardTitle className="text-xl font-medium">
            Travel Planning Calendar - {format(startDate, 'MMMM yyyy')}
          </CardTitle>
          <DateRangePicker 
            startDate={startDate} 
            onStartDateChange={setStartDate}
          />
        </CardHeader>
        <CardContent>
          <CalendarGrid
            startDate={startDate}
            trips={trips}
            onAddTrip={(data) => addTrip.mutate(data)}
            onUpdateTrip={(data) => updateTrip.mutate(data)}
            onDeleteTrip={(id) => deleteTrip.mutate(id)}
          />
        </CardContent>
      </Card>
    </div>
  );
}
