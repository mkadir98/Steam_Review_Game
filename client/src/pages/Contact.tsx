import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../utils/api';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success('Message sent successfully! We will get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try emailing us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-4">Get in Touch</h1>
        <p className="text-gray-400 text-lg">
          Have questions, feedback, or want to join our team? We'd love to hear from you!
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-800 rounded-2xl p-8 border border-slate-700 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-steam-blue"
                placeholder="What's this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message *
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={6}
                className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-steam-blue resize-none"
                placeholder="Tell us what's on your mind..."
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-steam-blue to-blue-600 hover:from-blue-600 hover:to-steam-blue text-white font-bold py-3 rounded-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Sending...
                </span>
              ) : (
                'Send Message'
              )}
            </button>
          </form>
        </motion.div>

        {/* Contact Info & Moderator Recruitment */}
        <div className="space-y-6">
          {/* Direct Email */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 border border-purple-500/50 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">📧</span>
              <h3 className="text-2xl font-bold text-white">Email Us Directly</h3>
            </div>
            <p className="text-gray-300 mb-4">
              Prefer email? You can reach us directly at:
            </p>
            <a 
              href="mailto:mkadir98@hotmail.com"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 px-6 py-3 rounded-xl transition-colors border border-slate-600"
            >
              <span className="text-steam-blue text-lg font-semibold">mkadir98@hotmail.com</span>
              <svg className="w-5 h-5 text-steam-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </motion.div>

          {/* Moderator Recruitment */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-green-600/20 to-teal-600/20 border border-green-500/50 rounded-2xl p-8 shadow-xl"
          >
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-4xl">🎮</span>
              <h3 className="text-2xl font-bold text-white">Join Our Team!</h3>
            </div>
            <div className="space-y-3 mb-6">
              <p className="text-gray-300 font-semibold">
                Looking for Volunteer Moderators
              </p>
              <p className="text-gray-400">
                We're seeking passionate multilingual gamers to help review and moderate Steam review submissions in different languages. 
                This is a <span className="text-yellow-400 font-semibold">volunteer position</span>.
              </p>
              <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                <p className="text-sm text-gray-400 mb-2">What we're looking for:</p>
                <ul className="space-y-1 text-sm text-gray-300">
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Fluent in English + one or more languages (French, Spanish, German, Italian)</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Active Steam user with gaming knowledge</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Available for a few hours per week to review submissions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="text-green-400">✓</span>
                    <span>Detail-oriented and reliable</span>
                  </li>
                </ul>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3">
                <p className="text-yellow-400 text-xs font-semibold flex items-center space-x-2">
                  <span>💡</span>
                  <span>Volunteer Position - Help us expand to more languages!</span>
                </p>
              </div>
            </div>
            <a
              href="mailto:mkadir98@hotmail.com?subject=Volunteer Moderator Application"
              className="block text-center bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg"
            >
              Apply as Volunteer Moderator
            </a>
          </motion.div>

          {/* Response Time */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-slate-800 rounded-xl p-6 border border-slate-700"
          >
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-2xl">⏱️</span>
              <h4 className="text-lg font-semibold text-white">Response Time</h4>
            </div>
            <p className="text-gray-400 text-sm">
              We typically respond within 24-48 hours. For urgent matters, please include "URGENT" in your subject line.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

