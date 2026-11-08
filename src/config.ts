/** Edit this file to personalize the invitation. Date/time are interpreted in `timezone`. */
export const wedding = {
  bride: 'Vandita Srivastava',
  groom: 'Jeet Verma',
  date: { year: 2026, month: 12, day: 2, hour: 21, minute: 0, second: 0 },
  timezone: 'Asia/Kolkata',
  venue: 'NBFGR Campus',
  address: 'Canal Ring Road,Telibagh,Lucknow,226002',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Wedding+Venue',
  invitation: 'With the blessings of our families, we invite you to be part of the beginning of our forever.',
  closingMessage: 'Two hearts, two families, one beautiful beginning. Your presence will make our celebration complete.',
  // Replace these local paths with your optimized wedding photographs / video.
  heroImage: '/assets/hero-art.jpg',
  gallery: [
    { src: '/assets/gallery-1.jpg', alt: 'A quiet, romantic embrace', shape: 'tall' },
    { src: '/assets/gallery-2.jpg', alt: 'An intimate celebration', shape: 'wide' },
    { src: '/assets/gallery-3.jpg', alt: 'A moment together', shape: 'square' },
    { src: '/assets/gallery-4.jpg', alt: 'A beautiful detail', shape: 'tall' },
    { src: '/assets/gallery-5.jpg', alt: 'A golden-hour memory', shape: 'wide' },
    { src: '/assets/gallery-6.jpg', alt: 'A joyful moment', shape: 'square' },
  ],
  video: { type: 'local' as 'local' | 'youtube' | 'vimeo', src: '/assets/wedding-film.mp4', poster: '/assets/video-poster.jpg' },
  music: { src: '/assets/our-song.mp3', label: 'Our song' },
};
