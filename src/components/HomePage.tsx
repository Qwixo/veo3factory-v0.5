import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles.css';

export default function HomePage() {
  // FAQ dropdown state
  const [selectedFaq, setSelectedFaq] = useState('');
  
  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({
    hours: '23',
    minutes: '47',
    seconds: '33'
  });

  // Screenshots gallery state
  const [isScrolling, setIsScrolling] = useState(false);
  const galleryRef = useRef<HTMLDivElement>(null);

  // Countdown timer effect
  useEffect(() => {
    const now = new Date().getTime();
    const endTime = now + (24 * 60 * 60 * 1000); // 24 hours from now
    
    const timer = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeLeft = endTime - currentTime;
      
      if (timeLeft <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: '00', minutes: '00', seconds: '00' });
        return;
      }
      
      const hours = Math.floor(timeLeft / (1000 * 60 * 60));
      const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
      
      setTimeLeft({
        hours: hours.toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        seconds: seconds.toString().padStart(2, '0')
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Screenshots gallery functions
  const handleGalleryMouseDown = (e: React.MouseEvent) => {
    if (!galleryRef.current) return;
    
    setIsScrolling(true);
    const startX = e.pageX - galleryRef.current.offsetLeft;
    const scrollLeft = galleryRef.current.scrollLeft;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!galleryRef.current || !isScrolling) return;
      e.preventDefault();
      const x = e.pageX - galleryRef.current.offsetLeft;
      const walk = (x - startX) * 2;
      galleryRef.current.scrollLeft = scrollLeft - walk;
    };
    
    const handleMouseUp = () => {
      setIsScrolling(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const scrollGallery = (direction: 'left' | 'right') => {
    if (!galleryRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    galleryRef.current.scrollLeft += scrollAmount;
  };

  const handleScreenshotClick = (link?: string) => {
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVideoPlaceholderClick = () => {
    console.log('Video placeholder clicked - ready for video integration');
  };

  const handleFaqChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedFaq(e.target.value);
  };

  const screenshots = [
    { src: "https://i.imgur.com/UiDY9Tm.jpeg", alt: "TikTok Success Story 1", link: "https://www.tiktok.com/@getsocialwithab" },
    { src: "https://i.imgur.com/qVInXF9.jpeg", alt: "TikTok Success Story 2", link: "https://www.tiktok.com/@euph0r_" },
    { src: "https://i.imgur.com/MWQh3nO.jpeg", alt: "TikTok Success Story 3", link: "https://www.tiktok.com/@getsocialwithab" },
    { src: "https://i.imgur.com/LPYcnue.jpeg", alt: "TikTok Success Story 4", link: "https://www.tiktok.com/@slovakaibot" },
    { src: "https://i.imgur.com/V0YjfsM.jpeg", alt: "TikTok Success Story 5", link: "https://www.tiktok.com/@panda.herbert" },
    { src: "https://i.imgur.com/ikXM0S0.jpeg", alt: "TikTok Success Story 6", link: "https://www.tiktok.com/@sneznyclovek" },
    { src: "https://i.imgur.com/sbUHsPO.jpeg", alt: "TikTok Success Story 7", link: "https://www.tiktok.com/@hanyys__" },
    { src: "https://i.imgur.com/sWNqvo5.jpeg", alt: "TikTok Success Story 8", link: "https://www.tiktok.com/@mesiaczabavy" },
    { src: "https://i.imgur.com/9zJGHSI.jpeg", alt: "TikTok Success Story 9", link: "https://www.tiktok.com/@pjacefilms" },
    { src: "https://i.imgur.com/9qtQCnF.jpeg", alt: "TikTok Success Story 10", link: "https://www.tiktok.com/@ai_shorts_sk" },
    { src: "https://i.imgur.com/hJNEGMT.jpeg", alt: "TikTok Success Story 11", link: "https://www.tiktok.com/@Gonko0" },
    { src: "https://i.imgur.com/UjB5Ppf.jpeg", alt: "Instagram Success Story 1", link: "https://www.instagram.com/ai_mazinggg/" },
    { src: "https://i.imgur.com/sNmJx6Q.jpeg", alt: "Instagram Success Story 2", link: "https://www.instagram.com/tomlikesrobots/" },
    { src: "https://i.imgur.com/icKxXWx.jpeg", alt: "Instagram Success Story 3", link: "https://www.instagram.com/caquinhoia/" },
    { src: "https://i.imgur.com/4fUTqfi.jpeg", alt: "Instagram Success Story 4", link: "https://www.instagram.com/pabloprompt/" },
    { src: "https://i.imgur.com/hdYGC6V.jpeg", alt: "Instagram Success Story 5", link: "https://www.instagram.com/tomlikesrobots/" },
    { src: "https://i.imgur.com/TZ4Rha5.jpeg", alt: "Instagram Success Story 6", link: "https://www.instagram.com/world.ai.asmr/" },
    { src: "https://i.imgur.com/wwHzVsi.jpeg", alt: "Instagram Success Story 7", link: "https://www.instagram.com/ai.sources/" },
    { src: "https://i.imgur.com/7C6gGYf.jpeg", alt: "Instagram Success Story 8", link: "https://www.instagram.com/pov__sensei/" },
    { src: "https://i.imgur.com/FivCbwT.jpeg", alt: "Success Story 20" },
    { src: "https://i.imgur.com/vipESJP.jpeg", alt: "Success Story 21" }
  ];

  const faqData = [
    {
      id: '1',
      question: '1. Do I need to know how to code?',
      answer: 'Nope. You don\'t need to write a single line of code. The system is pre-built. You just connect your accounts using copy-paste API keys — we show you how.'
    },
    {
      id: '2',
      question: '2. What do I actually get?',
      answer: 'You get a fully automated video content factory inside n8n. It creates stunning AI reels using Veo 3, GROK, GPT, and auto-posts them to TikTok, Instagram, or YouTube — without you touching anything.'
    },
    {
      id: '3',
      question: '3. What is n8n?',
      answer: 'n8n is the platform where your automation runs. Think of it like a smart robot that follows instructions 24/7. You don\'t need to build anything inside it — the whole workflow is already done for you.'
    },
    {
      id: '4',
      question: '4. Is this plug-and-play?',
      answer: 'Yes, once you connect your own AI keys (we guide you), the system runs by itself. You don\'t need to design prompts, schedule posts, or generate videos — it handles all of that.'
    },
    {
      id: '5',
      question: '5. What if I don\'t have Veo 3 or GROK?',
      answer: 'You\'ll need to create your own accounts for Veo 3, GROK 4, and GPT. We\'ll show you where to get them and how to paste in your keys. It\'s quick and only needs to be done once.'
    },
    {
      id: '6',
      question: '6. How often does it post?',
      answer: 'Every 8 hours by default — you can change this easily in one setting. It auto-generates new, unique AI reels each time.'
    },
    {
      id: '7',
      question: '7. What kind of content does it make?',
      answer: 'It makes highly aesthetic ASMR-style CGI videos of fruit-shaped objects being split open in artistic ways — all generated by AI. These videos are hypnotic, satisfying, and optimized for virality.'
    },
    {
      id: '8',
      question: '8. Can I customize the videos?',
      answer: 'You can customize the style, objects, posting frequency, or even the audio prompts — if you want to. But it works great out-of-the-box.'
    },
    {
      id: '9',
      question: '9. Where does it post?',
      answer: 'TikTok, Instagram, and YouTube Shorts. It\'s already wired to connect to Postiz, the tool that schedules and publishes your content.'
    },
    {
      id: '10',
      question: '10. What if I get stuck?',
      answer: 'We provide a full setup guide and can assist you during onboarding. Most users are up and running in under 30 minutes.'
    },
    {
      id: '11',
      question: '11. Why do I need my own API keys?',
      answer: 'To stay in control. Your content, your accounts, your data. We don\'t run anything through shared keys — it\'s safer and more scalable this way.'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Yellow Cross */}
      <div className="yellow-cross">
        <svg width="24" height="32" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 0H14V10H24V14H14V32H10V14H0V10H10V0Z" fill="#FFD700"/>
        </svg>
      </div>
      
      {/* Section 1: Introduction Video */}
      <section className="hero-section">
        <div className="container">
          <h1 className="hero-headline">
            Turn <span className="highlight">VEO 3 INTO VIRAL GOLD</span><br />
            While You Sleep
          </h1>
          
          <div className="video-container">
            <div className="video-placeholder" onClick={handleVideoPlaceholderClick}>
              <div className="play-button">
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <circle cx="40" cy="40" r="40" fill="#FFD700"/>
                  <path d="M32 24L56 40L32 56V24Z" fill="#000000"/>
                </svg>
              </div>
              <p className="video-text">Watch the 2-minute demo</p>
            </div>
          </div>
          
          <p className="hero-subtext">
            The complete AI system that creates and posts viral ASMR videos to TikTok, Instagram & YouTube — automatically, every 8 hours.
          </p>
          
          <Link to="/checkout" className="cta-button primary">
            GET VIRAL AUTOMATION NOW
          </Link>
        </div>
      </section>

      {/* Section 2: Example Use Cases */}
      <section className="use-cases-section section-bg-blue">
        <div className="container">
          <h2 className="section-headline">
            <span>AI CONTENT <span className="highlight">SIMPLY WORKS</span></span>
          </h2>
          
          <div className="screenshots-gallery-container">
            <div 
              className="screenshots-gallery" 
              ref={galleryRef}
              onMouseDown={handleGalleryMouseDown}
              style={{ cursor: isScrolling ? 'grabbing' : 'grab' }}
            >
              {/* Render screenshots twice for infinite scroll effect */}
              {[...screenshots, ...screenshots].map((screenshot, index) => (
                <div 
                  key={index}
                  className="screenshot-item" 
                  onClick={() => handleScreenshotClick(screenshot.link)}
                >
                  <img src={screenshot.src} alt={screenshot.alt} loading="lazy" />
                </div>
              ))}
            </div>
            <div className="gallery-navigation">
              <button 
                className="nav-button nav-button-left" 
                onClick={() => scrollGallery('left')}
              >
                ‹
              </button>
              <button 
                className="nav-button nav-button-right" 
                onClick={() => scrollGallery('right')}
              >
                ›
              </button>
            </div>
          </div>
          
          <Link to="/checkout" className="cta-button secondary" style={{ marginTop: '32px' }}>
            LET AI GROW YOUR SOCIALS
          </Link>
        </div>
      </section>

      {/* Section 3: Social Proof */}
      <section className="social-proof-section section-bg-purple">
        <div className="container">
          <h2 className="section-headline">
            <span className="highlight">SUCCESS STORIES</span> & TESTIMONIALS
          </h2>
          
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"Made $2,847 in my first month just from the followers this system brought me. The videos are hypnotic!"</p>
              <div className="profile">
                <div className="avatar">MK</div>
                <div className="info">
                  <strong>@MariaK_Creates</strong>
                  <span>47.2K TikTok followers</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"This is pure gold. My videos consistently hit 50K+ views. The setup took me 20 minutes."</p>
              <div className="profile">
                <div className="avatar">DJ</div>
                <div className="info">
                  <strong>@DigitalJake</strong>
                  <span>89.1K Instagram followers</span>
                </div>
              </div>
            </div>
            
            <div className="testimonial-card">
              <div className="stars">★★★★★</div>
              <p>"6 figures in 4 months. The AI creates content that people can't stop watching. Incredible."</p>
              <div className="profile">
                <div className="avatar">SC</div>
                <div className="info">
                  <strong>@SarahCreates</strong>
                  <span>156.8K YouTube subscribers</span>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/checkout" className="cta-button accent">
            JOIN THE SUCCESS STORIES
          </Link>
        </div>
      </section>

      {/* Section 4: Video Use Case */}
      <section className="video-usecase-section section-bg-green">
        <div className="container">
          <h2 className="section-headline">
            <span className="highlight">WATCH IT WORK</span> IN REAL-TIME
          </h2>
          
          <div className="video-container large">
            <div className="video-placeholder" onClick={handleVideoPlaceholderClick}>
              <div className="play-button">
                <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
                  <circle cx="50" cy="50" r="50" fill="#FFD700"/>
                  <path d="M40 30L70 50L40 70V30Z" fill="#000000"/>
                </svg>
              </div>
              <p className="video-text">See the complete system in action</p>
            </div>
          </div>
          
          <p className="section-description">
            Watch how the AI generates stunning ASMR videos, optimizes them for virality, and automatically posts them to your social accounts while you focus on scaling your business.
          </p>
          
          <Link to="/checkout" className="cta-button primary">
            GET YOUR VIRAL SYSTEM NOW
          </Link>
        </div>
      </section>

      {/* Section 5: FOMO Section */}
      <section className="fomo-section">
        <div className="container">
          <h2 className="section-headline">
            <span className="highlight">LAST CHANCE</span> WARNING
          </h2>
          
          <div className="fomo-content">
            <div className="price-comparison">
              <div className="old-price">
                <span className="label">Market Price</span>
                <span className="price">$2,000</span>
                <div className="strikethrough"></div>
              </div>
              <div className="new-price">
                <span className="label">RIGHT NOW</span>
                <span className="price highlight">$97</span>
              </div>
            </div>
            
            <div className="fomo-text">
              <p className="urgency-text">
                These AI systems are being sold for <strong>$2,000</strong> because they are new to the market.
              </p>
              <p className="value-prop">
                <span className="highlight">RIGHT NOW:</span> you get the full setup + bonuses for just <strong>$97.</strong>
              </p>
              <p className="social-proof">
                Others are already making <strong>thousands of dollars</strong> using Veo 3 automation pack, while you are here hesitating.
              </p>
              <p className="final-warning">
                Install now. This rollout <span className="highlight">ends SOON</span>, and it won't come back.
              </p>
            </div>
            
            <div className="countdown-timer">
              <div className="timer-label">Offer expires in:</div>
              <div className="timer-display">
                <div className="time-unit">
                  <span>{timeLeft.hours}</span>
                  <label>Hours</label>
                </div>
                <div className="time-unit">
                  <span>{timeLeft.minutes}</span>
                  <label>Minutes</label>
                </div>
                <div className="time-unit">
                  <span>{timeLeft.seconds}</span>
                  <label>Seconds</label>
                </div>
              </div>
            </div>
          </div>
          
          <Link to="/checkout" className="cta-button urgent">
            SECURE VEO 3 NOW - $97
          </Link>
        </div>
      </section>

      {/* Section 6: FAQ */}
      <section className="faq-section section-bg-dark-blue">
        <div className="container">
          <h2 className="section-headline">
            <span className="highlight">LIMITED TIME OFFER</span> - FINAL DETAILS
          </h2>
          
          <div className="faq-container">
            <h3 className="faq-title">❓ Frequently Asked Questions</h3>
            
            <div className="faq-dropdown">
              <select 
                className="faq-select" 
                value={selectedFaq} 
                onChange={handleFaqChange}
              >
                <option value="">Select a question...</option>
                {faqData.map((faq) => (
                  <option key={faq.id} value={faq.id}>
                    {faq.question}
                  </option>
                ))}
              </select>
              
              <div className="faq-answers">
                {faqData.map((faq) => (
                  <div 
                    key={faq.id}
                    className={`faq-answer-item ${selectedFaq === faq.id ? 'active' : ''}`}
                  >
                    <h4>{faq.question}</h4>
                    <p>{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <Link to="/checkout" className="cta-button final">
            CLAIM YOUR AUTOMATION SYSTEM
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="checkout-footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-left">
              <p>&copy; 2025 Veo3Factory. All rights reserved.</p>
              <p className="footer-attribution">
                website made by <a href="https://inventdigitallimited.com" target="_blank" rel="noopener noreferrer">Invent Limited</a>
              </p>
            </div>
            <div className="footer-right">
              <div className="footer-links">
                <a href="privacy-policy.html">Privacy Policy</a>
                <a href="cookie-policy.html">Cookie Policy</a>
                <a href="legal-disclosure.html">Legal Disclosure</a>
                <a href="terms-conditions.html">Terms & Conditions</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}