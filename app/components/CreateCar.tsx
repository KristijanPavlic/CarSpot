"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Modal from "react-modal";
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { z } from "zod";

interface CreateCarProps {
  userId: string;
  username: string;
}

const carSchema = z.object({
  brand: z.string().min(2, "Brand must be at least 2 characters."),
  model: z.string().min(1, "Model must be at least 1 character."),
  year: z
    .string()
    .regex(/^\d{4}$/, "Year must be a 4-digit number.")
    .refine(
      (val) => {
        const yearNum = parseInt(val);
        const currentYear = new Date().getFullYear();
        return yearNum >= 1900 && yearNum <= currentYear + 1;
      },
      (val) => ({
        message: `Year must be between 1900 and ${new Date().getFullYear() + 1}.`,
      })
    ),
  city: z.string().min(1, "City is required."),
  country: z.string().min(1, "Country is required."),
  images: z
    .array(z.instanceof(File))
    .nonempty("At least one image is required."),
});

const CreateCar = ({ userId, username }: CreateCarProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [imagesData, setImagesData] = useState<{ file: File; url: string }[]>(
    []
  ); // Combined images and preview URLs
  const [fullScreenIndex, setFullScreenIndex] = useState<number | null>(null); // For full-screen modal
  const [errors, setErrors] = useState<z.ZodIssue[]>([]); // Validation errors

  const createCar = useMutation(api.cars.createCar);

  const [postId] = useState(`${userId}-${Date.now()}`);

  // Function to upload the image to Cloudinary
  const handleImageUpload = async (file: File) => {
    const sanitizeFileName = (name: string) => {
      return name.replace(/\s+/g, "_").replace(/[^\w.-]/g, "");
    };

    const sanitizedFileName = sanitizeFileName(
      file.name.split(".").slice(0, -1).join(".")
    );

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "car_spot_images");
    formData.append("folder", postId);
    formData.append("public_id", sanitizedFileName);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dn0ngtrru/image/upload`,
      formData
    );

    return sanitizedFileName;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Prepare data for validation
    const formData = {
      brand,
      model,
      year,
      city,
      country,
      images: imagesData.map((img) => img.file),
    };

    // Validate using Zod
    const result = carSchema.safeParse(formData);

    if (!result.success) {
      // If validation fails, extract and set errors
      setErrors(result.error.issues);
      return;
    }

    // If validation passes, proceed with submission
    const imagePublicIds: string[] = [];
    if (imagesData.length > 0) {
      for (const imgData of imagesData) {
        const publicId = await handleImageUpload(imgData.file);
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
      imagePublicIds,
      postId,
    });

    // Reset form fields
    setBrand("");
    setModel("");
    setYear("");
    setCity("");
    setCountry("");

    // Revoke object URLs and reset imagesData
    imagesData.forEach((img) => URL.revokeObjectURL(img.url));
    setImagesData([]);
    setErrors([]);
  };

  // Function to get error message for a field
  const getError = (fieldName: string) => {
    const error = errors.find((err) => err.path[0] === fieldName);
    return error ? error.message : null;
  };

  // Handle image selection and generate previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      const newImagesData = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setImagesData((prev) => [...prev, ...newImagesData]);
    }
  };

  // Remove image from the preview and from the state
  const removeImage = (index: number) => {
    setImagesData((prev) => {
      const newImagesData = [...prev];
      const removedImage = newImagesData.splice(index, 1)[0];

      // Revoke the object URL to free memory
      URL.revokeObjectURL(removedImage.url);

      return newImagesData;
    });
  };

  // Cleanup the URL.createObjectURL objects to avoid memory leaks
  useEffect(() => {
    return () => {
      imagesData.forEach((img) => URL.revokeObjectURL(img.url));
    };
  }, [imagesData]);

  // Navigate to the previous image in full screen
  const previousImage = () => {
    if (fullScreenIndex !== null) {
      setFullScreenIndex((prevIndex) =>
        prevIndex! > 0 ? prevIndex! - 1 : imagesData.length - 1
      );
    }
  };

  // Navigate to the next image in full screen
  const nextImage = () => {
    if (fullScreenIndex !== null) {
      setFullScreenIndex((prevIndex) =>
        prevIndex! < imagesData.length - 1 ? prevIndex! + 1 : 0
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#525252] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-[#212121] p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-white">Create a Spot</h1>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Brand Input */}
          <div className="rounded-md shadow-sm flex flex-col">
            <div>
              <label htmlFor="brand" className="text-white">
                Brand
              </label>
              <input
                id="brand"
                name="brand"
                type="text"
                placeholder="Audi"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                required
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-[#C6C6C6] placeholder-[#6e6e6e] text-black focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
              {getError("brand") && (
                <p className="text-red-500 text-sm mt-1">{getError("brand")}</p>
              )}
            </div>
            {/* Model Input */}
            <div className="mt-4">
              <label htmlFor="model" className="text-white">
                Model
              </label>
              <input
                id="model"
                name="model"
                type="text"
                placeholder="RS6"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-[#C6C6C6] placeholder-[#6e6e6e] text-black focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
              {getError("model") && (
                <p className="text-red-500 text-sm mt-1">{getError("model")}</p>
              )}
            </div>
            {/* Year Input */}
            <div className="mt-4">
              <label htmlFor="year" className="text-white">
                Year
              </label>
              <input
                id="year"
                name="year"
                type="number"
                placeholder="2024"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-[#C6C6C6] placeholder-[#6e6e6e] text-black focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
              {getError("year") && (
                <p className="text-red-500 text-sm mt-1">{getError("year")}</p>
              )}
            </div>
            {/* City Input */}
            <div className="mt-4">
              <label htmlFor="city" className="text-white">
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                placeholder="Zagreb"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-[#C6C6C6] placeholder-[#6e6e6e] text-black focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
              {getError("city") && (
                <p className="text-red-500 text-sm mt-1">{getError("city")}</p>
              )}
            </div>
            {/* Country Input */}
            <div className="mt-4">
              <label htmlFor="country" className="text-white">
                Country
              </label>
              <input
                id="country"
                name="country"
                type="text"
                placeholder="Croatia"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-[#C6C6C6] placeholder-[#6e6e6e] text-black focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
              {getError("country") && (
                <p className="text-red-500 text-sm mt-1">
                  {getError("country")}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-6">
            <label htmlFor="images" className="text-white">
              Upload Images
            </label>
            <input
              id="images"
              name="images"
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="block w-full text-base mt-1 text-[#6e6e6e] border border-gray-600 rounded-md cursor-pointer bg-[#C6C6C6] focus:outline-none"
            />
            {getError("images") && (
              <p className="text-red-500 text-sm mt-1">{getError("images")}</p>
            )}
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {imagesData.map((img, index) => (
              <div key={index} className="relative group h-32 w-full">
                <Image
                  src={img.url}
                  alt={`Preview ${index}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md"
                />
                {/* Delete and Full-Screen Options */}
                <div className="absolute inset-0 flex justify-center items-center gap-2 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition duration-300">
                  <button
                    type="button"
                    title="Delete Image"
                    className="text-white p-2 bg-red-500 rounded-full"
                    onClick={() => removeImage(index)}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                  <button
                    type="button"
                    title="View Full Screen"
                    className="text-white p-2 bg-blue-500 rounded-full"
                    onClick={() => setFullScreenIndex(index)}
                  >
                    <AiOutlineEye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Full-Screen Modal */}
          {fullScreenIndex !== null && (
            <Modal
              isOpen={fullScreenIndex !== null}
              onRequestClose={() => setFullScreenIndex(null)}
              className="flex justify-center items-center inset-0 fixed bg-black bg-opacity-75"
              shouldCloseOnOverlayClick={true} // Close on click outside the image
            >
              <div className="relative w-full max-w-3xl h-screen flex items-center justify-center">
                <button
                  className="absolute top-5 right-5 text-5xl text-white"
                  title="Close Full Screen"
                  onClick={() => setFullScreenIndex(null)}
                >
                  &times;
                </button>

                {/* DELETE BUTTON */}
                <button
                  className="absolute top-5 left-5 text-xl text-white bg-red-500 p-2 rounded-full hover:bg-red-600"
                  title="Delete Image"
                  onClick={() => {
                    removeImage(fullScreenIndex); // Deletes the image
                    setFullScreenIndex(null); // Closes the modal after deletion
                  }}
                >
                  Delete
                </button>

                <button
                  className="absolute left-5 text-4xl text-white p-2 bg-gray-800 rounded-full hover:bg-gray-600"
                  title="Previous Image"
                  onClick={previousImage}
                >
                  <IoIosArrowBack />
                </button>
                <Image
                  src={imagesData[fullScreenIndex].url}
                  width={1200}
                  height={800}
                  alt="Full Screen"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  className="absolute right-5 text-4xl text-white p-2 bg-gray-800 rounded-full hover:bg-gray-600"
                  title="Next Image"
                  onClick={nextImage}
                >
                  <IoIosArrowForward />
                </button>
              </div>
            </Modal>
          )}

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#BBD01A] hover:bg-[#BBD01A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#BBD01A]"
            >
              Create Spot
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCar;
