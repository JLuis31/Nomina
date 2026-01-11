import { useEffect, useState } from "react";

const DigitalClock = () => {
  const [formatted, setFormatted] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      const now = new Date();
      setFormatted(now.toLocaleTimeString([], { hour12: false }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return <div className="digital-clock">{formatted}</div>;
};

export default DigitalClock;
