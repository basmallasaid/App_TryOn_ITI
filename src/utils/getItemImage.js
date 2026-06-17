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

export function enrichItemsWithWardrobeImages(items, wardrobeItems) {
  if (!items || !Array.isArray(items) || !wardrobeItems || !Array.isArray(wardrobeItems)) {
    return items || [];
  }
  const wardrobeMap = new Map();
  wardrobeItems.forEach((w) => {
    const analysisId = w.analysis_id || w.analysisId;
    if (analysisId && w.image) wardrobeMap.set(analysisId, w.image);
  });
  return items.map((item) => {
    if (item.image) return item;
    const analysisId = item.analysis_id || item.analysisId;
    if (!analysisId) return item;
    const wardrobeImage = wardrobeMap.get(analysisId);
    if (wardrobeImage) {
      return { ...item, image: wardrobeImage };
    }
    return item;
  });
}

export function getItemsList(outfit, wardrobeItems) {
  if (!outfit) return [];
  const realOutfit = outfit.outfits?.[0] || outfit;
  const items = realOutfit.items || realOutfit.pieces || realOutfit.garments || [];
  const enriched = enrichItemsWithWardrobeImages(items, wardrobeItems);
  return enriched.map(item => ({
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
  if (!raw) return null;
  return ensureImageUri(raw);
}
