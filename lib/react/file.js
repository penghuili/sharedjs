export const FILI_SIZE_LIMIT_IN_MB = 500; // 500MB
export const FILI_SIZE_LIMIT = FILI_SIZE_LIMIT_IN_MB * 1024 * 1024; // 500MB

export function isImage(mimeType) {
  return !!mimeType && mimeType.startsWith('image/');
}

export function generateImageThumbnail(inputFile) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = 500;
        canvas.height = 500;
        const ctx = canvas.getContext('2d');

        // Calculate the scaling factor to maintain aspect ratio
        const scaleFactor = Math.min(canvas.width / img.width, canvas.height / img.height);

        // Calculate the position to center the image
        const x = (canvas.width - img.width * scaleFactor) / 2;
        const y = (canvas.height - img.height * scaleFactor) / 2;

        // Clear the canvas and draw the resized image
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, x, y, img.width * scaleFactor, img.height * scaleFactor);

        canvas.toBlob(
          blob => {
            resolve(blob);
          },
          'image/jpeg',
          0.95
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(inputFile);
  });
}

export async function inputFileToUnit8Array(file) {
  const fileData = await file.arrayBuffer();
  const binaryData = new Uint8Array(fileData);
  return binaryData;
}

export async function fetchResponseToUnit8Array(response) {
  const fileData = await response.arrayBuffer();
  const binaryData = new Uint8Array(fileData);
  return binaryData;
}

export function blobToUnit8Array(blob) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = function (event) {
      const arrayBuffer = event.target.result;
      const unit8Array = new Uint8Array(arrayBuffer);
      resolve(unit8Array);
    };

    reader.readAsArrayBuffer(blob);
  });
}

export function getFileSizeString(sizeInByte) {
  const gb = Math.floor(sizeInByte / (1024 * 1024 * 1024));
  const mb = +((sizeInByte - gb * (1024 * 1024 * 1024)) / (1024 * 1024)).toFixed(3);

  const gbString = gb > 0 ? `${gb}GB ` : '';
  const mbString = `${mb}MB`;

  return `${gbString}${mbString}`;
}
