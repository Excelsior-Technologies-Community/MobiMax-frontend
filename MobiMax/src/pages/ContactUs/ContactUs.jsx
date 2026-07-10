import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Headphones, Send, CheckCircle2 } from 'lucide-react';

const FacebookIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>;
const TwitterIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>;
const InstagramIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>;
const LinkedinIcon = ({ className }) => <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>;

const branches = [
  { 
    name: 'Head Office', 
    address: '3810 Stanley Avenue, Auckland 0632', 
    phone: '516-582-7348', 
    email: 'inbox@mobimax.uk', 
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcyNC4wIk4gNzPCsDU4JzQ4LjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus' 
  },
  { 
    name: 'East Branch', 
    address: '1422 East Boulevard, Sydney 2000', 
    phone: '516-582-7349', 
    email: 'east@mobimax.uk', 
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcyNC4wIk4gNzPCsDU4JzQ4LjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus' 
  },
  { 
    name: 'West Branch', 
    address: '99 West End Road, London W1', 
    phone: '516-582-7350', 
    email: 'west@mobimax.uk', 
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.1!2d-73.98!3d40.75!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM40zMCcyNC4wIk4gNzPCsDU4JzQ4LjAiVw!5e0!3m2!1sen!2sus!4v1620000000000!5m2!1sen!2sus' 
  },
];

const ContactUs = () => {
  const [focusedInput, setFocusedInput] = useState(null);

  return (
    <main className="flex-grow bg-[#fafafa] min-h-screen pb-24 font-sans">
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-[#111] via-[#222] to-[#111] overflow-hidden pt-24 pb-32">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[150%] bg-[#e55b13] opacity-10 blur-[120px] rounded-full rotate-45 transform pointer-events-none"></div>
          <div className="absolute -bottom-[20%] -left-[10%] w-[40%] h-[120%] bg-yellow-400 opacity-5 blur-[100px] rounded-full transform pointer-events-none"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-6 animate-fade-in-up">
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#e55b13] to-yellow-400">Conversation</span>
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed font-light">
              Whether you have a question about our parts, need technical support, or just want to say hi — our team is ready to answer all your questions.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-16 z-20">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Branch Locations */}
          <div className="w-full lg:w-7/12 flex flex-col gap-6">
            {branches.map((branch, idx) => (
              <div 
                key={idx} 
                className="group bg-white rounded-2xl p-6 sm:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] transition-all duration-500 flex flex-col sm:flex-row gap-8 items-center relative overflow-hidden"
              >
                {/* Subtle Hover Gradient */}
                <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#e55b13] to-yellow-400 transform origin-left scale-y-0 group-hover:scale-y-100 transition-transform duration-500 ease-out"></div>

                {/* Map Thumbnail */}
                <div className="w-full sm:w-[220px] h-[160px] rounded-xl overflow-hidden shadow-sm flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
                  <iframe 
                    src={branch.mapUrl}
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen="" 
                    loading="lazy"
                    title={`Map for ${branch.name}`}
                    className="transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  ></iframe>
                </div>

                {/* Details */}
                <div className="flex-grow flex flex-col w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-5 flex items-center">
                    {branch.name}
                    <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Open Now
                    </span>
                  </h3>
                  
                  <div className="space-y-3.5">
                    <div className="flex items-start text-gray-600 group-hover:text-gray-900 transition-colors">
                      <MapPin className="w-5 h-5 text-[#e55b13] mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-[15px] leading-relaxed">{branch.address}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                      <Phone className="w-5 h-5 text-[#e55b13] mr-3 flex-shrink-0" />
                      <span className="text-[15px] font-medium">{branch.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 group-hover:text-gray-900 transition-colors">
                      <Mail className="w-5 h-5 text-[#e55b13] mr-3 flex-shrink-0" />
                      <span className="text-[15px]">{branch.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Contact Form & Info */}
          <div className="w-full lg:w-5/12 flex flex-col gap-8">
            
            {/* Contact Form Card */}
            <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#e55b13]/5 rounded-full blur-3xl pointer-events-none"></div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Send a Message</h3>
              <p className="text-gray-500 mb-8 text-sm">We'll get back to you within 24 hours.</p>

              <form className="space-y-6 relative z-10">
                
                <div className={`relative border-b-2 transition-colors duration-300 ${focusedInput === 'name' ? 'border-[#e55b13]' : 'border-gray-200'}`}>
                  <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedInput === 'name' ? '-top-3 text-xs text-[#e55b13]' : 'top-2 text-sm text-gray-400'}`}>
                    Your Name
                  </label>
                  <input 
                    type="text" 
                    onFocus={() => setFocusedInput('name')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent pt-3 pb-2 focus:outline-none text-gray-900 font-medium"
                  />
                </div>

                <div className={`relative border-b-2 transition-colors duration-300 ${focusedInput === 'email' ? 'border-[#e55b13]' : 'border-gray-200'}`}>
                  <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedInput === 'email' ? '-top-3 text-xs text-[#e55b13]' : 'top-2 text-sm text-gray-400'}`}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    onFocus={() => setFocusedInput('email')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent pt-3 pb-2 focus:outline-none text-gray-900 font-medium"
                  />
                </div>

                <div className={`relative border-b-2 transition-colors duration-300 ${focusedInput === 'message' ? 'border-[#e55b13]' : 'border-gray-200'}`}>
                  <label className={`absolute left-0 transition-all duration-300 pointer-events-none ${focusedInput === 'message' ? '-top-3 text-xs text-[#e55b13]' : 'top-2 text-sm text-gray-400'}`}>
                    How can we help?
                  </label>
                  <textarea 
                    rows={4}
                    onFocus={() => setFocusedInput('message')}
                    onBlur={() => setFocusedInput(null)}
                    className="w-full bg-transparent pt-3 pb-2 focus:outline-none text-gray-900 font-medium resize-none mt-2"
                  ></textarea>
                </div>

                <button 
                  type="button" 
                  className="w-full group relative flex items-center justify-center gap-2 bg-[#111] hover:bg-[#e55b13] text-white font-bold py-4 rounded-xl transition-all duration-300 overflow-hidden shadow-lg hover:shadow-[#e55b13]/30"
                >
                  <span className="relative z-10 tracking-wide uppercase text-sm">Send Message</span>
                  <Send className="w-4 h-4 relative z-10 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300" />
                </button>
              </form>
            </div>

            {/* Premium Call 24/7 Card */}
            <div className="bg-gradient-to-br from-[#111] to-[#222] rounded-2xl p-8 shadow-xl relative overflow-hidden flex items-center gap-6 group cursor-pointer">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 group-hover:opacity-20 transition-opacity"></div>
              
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#e55b13] to-yellow-400 p-[2px] flex-shrink-0 relative z-10">
                <div className="w-full h-full bg-[#111] rounded-full flex items-center justify-center group-hover:bg-transparent transition-colors duration-300">
                  <Headphones className="w-7 h-7 text-white" />
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-gray-400 font-medium text-sm mb-1">Need urgent help?</p>
                <h4 className="font-bold text-white text-2xl mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-[#e55b13] group-hover:to-yellow-400 transition-all duration-300">Call us 24/7</h4>
                <p className="text-gray-300 font-mono text-lg tracking-tight">0141 950 4018</p>
              </div>
            </div>

            {/* Social Links Ribbon */}
            <div className="flex items-center gap-4 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 justify-between">
              <span className="font-bold text-gray-900 text-sm uppercase tracking-wider">Follow Us</span>
              <div className="flex gap-3">
                {[
                  { icon: LinkedinIcon, color: 'hover:bg-[#0077b5]' },
                  { icon: FacebookIcon, color: 'hover:bg-[#3b5998]' },
                  { icon: InstagramIcon, color: 'hover:bg-[#c13584]' },
                  { icon: TwitterIcon, color: 'hover:bg-[#1da1f2]' }
                ].map((social, i) => (
                  <a 
                    key={i} 
                    href="#" 
                    className={`w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:text-white ${social.color} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
                  >
                    <social.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </main>
  );
};

export default ContactUs;
