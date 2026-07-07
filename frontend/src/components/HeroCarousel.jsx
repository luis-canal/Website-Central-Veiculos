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
    <div className="hero-bg">
      <img className="hero-img" src={slides[index]} alt={`Banner ${index + 1}`} />
    </div>
  );
}

export default HeroCarousel;
