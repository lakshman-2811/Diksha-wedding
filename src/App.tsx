import { useEffect, useState } from 'react';
import WeddingCarousel from './components/WeddingCarousel';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, X, Volume2, VolumeX, Play, Menu } from 'lucide-react';
import { wedding } from './config';
import Countdown from './components/Countdown';
import Reveal from './components/Reveal';

function Ornament({ className = '' }: { className?: string }) { return <span className={`ornament ${className}`} aria-hidden="true">✳</span>; }
function SectionHeading({ kicker, title, italic }: { kicker: string; title: string; italic?: string }) { return <div className="section-heading"><p className="eyebrow">{kicker}</p><h2>{title} {italic && <em>{italic}</em>}</h2><span className="heading-rule" /></div>; }

export default function App() {
  const [entered, setEntered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => { document.body.style.overflow = activeImage !== null || videoOpen ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [activeImage, videoOpen]);
  useEffect(() => { if (activeImage === null) return; const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setActiveImage(null); if (event.key === 'ArrowRight') setActiveImage(i => i === null ? null : (i + 1) % wedding.gallery.length); if (event.key === 'ArrowLeft') setActiveImage(i => i === null ? null : (i - 1 + wedding.gallery.length) % wedding.gallery.length); }; window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [activeImage]);

  const goTo = (id: string) => { setMenuOpen(false); document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); };
  const toggleMusic = async () => {
    const audio = document.getElementById('background-audio') as HTMLAudioElement | null;
    if (!audio) return;
    if (musicOn) { audio.pause(); setMusicOn(false); } else { try { await audio.play(); setMusicOn(true); } catch { setMusicOn(false); } }
  };
  const calendarDate = new Date(Date.UTC(wedding.date.year, wedding.date.month - 1, wedding.date.day, 12));
  const weekday = new Intl.DateTimeFormat('en', { weekday: 'long', timeZone: 'UTC' }).format(calendarDate);
  const monthName = new Intl.DateTimeFormat('en', { month: 'long', timeZone: 'UTC' }).format(calendarDate);
  const dateStamp = `${String(wedding.date.day).padStart(2, '0')} — ${String(wedding.date.month).padStart(2, '0')} — ${wedding.date.year}`;
  const formattedTime = new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'UTC' }).format(new Date(Date.UTC(2020, 0, 1, wedding.date.hour, wedding.date.minute)));
  const videoSrc = wedding.video.src;
  const embedSrc = wedding.video.type === 'youtube' ? `https://www.youtube-nocookie.com/embed/${videoSrc}?autoplay=1&rel=0` : wedding.video.type === 'vimeo' ? `https://player.vimeo.com/video/${videoSrc}?autoplay=1` : null;

  return <>
    <audio id="background-audio" src={wedding.music.src} loop preload="none" onError={() => setMusicOn(false)} />
    <header className="site-header">
      <button className="monogram" onClick={() => goTo('home')} aria-label="Back to top">{wedding.bride.charAt(0)}<i>&</i>{wedding.groom.charAt(0)}</button>
      <nav className={menuOpen ? 'nav-open' : ''} aria-label="Main navigation"><button onClick={() => goTo('story')}>Our story</button><button onClick={() => goTo('gallery')}>Moments</button><button onClick={() => goTo('details')}>The celebration</button></nav>
      <button className="music-toggle" onClick={toggleMusic} aria-label={musicOn ? 'Pause background music' : 'Play background music'}>{musicOn ? <Volume2 size={16}/> : <VolumeX size={16}/>}<span>{musicOn ? 'SOUND ON' : 'SOUND OFF'}</span></button>
      <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label="Toggle navigation">{menuOpen ? <X/> : <Menu/>}</button>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-image" style={{ backgroundImage: `url(${wedding.heroImage})` }} />
        <div className="hero-wash" />
        <div className="hero-frame" />
        <div className="hero-content">
          <motion.p className="hero-overline" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}>A CELEBRATION OF LOVE & FOREVER</motion.p>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55, duration: 1.1 }}><span>{wedding.bride}</span><i>&</i><span>{wedding.groom}</span></motion.h1>
          <motion.p className="hero-date" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.05, duration: 1 }}>{dateStamp}</motion.p>
          <motion.button className="enter-button" onClick={() => { setEntered(true); goTo('invitation'); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.25 }}><span>{entered ? 'WELCOME TO OUR STORY' : 'ENTER THE CELEBRATION'}</span><ArrowDown size={15}/></motion.button>
        </div>
        <div className="hero-side-note">A NEW CHAPTER BEGINS <span>✳</span> INDIA</div>
        <div className="hero-bottom"><span>SCROLL TO DISCOVER</span><span className="scroll-line" /></div>
        <Ornament className="hero-ornament" />
      </section>

      <section className="intro section-pad" id="invitation">
        <Reveal><p className="eyebrow">TO OUR DEAREST FAMILY & FRIENDS</p><Ornament/><h2>Some stories are written<br/>in the <em>stars.</em></h2><p className="intro-copy">{wedding.invitation}</p><div className="signature">With love, <span>{wedding.bride} & {wedding.groom}</span></div></Reveal>
      </section>

      <section className="count-section section-pad"><div className="count-bg-mark">02</div><Countdown /></section>

      {/*<section className="story-section section-pad" id="story">*/}
      {/*  <div className="story-top"><Reveal><SectionHeading kicker="A LITTLE BIT OF MAGIC" title="The story of" italic="us."/><p className="story-intro">A thousand little moments led us here. These are a few of the ones we hold closest.</p></Reveal><Reveal delay={0.15}><img className="story-main-image" src="/assets/gallery12.jpg" alt="Illustrated placeholder for a couple's story photograph" loading="lazy"/><span className="image-caption">THE BEGINNING OF ALWAYS</span></Reveal></div>*/}
      {/*  <div className="timeline">*/}
      {/*    {[{ year: 'THE FIRST HELLO', title: 'A chance encounter', text: 'Somewhere between an ordinary day and an unexpected smile, our story found its first page.', side: 'left' }, { year: 'THE LITTLE THINGS', title: 'Falling into forever', text: 'In shared laughter, long conversations and all the quiet in-between, we found our favourite place: together.', side: 'right' }, { year: 'THE PROMISE', title: 'A beautiful yes', text: 'One promise, two families, and a lifetime of tomorrows waiting to unfold.', side: 'left' }].map((item, i) => <Reveal key={item.year} className={`timeline-item ${item.side}`} delay={i * 0.08}><span className="timeline-dot"/><p className="eyebrow">{item.year}</p><h3>{item.title}</h3><p>{item.text}</p></Reveal>)}*/}
      {/*  </div>*/}
      {/*</section>*/}


      <section className="story-section section-pad" id="story">
        <div className="story-editorial">

          {/* Editorial introduction */}
          <Reveal className="story-editorial-copy">
            <p className="eyebrow">A LITTLE BIT OF MAGIC</p>

            <h2>
              The story of
              <br />
              <em>us.</em>
            </h2>

            <span className="story-editorial-rule" />

            <p className="story-intro">
              A thousand little moments led us here. From the first hello
              to the promises we make today, every little memory brought
              us closer to forever.
            </p>

            <div className="story-signature">
              <span>OUR JOURNEY, OUR FOREVER</span>
              <span className="story-signature-mark">✳</span>
            </div>
          </Reveal>

          {/* Main wedding photograph */}
          <Reveal className="story-editorial-visual" delay={0.15}>
            <div className="story-photo-frame">
              <img
                  className="story-main-image"
                  src={wedding.gallery[0].src}
                  alt={`Wedding photograph of ${wedding.bride} and ${wedding.groom}`}
                  loading="lazy"
                  decoding="async"
              />

              <span className="story-photo-number">01 — A MEMORY TO KEEP</span>
            </div>

            <p className="image-caption">
              THE BEGINNING OF ALWAYS
            </p>
          </Reveal>

        </div>

        {/* Wedding story timeline */}
        <div className="story-timeline-heading">
          <p className="eyebrow">CHAPTERS OF OUR LOVE</p>
          <h3>Every moment brought us <em>here.</em></h3>
        </div>

        <div className="timeline editorial-timeline">
          {[
            {
              year: 'THE FIRST HELLO',
              title: 'A chance encounter',
              text: 'Somewhere between an ordinary day and an unexpected smile, our story found its first page.',
            },
            {
              year: 'THE LITTLE THINGS',
              title: 'Falling into forever',
              text: 'In shared laughter, long conversations and all the quiet in-between, we found our favourite place: together.',
            },
            {
              year: 'THE PROMISE',
              title: 'A beautiful yes',
              text: 'One promise, two families, and a lifetime of tomorrows waiting to unfold.',
            },
          ].map((item, index) => (
              <Reveal
                  key={item.year}
                  className="editorial-timeline-item"
                  delay={index * 0.12}
              >
        <span className="timeline-number">
          0{index + 1}
        </span>

                <p className="eyebrow">{item.year}</p>

                <h3>{item.title}</h3>

                <p>{item.text}</p>

                <span className="timeline-small-rule" />
              </Reveal>
          ))}
        </div>
      </section>


      {/*<section className="gallery-section section-pad" id="gallery">*/}
      {/*  <Reveal><SectionHeading kicker="FRAMES WE'LL KEEP FOREVER" title="A collection of" italic="moments."/><p className="gallery-sub">A glimpse into the little world we’ve made together.</p></Reveal>*/}
      {/*  <div className="gallery-grid">{wedding.gallery.map((item, index) => <Reveal key={item.src} delay={(index % 3) * 0.07} className={`gallery-item ${item.shape}`}><button onClick={() => setActiveImage(index)} aria-label={`Open photograph: ${item.alt}`}><img src={item.src} alt={item.alt} loading="lazy"/><span className="gallery-index">0{index + 1}</span><span className="gallery-open"><ArrowUpRight size={18}/></span></button></Reveal>)}</div>*/}
      {/*</section>*/}


      <section className="gallery-section section-pad" id="gallery">
        <Reveal>
          <SectionHeading
              kicker="FRAMES WE'LL KEEP FOREVER"
              title="A collection of"
              italic="moments."
          />

          <p className="gallery-sub">
            A glimpse into the little world we've made together.
          </p>
        </Reveal>

        <Reveal delay={0.15}>
          <WeddingCarousel
              images={wedding.gallery}
              onSelect={(index) => setActiveImage(index)}
          />
        </Reveal>
      </section>


      <section className="film-section">
        <div className="film-art" style={{ backgroundImage: `url(${wedding.video.poster})` }} />
        <div className="film-content"><p className="eyebrow">A MOVING PICTURE</p><h2>Little moments.<br/><em>Big feelings.</em></h2><p>Press play and stay a little longer.</p><button className="play-button" onClick={() => setVideoOpen(true)} aria-label="Play wedding film"><Play fill="currentColor" size={17}/></button><span className="film-label">OUR WEDDING FILM</span></div>
      </section>

      <section className="details-section section-pad" id="details">
        <Reveal><SectionHeading kicker="SAVE THE DATE" title="Join us for" italic="forever."/><p className="details-intro">It would mean the world to have you beside us as we begin this beautiful new chapter.</p></Reveal>
        <div className="details-layout"><Reveal className="details-date"><span className="date-month">{monthName.toUpperCase()}</span><strong>{String(wedding.date.day).padStart(2, '0')}</strong><span className="date-weekday">{weekday.toUpperCase()} · {wedding.date.year}</span><span className="date-flourish">✳</span></Reveal><Reveal className="details-info" delay={0.1}><div className="detail-row"><span className="eyebrow">THE MUHURAT</span><h3>{formattedTime}</h3><p>We look forward to celebrating with you.</p></div><div className="detail-row"><span className="eyebrow">THE VENUE</span><h3>{wedding.venue}</h3><p>{wedding.address}</p><a className="text-link" href={wedding.mapsUrl} target="_blank" rel="noreferrer">GET DIRECTIONS <ArrowUpRight size={14}/></a></div></Reveal></div>
        <div className="map-line"><span/><span>WITH LOVE, FROM OUR FAMILIES</span><span/></div>
      </section>

      <section className="closing-section section-pad"><div className="closing-inner"><Ornament/><p className="eyebrow">UNTIL WE MEET ON THE DANCE FLOOR</p><h2>{wedding.closingMessage}</h2><div className="closing-names">{wedding.bride} <i>&</i> {wedding.groom}</div><p className="closing-date">{dateStamp.replace(' — ', ' · ')}</p></div><div className="closing-bottom"><span>MADE WITH LOVE</span><span>THE BEGINNING OF FOREVER <i>✳</i></span></div></section>
      <div className="creator-credit">
        <span>Designed & Developed with ♥ by</span>
        <strong>Varshita Srivastava</strong>
        <span>© {new Date().getFullYear()} All Rights Reserved</span>
      </div>
    </main>

    <AnimatePresence>{activeImage !== null && <motion.div className="lightbox" role="dialog" aria-modal="true" aria-label="Photo viewer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setActiveImage(null)}><button className="lightbox-close" onClick={() => setActiveImage(null)} aria-label="Close gallery"><X/></button><button className="lightbox-arrow prev" onClick={e => { e.stopPropagation(); setActiveImage(i => i === null ? null : (i - 1 + wedding.gallery.length) % wedding.gallery.length); }} aria-label="Previous photo"><ChevronLeft/></button><motion.img key={activeImage} src={wedding.gallery[activeImage].src} alt={wedding.gallery[activeImage].alt} initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}/><button className="lightbox-arrow next" onClick={e => { e.stopPropagation(); setActiveImage(i => i === null ? null : (i + 1) % wedding.gallery.length); }} aria-label="Next photo"><ChevronRight/></button><p>{String(activeImage + 1).padStart(2, '0')} / {String(wedding.gallery.length).padStart(2, '0')} — {wedding.gallery[activeImage].alt}</p></motion.div>}</AnimatePresence>
    <AnimatePresence>{videoOpen && <motion.div className="video-modal" role="dialog" aria-modal="true" aria-label="Wedding film" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}><button className="lightbox-close" onClick={() => setVideoOpen(false)} aria-label="Close video"><X/></button><div className="video-container">{embedSrc ? <iframe src={embedSrc} title="Wedding film" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen/> : <video src={videoSrc} poster={wedding.video.poster} controls autoPlay playsInline />}</div></motion.div>}</AnimatePresence>
  </>;
}
