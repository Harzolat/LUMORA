import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, MessageCircle, Send } from 'lucide-react';
import { Product, Material } from '../../types';
import { buildWhatsAppLink } from '../../config/brand';
import { submitProductInquiry } from '../../services/submissionService';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Product | Material | null;
}

export const InquiryModal: React.FC<InquiryModalProps> = ({
  isOpen,
  onClose,
  item,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !item) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email, and WhatsApp/Phone number.');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const itemType = 'clothingCategory' in item ? 'product' : 'material';
      await submitProductInquiry({
        itemType,
        itemId: item.id,
        productId: item.id,
        productName: item.name,
        customerName: name,
        email,
        phone,
        question,
      });

      setIsSubmitting(false);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to submit inquiry. Please try again.');
    }
  };

  const resetAndClose = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setPhone('');
    setQuestion('');
    setError('');
    onClose();
  };

  const directWhatsappMsg = `Hello Lumora, I am inquiring about "${item.name}". Name: ${name || 'Inquirer'}, Question: ${question || 'I would like more information on pricing and custom fitting.'}`;
  const directWhatsappUrl = buildWhatsAppLink(directWhatsappMsg);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={resetAndClose}
          className="fixed inset-0 bg-[#171513]/70 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg bg-[#F7F3EC] text-[#171513] p-6 sm:p-8 shadow-2xl z-10 border border-[#A88963]/30"
        >
          {/* Close button */}
          <button
            onClick={resetAndClose}
            className="absolute top-5 right-5 text-[#171513]/60 hover:text-[#171513] transition-colors p-1"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>

          {!isSubmitted ? (
            <div>
              <div className="mb-6 border-b border-[#E8DED0] pb-4">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#A88963] font-medium block">
                  Private Atelier Inquiry
                </span>
                <h3 className="font-serif text-2xl text-[#171513] mt-1">
                  Inquire About This Piece
                </h3>
                <div className="mt-3 flex items-center gap-3 bg-[#E8DED0]/50 p-2.5 rounded-none border-l-2 border-[#A88963]">
                  <img
                    src={item.images[0]}
                    alt={item.name}
                    className="w-12 h-14 object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-medium text-[#171513] line-clamp-1">
                      {item.name}
                    </h4>
                    <p className="text-xs text-[#171513]/70 capitalize font-light">
                      {'clothingCategory' in item
                        ? item.clothingCategory
                        : item.category}{' '}
                      • {item.availability}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border-l-2 border-red-500 text-xs text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Amina Bello"
                    className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="amina@example.com"
                      className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                      WhatsApp / Phone *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234 800 000 0000"
                      className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                    Associated Piece
                  </label>
                  <input
                    type="text"
                    disabled
                    value={item.name}
                    className="w-full bg-[#E8DED0]/30 border border-[#E8DED0] p-2.5 text-sm text-[#171513]/70 font-mono cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                    Specific Question / Custom Fitting Notes
                  </label>
                  <textarea
                    rows={3}
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Ask about pricing, fabric feel, size recommendations, or event timeline..."
                    className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963] transition-colors"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 px-4 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Sending Inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Inquiry</span>
                      </>
                    )}
                  </button>

                  {directWhatsappUrl && (
                    <a
                      href={directWhatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-3 px-4 border border-[#171513] text-[#171513] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#A88963]" />
                      <span>WhatsApp Directly</span>
                    </a>
                  )}
                </div>
              </form>
            </div>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#A88963]/10 text-[#A88963] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-2xl text-[#171513]">
                Inquiry Received
              </h3>
              <p className="text-sm font-light text-[#171513]/80 max-w-sm mx-auto">
                Thank you, <span className="font-medium">{name}</span>. Our Lumora atelier client advisor will review your request for <span className="font-serif italic">{item.name}</span> and respond via email or WhatsApp within 24 hours.
              </p>

              <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                {directWhatsappUrl && (
                  <a
                    href={directWhatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-6 bg-[#A88963] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Connect on WhatsApp Now</span>
                  </a>
                )}

                <button
                  onClick={resetAndClose}
                  className="py-3 px-6 border border-[#171513] text-[#171513] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

