// adding multiple times new images and removing any image causes bug must be fixed
"use client";

import { useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import axios from "axios";
import { AiOutlineDelete, AiOutlineEye } from "react-icons/ai";
import Modal from "react-modal"; // Install this for full-screen modal
import Image from "next/image";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"; // Icons for slider arrows

interface CreateCarProps {
  userId: string;
  username: string;
}

const CreateCar = ({ userId, username }: CreateCarProps) => {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [images, setImages] = useState<File[]>([]); // Store selected files as an array
  const [previewImages, setPreviewImages] = useState<
    { file: File; url: string }[]
  >([]); // For image previews
  const [imageUrls, setImageUrls] = useState<string[]>([]); // Store the URL.createObjectURL objects
  const [fullScreenIndex, setFullScreenIndex] = useState<number | null>(null); // For full-screen modal

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

    const imagePublicIds: string[] = [];
    if (images.length > 0) {
      for (const file of images) {
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
      imagePublicIds,
      postId,
    });

    // Reset form fields
    setBrand("");
    setModel("");
    setYear("");
    setCity("");
    setCountry("");
    setImages([]);
    setPreviewImages([]);
  };

  // Handle image selection and generate previews
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setImages((prev) => [...prev, ...selectedFiles]);

      const newPreviews = selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      }));

      setImageUrls((prev) => [...prev, ...newPreviews.map((img) => img.url)]);
      setPreviewImages((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove image from the preview and from the state
  const removeImage = (index: number) => {
    const updatedPreviews = [...previewImages];
    updatedPreviews.splice(index, 1);

    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages(updatedPreviews);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Cleanup the URL.createObjectURL objects to avoid memory leaks
  useEffect(() => {
    return () => {
      imageUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imageUrls]);

  // Navigate to the previous image in full screen
  const previousImage = () => {
    if (fullScreenIndex !== null) {
      setFullScreenIndex((prevIndex) =>
        prevIndex! > 0 ? prevIndex! - 1 : previewImages.length - 1
      );
    }
  };

  // Navigate to the next image in full screen
  const nextImage = () => {
    if (fullScreenIndex !== null) {
      setFullScreenIndex((prevIndex) =>
        prevIndex! < previewImages.length - 1 ? prevIndex! + 1 : 0
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full space-y-8 bg-gray-800 p-8 rounded-lg shadow-xl">
        <Link href="/" className="text-[#D0E600] hover:underline">
          &larr; Home
        </Link>
        <h1 className="text-3xl font-bold text-white">Upload Car</h1>
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
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
                className="appearance-none mt-1 rounded-md relative block w-full px-3 py-3 border border-gray-600 bg-gray-700 placeholder-gray-400 text-white focus:outline-none focus:ring-[#D0E600] focus:border-[#D0E600] sm:text-sm"
              />
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
              className="block w-full text-base mt-1 text-gray-400 border border-gray-600 rounded-md cursor-pointer bg-gray-700 focus:outline-none"
            />
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            {previewImages.map((img, index) => (
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
                  src={previewImages[fullScreenIndex].url}
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
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-[#D0E600] hover:bg-[#c0d400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#D0E600]"
            >
              Create Car
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCar;
