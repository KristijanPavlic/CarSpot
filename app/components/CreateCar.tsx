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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  const [imagesData, setImagesData] = useState<
    { id: number; file: File; url: string }[]
  >([]); // Combined images and preview URLs
  const [fullScreenImageId, setFullScreenImageId] = useState<number | null>(
    null
  ); // For full-screen modal
  const [errors, setErrors] = useState<z.ZodIssue[]>([]); // Validation errors
  const [isFormValid, setIsFormValid] = useState(false); // New state to handle form validation

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
      "https://api.cloudinary.com/v1_1/dn0ngtrru/image/upload",
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

    toast.info("Creating spot...", { autoClose: 2000 });

    // If validation passes, proceed with submission
    try {
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

      toast.success("Spot submitted successfully! Pending admin approval.", {
        autoClose: 5000,
      });

      setBrand("");
      setModel("");
      setYear("");
      setCity("");
      setCountry("");
      imagesData.forEach((img) => URL.revokeObjectURL(img.url));
      setImagesData([]);
      setErrors([]);
    } catch (error) {
      toast.error("Failed to create spot.", { autoClose: 5000 });
    }
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
        id: Date.now() + Math.random(),
        file,
        url: URL.createObjectURL(file),
      }));

      setImagesData((prev) => [...prev, ...newImagesData]);
    }
  };

  // Remove image from the preview and from the state
  const removeImage = (id: number) => {
    setImagesData((prev) => {
      const newImagesData = prev.filter((img) => img.id !== id);

      // Revoke the object URL to free memory
      const removedImage = prev.find((img) => img.id === id);
      if (removedImage) {
        URL.revokeObjectURL(removedImage.url);
      }

      return newImagesData;
    });

    // If the removed image was being viewed in the modal, update fullScreenImageId
    if (fullScreenImageId === id) {
      if (imagesData.length > 1) {
        // Show the next image
        const currentIndex = imagesData.findIndex((img) => img.id === id);
        const nextIndex = (currentIndex + 1) % imagesData.length;
        setFullScreenImageId(imagesData[nextIndex].id);
      } else {
        // No images left
        setFullScreenImageId(null);
      }
    }
  };

  // Navigate to the previous image in full screen
  const previousImage = () => {
    if (imagesData.length === 0 || fullScreenImageId === null) return;

    const currentIndex = imagesData.findIndex(
      (img) => img.id === fullScreenImageId
    );
    const prevIndex =
      currentIndex > 0 ? currentIndex - 1 : imagesData.length - 1;
    setFullScreenImageId(imagesData[prevIndex].id);
  };

  // Navigate to the next image in full screen
  const nextImage = () => {
    if (imagesData.length === 0 || fullScreenImageId === null) return;

    const currentIndex = imagesData.findIndex(
      (img) => img.id === fullScreenImageId
    );
    const nextIndex = (currentIndex + 1) % imagesData.length;
    setFullScreenImageId(imagesData[nextIndex].id);
  };

  useEffect(() => {
    const formData = {
      brand,
      model,
      year,
      city,
      country,
      images: imagesData.map((img) => img.file),
    };

    const result = carSchema.safeParse(formData);
    setIsFormValid(result.success); // Update form validity
  }, [brand, model, year, city, country, imagesData]);

  const currentImage = imagesData.find((img) => img.id === fullScreenImageId);

  return (
    <div className="container w-fit bg-[#525252] py-6">
      <ToastContainer
        position="top-center"
        pauseOnHover
        theme="dark"
        newestOnTop
      />
      <div className="bg-[#212121] p-6 rounded-lg shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 lg:gap-6 gap-4">
            {/* Brand Input */}
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("brand") && (
                <p className="text-red-500 text-sm mt-1">{getError("brand")}</p>
              )}
            </div>
            {/* Model Input */}
            <div>
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("model") && (
                <p className="text-red-500 text-sm mt-1">{getError("model")}</p>
              )}
            </div>
            {/* Year Input */}
            <div>
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("year") && (
                <p className="text-red-500 text-sm mt-1">{getError("year")}</p>
              )}
            </div>
            {/* City Input */}
            <div>
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("city") && (
                <p className="text-red-500 text-sm mt-1">{getError("city")}</p>
              )}
            </div>
            {/* Country Input */}
            <div>
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("country") && (
                <p className="text-red-500 text-sm mt-1">
                  {getError("country")}
                </p>
              )}
            </div>
            {/* Image Upload */}
            <div>
              <label htmlFor="images" className="text-white">
                Upload Images
              </label>
              <input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 bg-[#C6C6C6] text-black focus:outline-none placeholder:text-[#6e6e6e] focus:ring focus:ring-[#bbd01a86] sm:text-sm"
              />
              {getError("images") && (
                <p className="text-red-500 text-sm mt-1">
                  {getError("images")}
                </p>
              )}
            </div>
          </div>

          {/* Image Preview */}
          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-4 mt-6">
            {imagesData.map((img) => (
              <div key={img.id} className="relative group h-40 w-full">
                <Image
                  src={img.url}
                  alt={`Preview ${img.id}`}
                  layout="fill"
                  objectFit="cover"
                  className="rounded-md shadow-sm"
                />
                <div className="absolute inset-0 flex items-center justify-center gap-3 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button
                    type="button"
                    className="bg-red-500 p-2 rounded-full text-white"
                    title="Delete"
                    onClick={() => removeImage(img.id)}
                  >
                    <AiOutlineDelete size={20} />
                  </button>
                  <button
                    type="button"
                    className="bg-blue-500 p-2 rounded-full text-white"
                    title="View"
                    onClick={() => setFullScreenImageId(img.id)}
                  >
                    <AiOutlineEye size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Full Screen Modal */}
          {fullScreenImageId !== null && currentImage && (
            <Modal
              isOpen={fullScreenImageId !== null}
              onRequestClose={() => setFullScreenImageId(null)}
              className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
            >
              <div className="relative max-w-3xl mx-auto">
                <button
                  className="absolute top-5 left-5 p-3 bg-red-500 rounded-full text-white"
                  onClick={() => removeImage(fullScreenImageId)}
                >
                  Delete
                </button>
                <button
                  className="absolute top-5 right-5 text-5xl text-white"
                  onClick={() => setFullScreenImageId(null)}
                >
                  &times;
                </button>
                <Image
                  src={currentImage.url}
                  width={1200}
                  height={800}
                  alt="Full Screen"
                  className="max-h-full max-w-full object-contain"
                />
                <button
                  className="absolute left-5 p-3 text-white bg-gray-800 rounded-full"
                  title="Previous"
                  onClick={previousImage}
                >
                  <IoIosArrowBack size={30} />
                </button>
                <button
                  className="absolute right-5 p-3 text-white bg-gray-800 rounded-full"
                  title="Next"
                  onClick={nextImage}
                >
                  <IoIosArrowForward size={30} />
                </button>
              </div>
            </Modal>
          )}

          <button
            type="submit"
            disabled={!isFormValid} // Button disabled if form is invalid
            className={`w-fit py-3 px-4 mt-4 rounded-md text-sm font-semibold shadow-lg transition-all ${
              isFormValid
                ? "bg-[#BBD01A] text-black hover:bg-[#AACC00]"
                : "bg-gray-500 text-gray-300 cursor-not-allowed"
            }`}
          >
            Create Spot
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCar;
