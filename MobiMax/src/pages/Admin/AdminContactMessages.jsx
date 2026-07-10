import React, { useState, useEffect } from 'react';
import { Mail, CheckCircle, Search, Clock, Reply, Send, X, CornerDownRight } from 'lucide-react';

const AdminContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5001/api/admin/contact-messages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      setMessages(data.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/admin/contact-messages/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'read' })
      });
      if (response.ok) {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const submitReply = async (id) => {
    if (!replyText.trim()) return;
    
    setSubmittingReply(true);
    try {
      const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5001/api/admin/contact-messages/${id}/reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ replyMessage: replyText })
      });
      
      if (response.ok) {
        setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'replied', reply: replyText } : msg));
        setReplyingTo(null);
        setReplyText('');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to send reply');
      }
    } catch (error) {
      console.error('Error sending reply:', error);
      alert('Network error while sending reply');
    } finally {
      setSubmittingReply(false);
    }
  };

  const filteredMessages = messages.filter(msg => 
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and view messages from the contact form</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="relative w-72">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] transition-all text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading messages...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : filteredMessages.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="h-16 w-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
              <Mail className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No messages found</h3>
            <p className="text-gray-500 mt-1">There are no contact messages matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-medium">Sender</th>
                  <th className="px-6 py-4 font-medium">Message</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((msg) => (
                  <React.Fragment key={msg.id}>
                    <tr className={`hover:bg-gray-50 transition-colors ${msg.status === 'unread' ? 'bg-orange-50/30' : ''}`}>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{msg.name}</div>
                        <div className="text-sm text-gray-500">{msg.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 max-w-md line-clamp-2">{msg.message}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {new Date(msg.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                          msg.status === 'unread' ? 'bg-orange-100 text-orange-800 border border-orange-200' : 
                          msg.status === 'replied' ? 'bg-green-100 text-green-800 border border-green-200' : 
                          'bg-gray-100 text-gray-600 border border-gray-200'
                        }`}>
                          {msg.status === 'unread' ? 'Unread' : msg.status === 'replied' ? 'Replied' : 'Read'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-3">
                        {msg.status === 'unread' && (
                          <button 
                            onClick={() => markAsRead(msg.id)}
                            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Read
                          </button>
                        )}
                        {msg.status !== 'replied' && (
                          <button 
                            onClick={() => {
                              setReplyingTo(replyingTo === msg.id ? null : msg.id);
                              setReplyText('');
                            }}
                            className="inline-flex items-center text-sm font-medium text-[#e26a1b] hover:text-[#c95a14] transition-colors"
                          >
                            <Reply className="w-4 h-4 mr-1" />
                            Reply
                          </button>
                        )}
                      </td>
                    </tr>

                    {/* Reply Section / Existing Reply Display */}
                    {(replyingTo === msg.id || msg.reply) && (
                      <tr className="bg-gray-50/50">
                        <td colSpan="5" className="px-6 py-4 border-t-0">
                          <div className="pl-6 border-l-2 border-[#e26a1b] ml-2">
                            
                            {/* If there's an existing reply, show it */}
                            {msg.reply && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                                <div className="flex items-center gap-2 mb-2 text-sm font-bold text-gray-900">
                                  <CornerDownRight className="w-4 h-4 text-[#e26a1b]" />
                                  Your Reply
                                </div>
                                <p className="text-gray-700 text-sm whitespace-pre-wrap">{msg.reply}</p>
                              </div>
                            )}

                            {/* If currently replying, show reply form */}
                            {replyingTo === msg.id && !msg.reply && (
                              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mt-2">
                                <div className="flex justify-between items-center mb-3">
                                  <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Reply className="w-4 h-4 text-[#e26a1b]" />
                                    Reply to {msg.name}
                                  </h4>
                                  <button onClick={() => setReplyingTo(null)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                                <textarea
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply here. This will be sent as an email."
                                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#e26a1b]/20 focus:border-[#e26a1b] resize-none"
                                  rows={4}
                                ></textarea>
                                <div className="mt-3 flex justify-end">
                                  <button
                                    onClick={() => submitReply(msg.id)}
                                    disabled={submittingReply || !replyText.trim()}
                                    className="flex items-center gap-2 bg-[#e26a1b] hover:bg-[#c95a14] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                                  >
                                    {submittingReply ? 'Sending...' : 'Send Reply'}
                                    {!submittingReply && <Send className="w-4 h-4" />}
                                  </button>
                                </div>
                              </div>
                            )}

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContactMessages;
