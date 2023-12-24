export const identifyContentType = (url: string) => {
  const imageExtensions = [
    "jpg",
    "jpeg",
    "png",
    "gif",
    "bmp",
    "webp",
    "svg",
    "tiff",
  ];
  const videoExtensions = ["mp4", "webm", "mkv", "avi", "mov", "flv", "wmv"];

  const fileExtension = url.split(".").pop();
  if (!fileExtension) return "other";
  const lowerCaseExtension = fileExtension.toLowerCase();

  if (imageExtensions.includes(lowerCaseExtension)) {
    return "image";
  } else if (videoExtensions.includes(lowerCaseExtension)) {
    return "video";
  }

  return "other";
};
