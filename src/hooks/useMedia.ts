import { useEffect, useState } from "react";

export default function useMedia(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (window.matchMedia) {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }

      const listener = () => setMatches(media.matches);
      media.addListener(listener);

      return () => media.removeListener(listener);
    }

    return undefined;
  }, [matches, query]);

  return matches;
}
