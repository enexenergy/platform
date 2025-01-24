import { pgTable, text, serial, date, integer, decimal } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const trips = pgTable("trips", {
  id: serial("id").primaryKey(),
  destination: text("destination").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  color: text("color").notNull().default('#94a3b8'), // Default slate-400
  createdAt: date("created_at").defaultNow(),
});

export const destinations = pgTable("destinations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  pricePerNight: decimal("price_per_night", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(), // Luxury, Comfort, Basic
  createdAt: date("created_at").defaultNow(),
});

export const tripSchema = createInsertSchema(trips);
export const selectTripSchema = createSelectSchema(trips);
export type Trip = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;

export const destinationSchema = createInsertSchema(destinations);
export const selectDestinationSchema = createSelectSchema(destinations);
export type Destination = typeof destinations.$inferSelect;
export type NewDestination = typeof destinations.$inferInsert;