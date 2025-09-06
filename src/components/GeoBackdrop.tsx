import { useEffect, useRef } from 'react';

// Import CSS so vector map styles are available when this component mounts
import 'jsvectormap/dist/jsvectormap.css';

type Marker = {
  name?: string;
  coords: [number, number]; // [lat, lng]
};

interface GeoBackdropProps {
  className?: string;
  backgroundColor?: string;
  markers?: Marker[];
  onMarkerClick?: (index: number) => void;
}

// A lightweight map backdrop using jsvectormap. It sits behind the gameplay UI
// to provide geographic context. It supports panning/zooming and optional markers.
export const GeoBackdrop = ({ className, backgroundColor = 'transparent', markers = [], onMarkerClick }: GeoBackdropProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    let isCancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const load = async () => {
      // Lazy-load library first, then the map definition.
      // Loading in parallel can cause "jsVectorMap is not defined" inside the map file.
      const lib = await import('jsvectormap');
      await import('jsvectormap/dist/maps/world.js');
      const jsVectorMap = lib.default as any;

      if (isCancelled || !containerRef.current) return;

      // Cleanup any previous instance (hot reload safety)
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.destroy(); } catch {}
      }

      mapInstanceRef.current = new jsVectorMap({
        selector: containerRef.current,
        map: 'world',
        // Accessibility and UX: make it clickable but not zoomable/draggable
        zoomButtons: false,
        zoomOnScroll: false,
        zoomOnScrollSpeed: 0,
        zoomMax: 1,
        draggable: false,
        backgroundColor,
        showTooltip: false,
        regionStyle: {
          initial: {
            fill: 'rgba(255,255,255,0.12)',
            stroke: 'rgba(255,255,255,0.18)',
            strokeWidth: 0.5,
          },
          hover: {
            fill: 'rgba(255,255,255,0.2)'
          },
        },
        markerStyle: {
          initial: { fill: 'hsl(var(--primary-glow))' },
          hover: { fill: 'hsl(var(--primary))' },
        },
        markers: markers.map(m => ({ name: m.name, coords: m.coords })),
      });

      // Wire marker clicks to parent
      try {
        mapInstanceRef.current.on('markerClick', (index: number) => {
          if (typeof onMarkerClick === 'function') onMarkerClick(index);
        });
      } catch {}

      // Ensure the SVG resizes to fill container changes
      const updateSize = () => {
        if (mapInstanceRef.current && typeof mapInstanceRef.current.updateSize === 'function') {
          try { mapInstanceRef.current.updateSize(); } catch {}
        }
      };

      // Call once after mount in case container was not fully laid out
      requestAnimationFrame(updateSize);

      // Observe container resize
      if (containerRef.current && 'ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(() => updateSize());
        resizeObserver.observe(containerRef.current);
      } else {
        // Fallback: listen to window resize
        window.addEventListener('resize', updateSize);
      }
    };

    load();

    return () => {
      isCancelled = true;
      if (resizeObserver && containerRef.current) {
        try { resizeObserver.unobserve(containerRef.current); } catch {}
      }
      resizeObserver = null;
      // Remove fallback listener
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      try { window.removeEventListener('resize', () => {}); } catch {}
      if (mapInstanceRef.current) {
        try { mapInstanceRef.current.destroy(); } catch {}
        mapInstanceRef.current = null;
      }
    };
  }, [backgroundColor, markers, onMarkerClick]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}
      aria-hidden
    />
  );
};

export default GeoBackdrop;



