import React from 'react';
import { Mail, Phone, Clock, ChevronUp } from 'lucide-react';

const YoutubeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>;
const FacebookIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const InstagramIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;
const SkypeIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 17.5A4.5 4.5 0 0 1 17.5 22c-1 0-1.9-.3-2.6-.8-1 .4-2.1.7-3.4.7-5.5 0-10-4.5-10-10 0-1.3.3-2.4.7-3.4A4.5 4.5 0 0 1 2 4.5C2 2 4 0 6.5 0c1 0 1.9.3 2.6.8 1-.4 2.1-.7 3.4-.7 5.5 0 10 4.5 10 10 0 1.3-.3 2.4-.7 3.4.5.7.8 1.6.8 2.6z"/><path d="M16 14.5c0 1.9-1.8 3-4.5 3-2 0-3.5-.7-3.5-1.5 0-.5.5-.8 1-.8.9 0 1.3.7 2.5.7 1.5 0 2.2-.4 2.2-1 0-.6-.6-1-2.5-1.5-2.5-.6-3.5-1.6-3.5-3C7.7 8.2 9.5 7 11.5 7c1.7 0 3 .6 3 1.5 0 .5-.4.8-.8.8-.7 0-1.2-.5-2.2-.5-1 0-1.8.3-1.8 1 0 .5.5 1 2 1.4 2.7.7 4.3 1.5 4.3 3.3z"/></svg>;


const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full relative z-10">
      
      {/* Cyan Banner */}
      <div className="bg-[#00c2c2] relative z-20 mt-16">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row items-center h-auto md:h-[105px] relative">
          
          <div className="hidden md:block w-[200px] h-full relative shrink-0">
             <img 
               src="https://enovathemes.com/mobimax/wp-content/uploads/footer_consultant.png" 
               alt="Consultant"
               className="absolute bottom-0 left-4 h-[160px] lg:h-[180px] w-auto object-contain object-bottom pointer-events-none"
             />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center flex-1 py-6 md:py-0 text-center md:text-left pr-0 md:pr-12">
            <p className="text-white text-[19px] font-medium mb-4 md:mb-0 md:mr-3">
              Can't find what you're looking for? Call us now on{' '}
              <span className="font-bold text-[26px] mx-1 align-middle tracking-tight">0141 950 4018</span>{' '}
              or
            </p>
            <a href="/contact" className="bg-[#ffe600] hover:bg-[#e6cc00] text-black font-extrabold text-[13px] px-7 py-3.5 rounded-[3px] uppercase tracking-wide transition-colors whitespace-nowrap ml-1">
              ENQUIRE ONLINE
            </a>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-[#222222] py-16">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row gap-10">
          
          {/* Column 1: Logo & Info */}
          <div className="md:w-1/3 pr-4">
            <div className="mb-6">
              <span className="text-[#e26a1b] font-bold text-3xl">Mobi</span><span className="text-white font-bold text-3xl">Max</span>
            </div>
            <p className="text-[#999999] text-[15px] leading-relaxed mb-8 pr-4">
              We work on market over 20 years. We sale only original auto parts and gained confidence of 320k + clients. Buy from MobiMax, join our big community.
            </p>
            <button className="bg-white hover:bg-gray-100 text-black font-bold text-[13px] px-8 py-3.5 rounded-[3px] uppercase tracking-wide transition-colors">
              FIND LOCATIONS
            </button>
          </div>

          {/* Column 2: Customer Services */}
          <div className="md:w-1/5">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-wider mb-6 pb-3 border-b border-[#333333]">Customer Services</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Contact Us</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">FAQs</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Store Locator</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Delivery Information</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Returns & Refunds</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Product Recall</a></li>
            </ul>
          </div>

          {/* Column 3: About Us */}
          <div className="md:w-1/5">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-wider mb-6 pb-3 border-b border-[#333333]">About Us</h4>
            <ul className="flex flex-col gap-3">
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Site map</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Careers</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Affiliate</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">News</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Partners</a></li>
              <li><a href="#" className="text-[#999999] hover:text-[#e26a1b] text-[14px] transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Column 4: Contacts */}
          <div className="md:w-[26%]">
            <h4 className="text-white font-bold text-[13px] uppercase tracking-wider mb-6 pb-3 border-b border-[#333333]">Contacts</h4>
            
            <div className="flex flex-col gap-5 mb-8">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-[#e26a1b] mr-4 shrink-0 mt-0.5" />
                <span className="text-[#dddddd] text-[15px]">support@mobimax.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-[#e26a1b] mr-4 shrink-0 mt-0.5" />
                <span className="text-[#dddddd] text-[15px]">070 5159 1537</span>
              </div>
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-[#e26a1b] mr-4 shrink-0 mt-0.5" />
                <div className="text-[#dddddd] text-[15px] leading-relaxed">
                  Mon. - Sat.<br />10:00 am - 20:00 pm
                </div>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex gap-1.5 flex-wrap">
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#cd201f] text-white rounded-sm hover:opacity-85 transition-opacity">
                <YoutubeIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#0077b5] text-white rounded-sm hover:opacity-85 transition-opacity">
                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#3b5998] text-white rounded-sm hover:opacity-85 transition-opacity">
                <FacebookIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#c13584] text-white rounded-sm hover:opacity-85 transition-opacity">
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#1da1f2] text-white rounded-sm hover:opacity-85 transition-opacity">
                <TwitterIcon className="w-4 h-4" />
              </a>
              <a href="#" className="w-[34px] h-[34px] flex items-center justify-center bg-[#00aff0] text-white rounded-sm hover:opacity-85 transition-opacity">
                <SkypeIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Footer Area */}
      <div className="bg-[#111111] py-6 relative">
        <div className="max-w-[1200px] mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[#888888] text-[13px]">
          <div>
            MobiMax.com ©1995- 2019 | MobiMax, Inc. All Rights Reserved.
          </div>
          <div className="mt-4 md:mt-0 flex items-center pr-12">
             <img src="https://enovathemes.com/mobimax/wp-content/uploads/security_payment-1.jpg" alt="Security Payments" className="h-[30px]" />
          </div>
        </div>
        
        {/* Scroll to top button */}
        <button 
          onClick={scrollToTop}
          className="absolute right-8 bottom-6 w-10 h-10 bg-[#e26a1b] hover:bg-[#c95b14] text-white flex items-center justify-center rounded-sm transition-colors"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      </div>

    </footer>
  );
};

export default Footer;
