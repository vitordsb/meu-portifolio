import OpengraphImage, {
  alt as ogAlt,
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

// Twitter Card usa exatamente o mesmo render do Open Graph.
// (Re-exports indiretos confundem o coletor de metadados do Next 15.)

export const runtime = "nodejs";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default OpengraphImage;
