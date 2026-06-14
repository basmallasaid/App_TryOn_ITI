const BASE64_RE = /^[A-Za-z0-9+/=]+$/;

function ensureImageUri(val) {
  if (!val || typeof val !== "string") return val;
  if (val.startsWith("data:") || val.startsWith("http")) return val;
  if (BASE64_RE.test(val)) {
    if (val.startsWith("/9j/") || val.startsWith("iVBOR") || val.startsWith("R0lGOD")) {
      return `data:image/jpeg;base64,${val}`;
    }
    return `data:image/png;base64,${val}`;
  }
  return val;
}

export function getItemImage(item) {
  if (!item) return null;
  if (typeof item === "string") return ensureImageUri(item);
  return ensureImageUri(
    item.image_url || item.image || item.imageUrl || item.url || null
  );
}

export function getItemsList(outfit) {
  if (!outfit) return [];
  const realOutfit = outfit.outfits?.[0] || outfit;
  const items = realOutfit.items || realOutfit.pieces || realOutfit.garments || [];
  return items.map(item => ({
    ...item,
    _image: getItemImage(item),
    _name: item.name || item.title || item.label || "",
  }));
}

export function getCompositeImage(outfit) {
  if (!outfit) {
    return null;
  }
  const realOutfit = outfit.outfits?.[0] || outfit;
  const raw =
    realOutfit.compositeImage ||
    realOutfit.composite_image ||
    outfit.compositeImage ||
    outfit.composite_image ||
    null;
  return raw ? ensureImageUri(raw) : null;
}
