// This should be the domain that is configured with Cloudflare and has Image Resizing enabled.
const CLOUDFLARE_RESIZE_DOMAIN = "sd-style-images.wall-breaker-no4.xyz";

export default function cloudflareImageResizingLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const params = `width=${width},quality=${quality || 75},format=avif`;

  // Extract the path from the full source URL.
  // Example: "https://.../path/to/image.png" becomes "/path/to/image.png"
  let imagePath;
  try {
    imagePath = new URL(src).pathname;
  } catch (e) {
    // If src is not a full URL (e.g., already a path), use it directly.
    imagePath = src;
  }

  // Construct the absolute URL for Cloudflare Image Resizing.
  // This will work correctly in both development and production.
  return `https://${CLOUDFLARE_RESIZE_DOMAIN}/cdn-cgi/image/${params}${imagePath}`;
}