export function guessMime(name: string, fallback = "application/octet-stream") {
  const ext = name.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "pdf":
      return "application/pdf";
    case "heic":
      return "image/heic";
    default:
      return fallback;
  }
}
