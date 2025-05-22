import { useState, useEffect } from 'react';
import heroSlides from '../data/heroSlides';

const HeroCarousel = () => {
  const [index, setIndex] = useState(0);

  // Auto-slide every 5s
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const current = heroSlides[index];

  return (
    <div className="w-full h-[450px] rounded-4xl overflow-hidden relative shadow-xl mt-6 mb-10">
      {/* Background image */}
      <img
        src={current.image}
        alt={current.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-center">
        <div className="text-white px-6">
          <h2 className="text-4xl font-bold drop-shadow-md mb-2">
            {current.title}
          </h2>
          <p className="text-lg drop-shadow">{current.subtitle}</p>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {heroSlides.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition ${
              i === index ? 'bg-yellow-300 scale-110' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
