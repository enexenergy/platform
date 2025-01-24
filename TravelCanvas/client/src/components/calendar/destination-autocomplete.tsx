import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useQuery } from "@tanstack/react-query";

interface DestinationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function DestinationAutocomplete({
  value,
  onChange,
}: DestinationAutocompleteProps) {
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  const { data: destinations = [] } = useQuery({
    queryKey: ['/api/destinations/search', searchTerm],
    enabled: searchTerm.length > 1,
    queryFn: async () => {
      const res = await fetch(`/api/destinations/search?query=${encodeURIComponent(searchTerm)}`);
      if (!res.ok) throw new Error('Failed to fetch destinations');
      return res.json();
    },
    staleTime: 1000 * 60, // Cache results for 1 minute
    refetchOnWindowFocus: false,
  });

  const debouncedSetSearchTerm = React.useCallback(
    React.useMemo(
      () =>
        (value: string) => {
          setTimeout(() => setSearchTerm(value), 300);
        },
      []
    ),
    []
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Select destination..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search destinations..." 
            value={searchTerm}
            onValueChange={debouncedSetSearchTerm}
          />
          <CommandEmpty>No destination found.</CommandEmpty>
          <CommandGroup>
            {destinations.map((destination: any) => (
              <CommandItem
                key={destination.id}
                value={destination.name}
                onSelect={(currentValue) => {
                  onChange(currentValue === value ? "" : currentValue);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === destination.name ? "opacity-100" : "opacity-0"
                  )}
                />
                {destination.name}
                <span className="ml-2 text-sm text-muted-foreground">
                  ${destination.pricePerNight}/night
                </span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}