import DOMPurify from "dompurify";
import parse from "html-react-parser";
import { ReactNode } from "react";

const ALLOWED_TAGS = [
  "p",
  "br",
  "ul",
  "ol",
  "li",
  "strong",
  "em",
  "b",
  "i",
  "u",
  "span",
] as const;

export const renderSafeHtml = (rawHtml: string): ReactNode => {
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    USE_PROFILES: { html: true },
    ALLOWED_TAGS: [...ALLOWED_TAGS],
    ALLOWED_ATTR: [],
  });

  return parse(cleanHtml);
};
