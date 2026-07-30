import { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

import VehicleCard from './VehicleCard';

function VehicleCarousel({ vehicles = [] }) {
  const autoplay = Autoplay({
    delay: 7000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      dragFree: false,
      containScroll: false,
    },
    [autoplay]
  );

  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
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

  if (!vehicles.length) return null;

  return (
    <div className="vehicle-carousel">

      <button
        className="vehicle-carousel-arrow left"
        onClick={() => emblaApi?.scrollPrev()}
      >
        ❮
      </button>

      <div className="vehicle-carousel-viewport" ref={emblaRef}>
        <div className="vehicle-carousel-container">
          {vehicles.map((carro) => (
            <div className="vehicle-carousel-slide" key={carro.id}>
              <VehicleCard carro={carro} />
            </div>
          ))}
        </div>
      </div>

      <button
        className="vehicle-carousel-arrow right"
        onClick={() => emblaApi?.scrollNext()}
      >
        ❯
      </button>

      <div className="vehicle-carousel-dots">
        {vehicles.map((_, index) => (
          <button
            key={index}
            className={`vehicle-carousel-dot ${
              selected === index ? 'active' : ''
            }`}
            onClick={() => emblaApi?.scrollTo(index)}
          />
        ))}
      </div>

    </div>
  );
}

export default VehicleCarousel;