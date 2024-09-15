"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import axios from "axios";
import { resizeImage } from "./ResizeImages";

interface CreateCarProps {
  userId: string;
  username: string;
}

const CreateCar = ({ userId, username }: CreateCarProps) => {
  // Existing state variables
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [images, setImages] = useState<FileList | null>(null);

  const createCar = useMutation(api.cars.createCar);

  const [postId] = useState(`${userId}-${Date.now()}`);

  const sanitizeFileName = (name: string) => {
    return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
  };

  // In your image upload function
  const handleImageUpload = async (file: File) => {
    // Sanitize file name to avoid spaces or special characters
    const sanitizeFileName = (name: string) => {
      return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    };

    const sanitizedFileName = sanitizeFileName(
      file.name.split(".").slice(0, -1).join(".")
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "car_spot_images");
    formData.append("folder", postId); // Store the image in the postId folder
    formData.append("public_id", sanitizedFileName); // Set the image name

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dn0ngtrru/image/upload`,
      formData
    );

    return sanitizedFileName; // Return the sanitized image name
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const imagePublicIds = [];
    if (images) {
      for (const file of Array.from(images)) {
        const publicId = await handleImageUpload(file);
        imagePublicIds.push(publicId);
      }
    }

    await createCar({
      brand,
      model,
      year,
      city,
      country,
      userId,
      username,
      imagePublicIds, // Use imagePublicIds instead of imagePublicIds
      postId, // Store postId if needed
    });

    // Reset form fields
    setBrand("");
    setModel("");
    setYear("");
    setCity("");
    setCountry("");
    setImages(null);
  };

  const deleteImagesFromCloudinary = async (publicIds: string[]) => {
    try {
      await axios.post("/api/delete-images", { publicIds });
    } catch (error) {
      console.error("Error deleting images:", error);
    }
  };

  return (
    <div className="bg-slate-500 text-black">
      <Link href="/">Home</Link>
      <h1>Create Car</h1>
      <form onSubmit={handleSubmit}>
        {/* Existing input fields */}
        <input
          type="text"
          placeholder="Brand"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Model"
          value={model}
          onChange={(e) => setModel(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        {/* Image upload field */}
        <input
          type="file"
          accept="image/*"
          title="Upload Images"
          multiple
          required
          onChange={(e) => setImages(e.target.files)}
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
};

export default CreateCar;
