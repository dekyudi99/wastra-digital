import { useEffect, useState } from "react";

export function useMediaQuery() {
  const [collapsed, setCollapsed] = useState(
    window.innerWidth < 768
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");

    const handleChange = (e) => {
      setCollapsed(!e.matches); 
      // matches = true → desktop → collapsed = false
    };

    mediaQuery.addEventListener("change", handleChange);

    return () =>
      mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return collapsed
}