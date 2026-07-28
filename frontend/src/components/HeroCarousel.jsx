import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { useCallback, useEffect, useState } from 'react';

function HeroCarousel({ images = [] }) {
  const autoplay = Autoplay({
    delay: 7000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      duration: 30,
      dragFree: false,
      align: 'start',
    },
    [autoplay]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    onSelect();

    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);

    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  if (!images.length) {
    return <div className="hero-bg" />;
  }

  return (
    <div className="hero-embla" ref={emblaRef}>
      <div className="hero-track">
        {images.map((img, index) => (
          <div className="hero-slide" key={index}>
            <img
              src={img}
              alt={`Banner ${index + 1}`}
              className="hero-img"
            />
          </div>
        ))}
      </div>

      <button
        className="hero-arrow hero-arrow-left"
        onClick={() => emblaApi?.scrollPrev()}
      >
        ❮
      </button>

      <button
        className="hero-arrow hero-arrow-right"
        onClick={() => emblaApi?.scrollNext()}
      >
        ❯
      </button>

      <div className="hero-dots">
        {images.map((_, index) => (
          <button
            key={index}
            className={`hero-dot ${
              index === selectedIndex ? 'active' : ''
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  );
}

export default HeroCarousel;