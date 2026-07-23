import React, { useState, useEffect } from 'react';
import { MessageSquare, Clock, CheckCircle2, Search, Mail, Phone, User } from 'lucide-react';

const PartnerMessages = () => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch('http://localhost:5001/api/partners/contacts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const result = await response.json();
      if (result.status === 'success') {
        setMessages(result.data);
      } else {
        setError(result.message || 'Failed to fetch messages');
      }
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('An error occurred while fetching messages');
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('partnerToken') || sessionStorage.getItem('partnerToken');
      const response = await fetch(`http://localhost:5001/api/partners/contacts/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      const result = await response.json();
      if (result.status === 'success') {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
      }
    } catch (err) {
      console.error('Error updating message status:', err);
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h2 className="text-lg font-black text-[#1e272e] uppercase tracking-wide">Store Messages</h2>
            <p className="text-sm text-gray-500 font-medium">Customer inquiries from your store page</p>
          </div>
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search messages..." className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] outline-none transition-all" />
          </div>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-20 flex justify-center">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#e26a1b]"></div>
            </div>
          ) : error ? (
            <div className="py-12 text-center text-red-500 font-bold bg-red-50 rounded-2xl">{error}</div>
          ) : messages.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center">
              <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-xl font-black text-[#1e272e] mb-2 uppercase">No Messages Yet</h3>
              <p className="text-gray-500 max-w-sm">When customers contact you from your store page, their messages will appear here.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`p-5 rounded-2xl border transition-all duration-300 ${msg.status === 'unread' ? 'bg-[#fff9f5] border-[#ffe0cc]' : 'bg-white border-gray-100'}`}>
                  <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                    
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 shrink-0">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-black text-gray-900 text-lg flex items-center gap-2">
                          {msg.name}
                          {msg.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#e55039]"></span>}
                        </h4>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-1">
                          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> <a href={`mailto:${msg.email}`} className="hover:text-[#e26a1b] hover:underline">{msg.email}</a></span>
                          {msg.phone && <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> <a href={`tel:${msg.phone}`} className="hover:text-[#e26a1b] hover:underline">{msg.phone}</a></span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-start md:self-auto">
                      <span className="text-xs font-bold text-gray-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {new Date(msg.created_at).toLocaleDateString()}
                      </span>
                      {msg.status === 'unread' ? (
                        <button 
                          onClick={() => markAsRead(msg.id)}
                          className="px-3 py-1.5 bg-white border border-gray-200 hover:border-[#e26a1b] hover:text-[#e26a1b] rounded-lg text-xs font-black uppercase tracking-wider transition-colors shadow-sm"
                        >
                          Mark as Read
                        </button>
                      ) : (
                        <span className="inline-flex items-center text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Read
                        </span>
                      )}
                    </div>

                  </div>
                  
                  <div className="pl-14">
                    <div className="bg-white p-4 rounded-xl text-gray-700 text-sm leading-relaxed border border-gray-100 shadow-sm relative">
                      <div className="absolute top-4 -left-2 w-4 h-4 bg-white border-t border-l border-gray-100 transform -rotate-45"></div>
                      {msg.message}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PartnerMessages;
