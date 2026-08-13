import { useEffect } from "react";

const DEFAULT_TITLE = "Param Shah | Full Stack Developer & AI/ML Enthusiast";

/**
 * Sets document.title while a route is mounted and restores the default on
 * unmount. In a single-page app the static <title> in index.html would
 * otherwise follow the visitor across every route.
 */
export default function useDocumentTitle(title, description) {
  useEffect(() => {
    document.title = title;

    const meta = document.querySelector('meta[name="description"]');
    const previousDescription = meta?.getAttribute("content");
    if (meta && description) meta.setAttribute("content", description);

    return () => {
      document.title = DEFAULT_TITLE;
      if (meta && previousDescription) {
        meta.setAttribute("content", previousDescription);
      }
    };
  }, [title, description]);
}
