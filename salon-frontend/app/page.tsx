'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);


const VIDEO_URL = '/videos/hero-ribbon.mp4';

const SIGNATURE_SERVICES = [
  { name: 'Keratin Treatment', icon: '✦', desc: 'Salon-grade smoothening for silky frizz-free hair that lasts months.', price: 'From ₹4,000' },
  { name: 'Bridal Makeup', icon: '◆', desc: 'Complete luxury bridal packages crafted by master artists.', price: 'From ₹8,000' },
  { name: 'Hair Coloring', icon: '◈', desc: 'Precision color work — balayage, highlights, global color & more.', price: 'From ₹1,500' },
  { name: 'Hair Spa', icon: '✧', desc: 'Deep nourishing treatments that restore lustre and health.', price: 'From ₹800' },
  { name: 'Aromatherapy Massage', icon: '◉', desc: 'Immersive full-body massage ritual with premium essential oils.', price: 'From ₹2,500' },
  { name: 'Pre-Bridal Package', icon: '✦', desc: 'Multi-session pre-bridal glow ritual for your most important day.', price: 'From ₹10,000' },
];

const STYLISTS = [
  { name: 'Arun Kumar', role: 'Master Stylist & Color Expert', exp: '12 Years', speciality: 'Keratin, Balayage, Precision Cuts' },
  { name: 'Priya Sharma', role: 'Bridal & Makeup Artist', exp: '9 Years', speciality: "Bridal Looks, Skin Care, Threading" },
  { name: 'Ravi Naik', role: 'Beard Craft & Grooming', exp: '7 Years', speciality: "Beard Styling, Waxing, Men's Treatments" },
  { name: 'Divya Reddy', role: 'Hair Therapy Specialist', exp: '8 Years', speciality: "Hair Spa, Masks, Women's Cuts" },
];

export default function HomePage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // GSAP SCROLL SCRUB VIDEO
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Wait for video metadata to load so we know the exact duration
    video.addEventListener('loadedmetadata', () => {
      // Create a GSAP timeline linked to the scroll of the entire page
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1.5, // 1.5 second smoothing so it feels liquid
        }
      });

      // Animate the video currentTime property from 0 to video.duration
      tl.to(video, {
        currentTime: video.duration || 10, // Fallback to 10s if duration fails
        ease: 'none'
      });
      
      // Force render the first frame immediately for chromium browsers
      video.currentTime = 0.1;
    }, { once: true });
    
    // Force load to get metadata
    video.load();

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  // SECTION SCROLL REVEAL
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.opacity = '1';
            (entry.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08 }
    );
    sectionsRef.current.forEach((el) => {
      if (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        observer.observe(el);
      }
    });
    return () => observer.disconnect();
  }, []);

  const setRef = (i: number) => (el: HTMLElement | null) => { sectionsRef.current[i] = el; };

  return (
    <main className="bg-[#0d0d0d] text-[#F5EFE7]">

      {/* FIXED VIDEO BACKGROUND DRIVEN BY SCROLL */}
      <div className="fixed inset-0 w-full h-full -z-10 bg-[#0d0d0d] overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
          autoPlay
          preload="auto"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0d0d0d] to-[#0d0d0d] opacity-80" />
      </div>

      {/* HERO SECTION — Floating over 3D background */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-6">
        {/* Subtle gradient overlay to ensure text is readable but 3D shows through */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(10,5,8,0.2)] to-[rgba(10,5,8,0.8)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center">
          <p className="text-[#B76E79] uppercase tracking-[0.5em] text-xs mb-8 font-light drop-shadow-lg">Hair X Studio · Ballari</p>
          <h1 className="text-6xl md:text-9xl font-serif font-light text-[#F5EFE7] leading-none mb-8 drop-shadow-2xl">
            Luxury.<br />
            <span className="italic text-[#B76E79]">Crafted.</span>
          </h1>
          <p className="text-[#F5EFE7] opacity-60 text-sm tracking-[0.3em] mb-12 uppercase drop-shadow-md">Est. 2018 · Premium Hair & Beauty</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center pointer-events-auto">
            <Link href="/book" className="px-10 py-4 bg-[rgba(183,110,121,0.9)] backdrop-blur-md text-[#0d0d0d] font-medium tracking-[0.2em] uppercase text-xs rounded-full hover:bg-[#F5EFE7] hover:shadow-[0_0_30px_rgba(183,110,121,0.5)] transition-all duration-500">
              Book Appointment
            </Link>
            <Link href="/services" className="px-10 py-4 backdrop-blur-md bg-[rgba(255,255,255,0.03)] border border-[rgba(183,110,121,0.4)] text-[#F5EFE7] tracking-[0.2em] uppercase text-xs rounded-full hover:border-[#B76E79] hover:bg-[rgba(183,110,121,0.1)] transition-all duration-500">
              View Services
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-none z-10">
          <p className="text-[10px] text-[#F5EFE7] opacity-40 uppercase tracking-[0.4em]">Scroll to Explore</p>
          <div className="w-px h-12 bg-gradient-to-b from-[#B76E79] to-transparent animate-pulse" />
        </div>
      </section>

      {/* SECTION 2: Brand Story */}
      <section className="min-h-screen flex items-center justify-center px-6 py-32 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#120810] to-[#0d0d0d] pointer-events-none" />
        <div ref={setRef(0)} className="max-w-4xl mx-auto text-center relative z-10 glass-card p-12 md:p-24 rounded-3xl border border-[rgba(183,110,121,0.1)]">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-8">Est. 2018 · Ballari, Karnataka</p>
          <h2 className="text-5xl md:text-7xl font-serif font-light leading-tight mb-10 text-[#F5EFE7] drop-shadow-lg">
            Where craft meets<br />
            <span className="italic text-[#B76E79]">artistry.</span>
          </h2>
          <p className="text-lg md:text-xl font-light opacity-70 leading-relaxed max-w-2xl mx-auto mb-12">
            Hair X Studio was born from a belief that every person deserves world-class beauty services.
            Two branches in Ballari, serving hundreds of happy clients every month.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[{ stat: '2,000+', label: 'Happy Clients' }, { stat: '90+', label: 'Services' }, { stat: '6+', label: 'Expert Stylists' }, { stat: '2', label: 'Branches' }]
              .map(({ stat, label }) => (
                <div key={label} className="text-center">
                  <p className="text-3xl md:text-4xl font-serif text-[#B76E79] mb-2">{stat}</p>
                  <p className="text-xs uppercase tracking-widest opacity-50">{label}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: Signature Services */}
      <section className="py-32 px-6 relative z-10 bg-[#0d0d0d]">
        <div ref={setRef(1)} className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">Our Specialities</p>
            <h2 className="text-5xl md:text-6xl font-serif font-light">Signature <span className="italic text-[#B76E79]">Services</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SIGNATURE_SERVICES.map((svc) => (
              <div key={svc.name} className="glass-card p-8 rounded-2xl group hover:border-[rgba(183,110,121,0.3)] transition-all duration-500">
                <div className="text-[#B76E79] text-2xl mb-4">{svc.icon}</div>
                <h3 className="text-xl font-serif mb-3 group-hover:text-[#B76E79] transition-colors">{svc.name}</h3>
                <p className="text-sm opacity-50 font-light leading-relaxed mb-6">{svc.desc}</p>
                <div className="flex items-center justify-between">
                  <p className="text-[#B76E79] text-sm font-medium">{svc.price}</p>
                  <Link href="/book" className="text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity hover:text-[#B76E79]">Book →</Link>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/services" className="inline-block px-10 py-4 border border-[rgba(183,110,121,0.3)] text-[#F5EFE7] rounded-full hover:border-[#B76E79] hover:text-[#B76E79] transition-all text-xs tracking-widest uppercase">
              View All 90+ Services
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 4: Meet the Artisans */}
      <section className="py-32 px-6 relative z-10">
        <div ref={setRef(2)} className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">The Masters</p>
            <h2 className="text-5xl md:text-6xl font-serif font-light">Meet the <span className="italic text-[#B76E79]">Artisans</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STYLISTS.map((stylist) => (
              <div key={stylist.name} className="glass-card p-6 rounded-2xl group hover:border-[rgba(183,110,121,0.3)] transition-all duration-300">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[rgba(183,110,121,0.3)] to-[rgba(183,110,121,0.05)] border border-[rgba(183,110,121,0.2)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="font-serif text-2xl text-[#B76E79]">{stylist.name[0]}</span>
                </div>
                <h3 className="font-serif text-lg mb-1">{stylist.name}</h3>
                <p className="text-xs text-[#B76E79] mb-3">{stylist.role}</p>
                <p className="text-xs opacity-50">{stylist.speciality}</p>
                <p className="text-xs opacity-30 mt-2">{stylist.exp} Experience</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/team" className="inline-block px-10 py-4 border border-[rgba(183,110,121,0.3)] text-[#F5EFE7] rounded-full hover:border-[#B76E79] hover:text-[#B76E79] transition-all text-xs tracking-widest uppercase">
              Meet the Full Team
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 5: Gallery */}
      <section className="py-32 px-6 relative z-10 hidden md:block">
        <div ref={setRef(6)} className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">Our Work</p>
            <h2 className="text-5xl md:text-6xl font-serif font-light">The <span className="italic text-[#B76E79]">Gallery</span></h2>
          </div>
          <div className="grid grid-cols-3 gap-4 auto-rows-[250px]">
            {/* Using colored placeholders representing luxury imagery, since we don't have real images yet */}
            <div className="col-span-2 row-span-2 rounded-2xl bg-gradient-to-br from-[rgba(183,110,121,0.2)] to-[#0d0d0d] border border-[rgba(183,110,121,0.1)] flex items-end p-6 hover:border-[rgba(183,110,121,0.4)] transition-all">
              <p className="font-serif text-xl">Bridal Makeover</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-bl from-[rgba(183,110,121,0.1)] to-[#0d0d0d] border border-[rgba(183,110,121,0.1)] flex items-end p-6 hover:border-[rgba(183,110,121,0.4)] transition-all">
              <p className="font-serif">Balayage Color</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-tr from-[rgba(183,110,121,0.15)] to-[#0d0d0d] border border-[rgba(183,110,121,0.1)] flex items-end p-6 hover:border-[rgba(183,110,121,0.4)] transition-all">
              <p className="font-serif">Precision Cut</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-tl from-[rgba(183,110,121,0.1)] to-[#0d0d0d] border border-[rgba(183,110,121,0.1)] flex items-end p-6 hover:border-[rgba(183,110,121,0.4)] transition-all">
              <p className="font-serif">Keratin Smooth</p>
            </div>
            <div className="col-span-2 rounded-2xl bg-gradient-to-r from-[rgba(183,110,121,0.2)] to-[#0d0d0d] border border-[rgba(183,110,121,0.1)] flex items-end p-6 hover:border-[rgba(183,110,121,0.4)] transition-all">
              <p className="font-serif text-xl">Luxury Hair Spa</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 6: Locations */}
      <section className="py-32 px-6 relative z-10">
        <div ref={setRef(3)} className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">Find Us</p>
            <h2 className="text-5xl md:text-6xl font-serif font-light">Our <span className="italic text-[#B76E79]">Locations</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { name: 'Parvatinagar Branch', address: 'Beside Basua Bhawan, Parvatinagar, Police Gymkhana', phone: '07899711400', hours: 'Mon–Sat: 9am – 8pm' },
              { name: 'Ashok Nagar Branch', address: "Infantry Road, Near Wine World, Opp Levi's Showroom", phone: '07259375492', hours: 'Mon–Sun: 9am – 9pm' },
            ].map((branch) => (
              <div key={branch.name} className="glass-card p-8 rounded-2xl">
                <h3 className="text-xl font-serif mb-2">{branch.name}</h3>
                <p className="text-sm opacity-50 mb-4">{branch.address}</p>
                <p className="text-xs opacity-40 mb-2">{branch.hours}</p>
                <div className="flex gap-4 mt-6">
                  <a href={`tel:${branch.phone}`} className="flex-1 text-center py-2 border border-[rgba(183,110,121,0.3)] rounded-full text-xs hover:border-[#B76E79] hover:text-[#B76E79] transition-all">Call</a>
                  <Link href="/book" className="flex-1 text-center py-2 bg-[rgba(183,110,121,0.15)] border border-[rgba(183,110,121,0.3)] rounded-full text-xs text-[#B76E79] hover:bg-[#B76E79] hover:text-[#0d0d0d] transition-all">Book Here</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: Google Reviews */}
      <section className="py-32 px-6 relative z-10">
        <div ref={setRef(4)} className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-6">What Clients Say</p>
            <h2 className="text-5xl md:text-6xl font-serif font-light">
              Google <span className="italic text-[#B76E79]">Reviews</span>
            </h2>
          </div>
          {/* Google Reviews embed for Hair X Studio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Embedded Google Maps with reviews for Parvatinagar Branch */}
            <div className="rounded-2xl overflow-hidden glass-card">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3764.0!2d76.9213!3d15.1394!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zHair+X+Studio!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                width="100%"
                height="300"
                style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg)' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Hair X Studio - Parvatinagar Branch"
              />
            </div>
            <div className="glass-card p-8 rounded-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-3xl">⭐</div>
                  <div>
                    <p className="text-2xl font-serif text-[#B76E79]">4.8 / 5</p>
                    <p className="text-xs opacity-50 uppercase tracking-wider">Based on Google Reviews</p>
                  </div>
                </div>
                <p className="text-sm opacity-60 leading-relaxed mb-6">
                  Read our genuine customer reviews on Google Maps — we never moderate or filter feedback. Every rating you see is real.
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <a
                  href="https://www.google.com/maps/search/Hair+X+Studio+Parvatinagar+Ballari"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-white text-[#1a1a1a] rounded-xl font-medium text-sm hover:bg-[#F5EFE7] transition-colors"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M43.6 20.5H24V28H35.4C34.1 31.7 30.5 34.4 24 34.4C17.1 34.4 11.6 28.9 11.6 22S17.1 9.6 24 9.6c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.4 4.1 29.5 2 24 2 12.4 2 3 11.4 3 23s9.4 21 21 21c11.2 0 20-7.9 20-21 0-1.3-.1-2.5-.4-3.5z" fill="#4285F4"/>
                    <path d="M6.3 14.3l6.6 4.8C14.6 15.3 18.9 12 24 12c3.2 0 6.1 1.2 8.3 3.2l5.7-5.7C34.4 5.1 29.5 3 24 3 16.3 3 9.7 7.7 6.3 14.3z" fill="#EA4335"/>
                    <path d="M24 45c5.4 0 10.2-1.8 13.9-4.9l-6.4-5.3C29.5 36.6 26.9 37.5 24 37.5c-6.4 0-11.9-4.3-13.8-10.1l-6.6 5.1C7.2 40.5 15 45 24 45z" fill="#34A853"/>
                    <path d="M43.6 20.5H24V28h11.4C34.5 31.1 32.6 33.5 30 35.0l6.4 5.3C40.2 37.0 44 31 44 24c0-1.2-.1-2.4-.4-3.5z" fill="#FBBC05"/>
                  </svg>
                  View Reviews on Google
                </a>
                <a
                  href="https://g.page/r/hairxstudio/review"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 border border-[rgba(183,110,121,0.3)] text-[#B76E79] rounded-xl text-sm hover:bg-[rgba(183,110,121,0.1)] transition-colors"
                >
                  ✍️ Leave a Review
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: Booking CTA */}
      <section className="py-40 px-6 text-center relative overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0d0d0d] via-[#1a0a0d] to-[#0d0d0d] pointer-events-none" />
        <div ref={setRef(5)} className="relative max-w-3xl mx-auto glass-card p-12 md:p-20 rounded-3xl border border-[rgba(183,110,121,0.2)]">
          <p className="text-[#B76E79] uppercase tracking-[0.4em] text-xs mb-8">Ready?</p>
          <h2 className="text-5xl md:text-7xl font-serif font-light mb-8 drop-shadow-lg text-[#F5EFE7]">
            Book your<br /><span className="italic text-[#B76E79]">appointment.</span>
          </h2>
          <p className="opacity-50 mb-12 font-light max-w-lg mx-auto">
            Choose your services, stylist, branch and time — all in a few elegant steps.
          </p>
          <Link href="/book" className="inline-block px-16 py-5 bg-[#B76E79] text-[#0d0d0d] font-medium tracking-[0.3em] uppercase text-sm rounded-full hover:bg-[#F5EFE7] hover:shadow-[0_0_40px_rgba(183,110,121,0.4)] transition-all duration-500">
            Book Now
          </Link>
        </div>
      </section>


      {/* FOOTER */}
      <footer className="border-t border-[rgba(183,110,121,0.1)] py-12 px-6 relative z-10 bg-[#0d0d0d]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <p className="font-serif text-xl text-[#F5EFE7]">Hair X Studio</p>
            <p className="text-xs opacity-40 mt-1">Luxury Hair & Beauty · Ballari</p>
          </div>
          <div className="flex gap-8 text-xs uppercase tracking-widest opacity-50">
            <Link href="/services" className="hover:text-[#B76E79] hover:opacity-100 transition-colors">Services</Link>
            <Link href="/team" className="hover:text-[#B76E79] hover:opacity-100 transition-colors">Team</Link>
            <Link href="/locations" className="hover:text-[#B76E79] hover:opacity-100 transition-colors">Locations</Link>
            <Link href="/book" className="hover:text-[#B76E79] hover:opacity-100 transition-colors">Book</Link>
            <Link href="/admin" className="hover:text-[#B76E79] hover:opacity-100 transition-colors">Admin</Link>
          </div>
          <p className="text-xs opacity-30">© 2025 Hair X Studio. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
