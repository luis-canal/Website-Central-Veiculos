import { useEffect, useMemo, useState } from 'react';

function HeroCarousel({ images }) {
  const [index, setIndex] = useState(0);

  const slides = useMemo(() => images || [], [images]);

  useEffect(() => {
    if (!slides.length) return undefined;
    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) {
    return <div className="hero-bg" />;
  }

  return (
    <div className="hero-bg" style={{ backgroundImage: `url(${slides[index]})` }}>
      <div className="hero-overlay" />
    </div>
  );
}

export default HeroCarousel;
