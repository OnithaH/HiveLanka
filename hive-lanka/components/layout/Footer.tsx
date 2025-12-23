import Link from 'next/link';
import Image from 'next/image';
import { Linkedin, Instagram, Twitter, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-brand-section">
              <h3 className="footer-brand">
                Hive Lanka <span className="footer-tagline">by Vision Stack</span>
              </h3>
            </div>
            
            <div className="footer-social">
              <h4>Follow Us On :</h4>
              <div className="social-content">
                <div className="footer-logo">
                  <Image 
                    src="/images/logo.png" 
                    alt="Hive Lanka Logo" 
                    width={200}
                    height={200}
                    className="footer-logo-img"
                  />
                </div>
                <div className="social-links">
                  <a href="#" className="social-link">
                    <Linkedin className="social-icon" style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }} />
                    lk. hive_lanka. com
                  </a>
                  <a href="#" className="social-link">
                    <Instagram className="social-icon" style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }} />
                    @hive_lanka
                  </a>
                  <a href="#" className="social-link">
                    <Twitter className="social-icon" style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }} />
                    #hive_lanka
                  </a>
                  <a href="#" className="social-link">
                    <Facebook className="social-icon" style={{ width: '30px', height: '30px', filter: 'brightness(0) invert(1)' }} />
                    hive_lanka
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Contact Info</h4>
            <div className="contact-info">
              <p>• No:  313/17/3 Gonamaditthta road, Piliyandala, Sri Lanka. </p>
              <p>• Phone: +94 112 595 5982</p>
              <p>• hive_lanka@gmail.com</p>
            </div>
          </div>
          
          <div className="footer-section">
            <h4>Stay up to date</h4>
            <p className="newsletter-desc">
              Subscribe to our newsletter to stay up-to-date with the latest news, 
              tips, and trends in the industry
            </p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="newsletter-input"
              />
              <button className="newsletter-button">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}