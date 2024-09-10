import { query } from "../_generated/server";

// Query to get filtered car data
export const get = query(async ({ db }, { brand, model, year, location, _userId }) => {
  // Build the filter conditions based on the provided parameters
  const filter = {};

  if (brand) {
    filter.brand = brand;
  }
  if (model) {
    filter.model = model;
  }
  if (year) {
    filter.year = year;
  }
  if (location) {
    filter.location = location;
  }

  // Query the cars collection with the filter
  const cars = await db.query("cars").filter(filter).collect();

  return cars;
});
