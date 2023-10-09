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
        canvas.width = 600;
        // Adjust canvas height to maintain the original aspect ratio
        canvas.height = canvas.width * (img.height / img.width);
        const ctx = canvas.getContext('2d');

        // Since we're maintaining the aspect ratio, 
        // the image can simply be drawn to fill the entire canvas
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

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
