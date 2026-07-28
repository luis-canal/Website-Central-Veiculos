import { useEffect, useMemo, useRef, useState } from 'react';

const INTERVAL = 7000;
const TRANSITION = 800;

function HeroCarousel({ images }) {
  const slides = useMemo(() => images || [], [images]);

  const carouselSlides = useMemo(() => {
    if (slides.length === 0) return [];

    return [
      slides[slides.length - 1],
      ...slides,
      slides[0],
    ];
  }, [slides]);

  const [index, setIndex] = useState(1);
  const [transition, setTransition] = useState(true);

  const timerRef = useRef();

  useEffect(() => {
    if (slides.length <= 1) return;

    timerRef.current = setInterval(() => {
      setIndex((prev) => prev + 1);
    }, INTERVAL);

    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  useEffect(() => {
    if (index !== slides.length + 1) return;

    const timeout = setTimeout(() => {
      setTransition(false);
      setIndex(1);
    }, TRANSITION);

    return () => clearTimeout(timeout);

  }, [index, slides.length]);

  useEffect(() => {
    if (index !== 0) return;

    const timeout = setTimeout(() => {
      setTransition(false);
      setIndex(slides.length);
    }, TRANSITION);

    return () => clearTimeout(timeout);

  }, [index, slides.length]);

  useEffect(() => {
    if (transition) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransition(true);
      });
    });
  }, [transition]);

  if (!slides.length) {
    return <div className="hero-bg" />;
  }

  return (
    <div className="hero-bg">

      <div
        className="hero-track"
        style={{
          transform: `translateX(-${index * 100}%)`,
          transition: transition
            ? `transform ${TRANSITION}ms cubic-bezier(.77,0,.175,1)`
            : 'none',
        }}
      >
        {carouselSlides.map((img, i) => (
          <img
            key={i}
            src={img}
            className="hero-img"
            alt={`Banner ${i}`}
          />
        ))}
      </div>

    </div>
  );
}

export default HeroCarousel;