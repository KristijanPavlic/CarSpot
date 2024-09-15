import Pica from "pica";

const pica = Pica();

export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<File> => {
  return new Promise((resolve, reject) => {
    const fileName = file.name;
    const img = new Image();

    img.onload = async () => {
      let canvas = document.createElement("canvas");
      let offScreenCanvas = document.createElement("canvas");

      let ratio = Math.min(maxWidth / img.width, maxHeight / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;

      offScreenCanvas.width = img.width;
      offScreenCanvas.height = img.height;

      const ctx = offScreenCanvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0);
      } else {
        reject(new Error("Failed to get 2D context"));
        return;
      }

      try {
        const result = await pica.resize(offScreenCanvas, canvas);
        const blob = await pica.toBlob(result, file.type, 0.8);
        const resizedFile = new File([blob], fileName, {
          type: file.type,
          lastModified: Date.now(),
        });
        resolve(resizedFile);
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      reject(error);
    };

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("FileReader result is null"));
      }
    };
    reader.onerror = (error) => {
      reject(error);
    };
    reader.readAsDataURL(file);
  });
};
