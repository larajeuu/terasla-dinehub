import { useState, useEffect, useCallback } from 'react';

const HomeBanner = ({ banners = [] }) => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 3500);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banners.length) return null;

  const banner = banners[current];

  return (
    <div className="relative mx-4 mt-3 rounded-2xl overflow-hidden" style={{ height: 160 }}>
      {/* Background: gambar jika ada, jika tidak pakai gradien */}
      <div
        className="absolute inset-0"
        style={
          banner.image
            ? { backgroundImage: `url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: banner.bg }
        }
      />
      {banner.image && <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.35)' }} />}

      {/* Decorative circle */}
      <div
        className="absolute -right-8 -bottom-8 w-48 h-48 rounded-full opacity-20"
        style={{ background: banner.accentColor }}
      />
      <div
        className="absolute -right-2 top-4 w-28 h-28 rounded-full opacity-10"
        style={{ background: banner.accentColor }}
      />

      {/* Content */}
      <div className="relative z-10 p-4 h-full flex flex-col justify-between">
        <div>
          {/* Badge */}
          <span
            className="inline-block text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
            style={{
              background: banner.accentColor,
              color: '#fff',
              fontFamily: "'Inter', sans-serif",
            }}
          >
            {banner.badge}
          </span>

          {/* Title */}
          <h2
            className="text-white font-bold leading-tight"
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 22,
              whiteSpace: 'pre-line',
            }}
          >
            {banner.title}
          </h2>
        </div>

        {/* Subtitle */}
        <p
          className="text-xs"
          style={{ color: 'rgba(255,255,255,0.65)', fontFamily: "'Inter', sans-serif", maxWidth: '60%' }}
        >
          {banner.subtitle}
        </p>
      </div>

      {/* Dots */}
      {banners.length > 1 && (
        <div className="absolute bottom-3 right-4 flex gap-1.5">
          {banners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="rounded-full transition-all"
              style={{
                width: i === current ? 20 : 6,
                height: 6,
                background: i === current ? banner.accentColor : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HomeBanner;
