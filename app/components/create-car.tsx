"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

interface CreateCarProps {
  userId: string;
}

const CreateCar = ({ userId }: CreateCarProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [location, setLocation] = useState("");

  const createCar = useMutation(api.cars.createCar);

  return (
    <div className="bg-slate-500 text-black">
      <Link href="/">Home</Link>
      <h1>Create car</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCar({ brand, model, year, location, userId });
          setBrand("");
          setModel("");
          setYear("");
          setLocation("");
        }}
      >
        <input
          type="text"
          name="inputBrand"
          aria-label="inputBrand"
          placeholder="Brand"
          value={brand}
          required
          onChange={(e) => setBrand(e.target.value)}
        />
        <input
          type="text"
          name="inputModel"
          aria-label="inputModel"
          placeholder="Model"
          value={model}
          required
          onChange={(e) => setModel(e.target.value)}
        />
        <input
          type="number"
          name="inputYear"
          aria-label="inputYear"
          placeholder="Year"
          value={year}
          required
          onChange={(e) => setYear(e.target.value)}
        />
        <input
          type="text"
          name="inputLocation"
          aria-label="inputLocation"
          placeholder="Location"
          value={location}
          required
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCar;
