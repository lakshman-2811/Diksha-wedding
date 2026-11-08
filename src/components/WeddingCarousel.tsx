
import { useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { wedding } from '../config';

type GalleryImage = (typeof wedding.gallery)[number];

interface WeddingCarouselProps {
    images: GalleryImage[];
    onSelect: (index: number) => void;
}

export default function WeddingCarousel({
                                            images,
                                            onSelect,
                                        }: WeddingCarouselProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [step, setStep] = useState(
        typeof window !== 'undefined' && window.innerWidth <= 760 ? 125 : 225
    );

    const startX = useRef<number | null>(null);
    const moved = useRef(false);
    const reduceMotion = useReducedMotion();

    if (!images.length) {
        return <p className="carousel-empty">Our favourite moments will appear here.</p>;
    }

    const getOffset = (index: number) => {
        let offset = index - activeIndex;

        if (offset > images.length / 2) offset -= images.length;
        if (offset < -images.length / 2) offset += images.length;

        return offset;
    };

    const previous = () => {
        setActiveIndex((current) =>
            (current - 1 + images.length) % images.length
        );
    };

    const next = () => {
        setActiveIndex((current) =>
            (current + 1) % images.length
        );
    };

    const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
        startX.current = event.clientX;
        moved.current = false;
    };

    const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
        if (startX.current === null) return;

        const difference = event.clientX - startX.current;

        if (Math.abs(difference) > 45) {
            moved.current = true;
            if (difference < 0) next();
            else previous();
        }

        startX.current = null;
    };

    const handlePointerCancel = () => {
        startX.current = null;
    };

    return (
        <div className="wedding-carousel">
            <div
                className="carousel-stage"
                onPointerDown={handlePointerDown}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
            >
                {images.map((image, index) => {
                    const offset = getOffset(index);
                    const distance = Math.abs(offset);
                    const isActive = offset === 0;

                    if (distance > 2) return null;

                    return (
                        <motion.button
                            key={image.src}
                            type="button"
                            className={`carousel-card ${isActive ? 'is-active' : ''}`}
                            animate={{
                                x: offset * step,
                                y: distance === 0 ? 0 : distance * 17,
                                rotate: offset * -11,
                                scale: 1 - distance * 0.12,
                                opacity: distance > 2 ? 0 : 1,
                            }}
                            transition={
                                reduceMotion
                                    ? { duration: 0 }
                                    : {
                                        type: 'spring',
                                        stiffness: 115,
                                        damping: 19,
                                        mass: 0.85,
                                    }
                            }
                            style={{
                                zIndex: 10 - distance,
                                pointerEvents: distance > 1 ? 'none' : 'auto',
                            }}
                            onClick={() => {
                                if (moved.current) {
                                    moved.current = false;
                                    return;
                                }

                                if (isActive) {
                                    onSelect(index);
                                } else {
                                    setActiveIndex(index);
                                }
                            }}
                            aria-label={
                                isActive
                                    ? `View full photograph: ${image.alt}`
                                    : `Show photograph: ${image.alt}`
                            }
                            tabIndex={distance > 1 ? -1 : 0}
                        >
                            <img
                                src={image.src}
                                alt={image.alt}
                                style={{ objectPosition: image.position ?? '50% 50%' }}
                                loading="lazy"
                                decoding="async"
                                draggable={false}
                            />

                            <span className="carousel-card-number">
                {String(index + 1).padStart(2, '0')}
              </span>

                            {isActive && (
                                <span className="carousel-expand">
                  <Maximize2 size={17} />
                </span>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="carousel-controls">
                <button
                    type="button"
                    className="carousel-arrow"
                    onClick={previous}
                    aria-label="Previous photograph"
                >
                    <ChevronLeft size={21} />
                </button>

                <div className="carousel-counter">
                    <span>{String(activeIndex + 1).padStart(2, '0')}</span>
                    <i />
                    <span>{String(images.length).padStart(2, '0')}</span>
                </div>

                <button
                    type="button"
                    className="carousel-arrow"
                    onClick={next}
                    aria-label="Next photograph"
                >
                    <ChevronRight size={21} />
                </button>
            </div>

            <p className="carousel-hint">
                SWIPE OR USE THE ARROWS TO EXPLORE
            </p>
        </div>
    );
}
