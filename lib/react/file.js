import heic2any from 'heic2any';

export const FILI_SIZE_LIMIT_IN_MB = 500; // 500MB
export const FILI_SIZE_LIMIT = FILI_SIZE_LIMIT_IN_MB * 1024 * 1024; // 500MB

export function isImage(mimeType) {
  return !!mimeType && mimeType.startsWith('image/');
}

export function isVideo(mimeType) {
  return !!mimeType && mimeType.startsWith('video/');
}

export function isPdf(mimeType) {
  return !!mimeType && mimeType.startsWith('application/pdf');
}

export async function generateImageThumbnail(inputFile) {
  try {
    if (inputFile.type === 'image/heic' || (inputFile.name || '').toLowerCase().endsWith('.heic')) {
      const jpegBlob = await heic2any({ blob: inputFile, toType: 'image/png', quality: 0.95 });
      return await generateThumbnail(jpegBlob);
    } else {
      return await generateThumbnail(inputFile);
    }
  } catch (e) {
    console.error('Error in generateImageThumbnail:', e);
    throw e;
  }
}

function generateThumbnail(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = Math.min(600, img.width);
        canvas.height = canvas.width * (img.height / img.width);
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(
          blob => {
            resolve(blob);
          },
          'image/png',
          0.95
        );
      };
      img.src = event.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function inputFileToUnit8Array(file) {
  const fileData = await file.arrayBuffer();
  const binaryData = new Uint8Array(fileData);
  return binaryData;
}

export function inputFileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function (event) {
      resolve(event.target.result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
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
