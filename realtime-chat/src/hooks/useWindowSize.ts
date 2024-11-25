import { useState, useEffect } from "react";

export const useWindowSize = () => {
  const [maxMessages, setMaxMessages] = useState<number>(10);

  useEffect(() => {
    const updateMaxMessages = () => {
      const height = window.innerHeight;
      setMaxMessages(Math.floor((height - 200) / 30));
    };

    updateMaxMessages();
    window.addEventListener("resize", updateMaxMessages);

    return () => window.removeEventListener("resize", updateMaxMessages);
  }, []);

  return maxMessages;
};
