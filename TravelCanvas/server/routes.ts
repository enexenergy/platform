import type { Express } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { trips, destinations } from "@db/schema";
import { eq, like, or } from "drizzle-orm";

const SOUTHEAST_ASIA_DESTINATIONS = [
  { name: "Bangkok, Thailand", category: "Luxury" },
  { name: "Phuket, Thailand", category: "Luxury" },
  { name: "Bali, Indonesia", category: "Luxury" },
  { name: "Singapore", category: "Luxury" },
  { name: "Ho Chi Minh City, Vietnam", category: "Comfort" },
  { name: "Hanoi, Vietnam", category: "Comfort" },
  { name: "Siem Reap, Cambodia", category: "Comfort" },
  { name: "Kuala Lumpur, Malaysia", category: "Comfort" },
  { name: "Manila, Philippines", category: "Comfort" },
  { name: "Boracay, Philippines", category: "Luxury" },
  { name: "Chiang Mai, Thailand", category: "Basic" },
  { name: "Yangon, Myanmar", category: "Basic" },
  { name: "Vientiane, Laos", category: "Basic" },
  { name: "Penang, Malaysia", category: "Comfort" },
  { name: "Palawan, Philippines", category: "Luxury" },
  { name: "Koh Samui, Thailand", category: "Luxury" },
  { name: "Hoi An, Vietnam", category: "Comfort" },
  { name: "Ubud, Indonesia", category: "Comfort" },
  { name: "Lombok, Indonesia", category: "Basic" },
  { name: "Phnom Penh, Cambodia", category: "Basic" }
];

export function registerRoutes(app: Express): Server {
  // Trip routes
  app.get("/api/trips", async (_req, res) => {
    try {
      const allTrips = await db.select().from(trips);
      res.json(allTrips);
    } catch (error) {
      console.error("Error fetching trips:", error);
      res.status(500).json({ error: "Failed to fetch trips" });
    }
  });

  app.post("/api/trips", async (req, res) => {
    try {
      const { destination, startDate, endDate, color } = req.body;
      const newTrip = await db.insert(trips).values({
        destination,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        color: color || '#94a3b8'
      }).returning();
      res.json(newTrip[0]);
    } catch (error) {
      console.error("Error creating trip:", error);
      res.status(500).json({ error: "Failed to create trip" });
    }
  });

  app.put("/api/trips/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { destination, startDate, endDate, color } = req.body;
      const updatedTrip = await db.update(trips)
        .set({
          destination,
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          color: color || '#94a3b8'
        })
        .where(eq(trips.id, parseInt(id)))
        .returning();
      res.json(updatedTrip[0]);
    } catch (error) {
      console.error("Error updating trip:", error);
      res.status(500).json({ error: "Failed to update trip" });
    }
  });

  app.delete("/api/trips/:id", async (req, res) => {
    try {
      const { id } = req.params;
      await db.delete(trips).where(eq(trips.id, parseInt(id)));
      res.sendStatus(200);
    } catch (error) {
      console.error("Error deleting trip:", error);
      res.status(500).json({ error: "Failed to delete trip" });
    }
  });

  // Destination routes
  app.get("/api/destinations", async (_req, res) => {
    try {
      const allDestinations = await db.select().from(destinations);
      const total = allDestinations.reduce((acc, curr) => acc + Number(curr.pricePerNight), 0);
      res.json({
        destinations: allDestinations,
        total: total.toFixed(2),
        count: allDestinations.length
      });
    } catch (error) {
      console.error("Error fetching destinations:", error);
      res.status(500).json({ error: "Failed to fetch destinations" });
    }
  });

  app.get("/api/destinations/search", async (req, res) => {
    try {
      const { query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const searchResults = await db.select()
        .from(destinations)
        .where(
          or(
            like(destinations.name, `%${query}%`),
            like(destinations.category, `%${query}%`)
          )
        )
        .limit(5);

      res.json(searchResults);
    } catch (error) {
      console.error("Error searching destinations:", error);
      res.status(500).json({ error: "Failed to search destinations" });
    }
  });

  app.post("/api/destinations/init", async (_req, res) => {
    try {
      const existingDestinations = await db.select().from(destinations);

      if (existingDestinations.length === 0) {
        const destinationsToInsert = [
          { name: "Bangkok, Thailand", category: "Luxury", pricePerNight: "287.00" },
          { name: "Phuket, Thailand", category: "Luxury", pricePerNight: "250.00" },
          { name: "Bali, Indonesia", category: "Luxury", pricePerNight: "154.00" },
          { name: "Singapore", category: "Luxury", pricePerNight: "285.00" },
          { name: "Ho Chi Minh City, Vietnam", category: "Comfort", pricePerNight: "292.00" },
          { name: "Hanoi, Vietnam", category: "Comfort", pricePerNight: "183.00" },
          { name: "Siem Reap, Cambodia", category: "Comfort", pricePerNight: "227.00" },
          { name: "Kuala Lumpur, Malaysia", category: "Comfort", pricePerNight: "286.00" },
          { name: "Manila, Philippines", category: "Comfort", pricePerNight: "295.00" },
          { name: "Boracay, Philippines", category: "Luxury", pricePerNight: "273.00" },
          { name: "Chiang Mai, Thailand", category: "Basic", pricePerNight: "283.00" },
          { name: "Yangon, Myanmar", category: "Basic", pricePerNight: "231.00" },
          { name: "Vientiane, Laos", category: "Basic", pricePerNight: "320.00" },
          { name: "Penang, Malaysia", category: "Comfort", pricePerNight: "399.00" },
          { name: "Palawan, Philippines", category: "Luxury", pricePerNight: "272.00" },
          { name: "Koh Samui, Thailand", category: "Luxury", pricePerNight: "390.00" },
          { name: "Hoi An, Vietnam", category: "Comfort", pricePerNight: "99.00" },
          { name: "Ubud, Indonesia", category: "Comfort", pricePerNight: "149.00" },
          { name: "Lombok, Indonesia", category: "Basic", pricePerNight: "156.00" },
          { name: "Phnom Penh, Cambodia", category: "Basic", pricePerNight: "198.00" }
        ];

        await db.insert(destinations).values(destinationsToInsert);
        const insertedDestinations = await db.select().from(destinations);
        const total = insertedDestinations.reduce((acc, curr) => acc + Number(curr.pricePerNight), 0);

        res.json({
          message: "Destinations initialized successfully",
          destinations: insertedDestinations,
          total: total.toFixed(2),
          count: insertedDestinations.length
        });
      } else {
        res.json({
          message: "Destinations already initialized",
          destinations: existingDestinations,
          total: existingDestinations.reduce((acc, curr) => acc + Number(curr.pricePerNight), 0).toFixed(2),
          count: existingDestinations.length
        });
      }
    } catch (error) {
      console.error("Error initializing destinations:", error);
      res.status(500).json({ error: "Failed to initialize destinations" });
    }
  });

  return createServer(app);
}