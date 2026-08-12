import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Scissors,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Upload,
  Ruler,
  Calendar,
  MessageCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { buildWhatsAppLink } from '../config/brand';
import { submitCustomSewingRequest } from '../services/submissionService';

interface CustomSewingPageProps {
  onNavigate: (path: string) => void;
}

export const CustomSewingPage: React.FC<CustomSewingPageProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Form State
  const [garmentType, setGarmentType] = useState<string>('Dress');
  const [designDescription, setDesignDescription] = useState<string>('');
  const [colorPreference, setColorPreference] = useState<string>('');
  const [fabricPreference, setFabricPreference] = useState<string>('');
  const [styleNotes, setStyleNotes] = useState<string>('');
  
  // Measurements
  const [bust, setBust] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [height, setHeight] = useState('');
  const [provideMeasurementsLater, setProvideMeasurementsLater] = useState(false);

  // Images & Dates
  const [inspirationImages, setInspirationImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [eventDate, setEventDate] = useState('');

  // Contact Details
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // Submission & Confirmation State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  const [error, setError] = useState('');

  const garmentOptions = [
    { label: 'Dress', description: 'Gowns, Midi Column Dresses, Corseted Silhouettes' },
    { label: 'Two-Piece', description: 'Tailored Suits, Blazer & Trouser Sets, Skirt Sets' },
    { label: 'Traditional', description: 'Iro & Buba, Aso Ebi, Contemporary Cultural Attire' },
    { label: 'Bridal', description: 'Wedding Gowns, Reception Dresses, Bridal Shower Wear' },
    { label: 'Occasion Wear', description: 'Gala Gowns, Milestone Celebration Attire' },
    { label: 'Other', description: 'Custom Tops, Wraps, or Special Concept Creations' },
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      window.scrollTo({ top: 200, behavior: 'smooth' });
    }
  };

  const addSampleImage = () => {
    if (newImageUrl.trim()) {
      setInspirationImages([...inspirationImages, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    setInspirationImages(inspirationImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await submitCustomSewingRequest({
        garmentType: garmentType as any,
        designDescription,
        colorPreference,
        fabricPreference,
        styleNotes,
        measurements: {
          bust,
          waist,
          hips,
          height,
          scheduleSession: provideMeasurementsLater,
        },
        inspirationImages,
        eventDate,
        customerName,
        email: customerEmail,
        phone: customerPhone,
      });

      setIsSubmitting(false);
      setTrackingCode(response.request.trackingCode);
      setIsSubmitted(true);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err?.message || 'Failed to submit request. Please try again.');
    }
  };

  const whatsappMsg = `Hello Lumora, I have submitted a bespoke request (${trackingCode || 'New Custom Order'}). Garment: ${garmentType}. Customer: ${customerName}.`;
  const whatsappUrl = buildWhatsAppLink(whatsappMsg);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#A88963]/20 border border-[#A88963]/40 text-[10px] uppercase tracking-[0.3em] text-[#A88963]">
          <Scissors className="w-3.5 h-3.5" />
          <span>Lumora Bespoke Service</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl text-[#171513] font-normal">
          Made For You.
        </h1>
        <p className="text-sm font-light text-[#171513]/80 leading-relaxed font-serif italic">
          Every Lumora custom piece is sculpted to your exact measurements with hand-selected fabrics and artisan finishes.
        </p>
      </div>

      {!isSubmitted ? (
        <div className="bg-[#F7F3EC] border border-[#A88963]/30 p-6 sm:p-10 shadow-lg space-y-8">
          
          {/* Progress Indicator */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-[#A88963] font-medium">
              <span>Step {currentStep} of {totalSteps}</span>
              <span>
                {currentStep === 1 && 'Garment Selection'}
                {currentStep === 2 && 'Design Description'}
                {currentStep === 3 && 'Style & Fabrics'}
                {currentStep === 4 && 'Measurements'}
                {currentStep === 5 && 'Inspiration Upload'}
                {currentStep === 6 && 'Timeline & Event'}
                {currentStep === 7 && 'Contact Information'}
                {currentStep === 8 && 'Review & Submit'}
              </span>
            </div>
            
            <div className="w-full h-1.5 bg-[#E8DED0] overflow-hidden">
              <div
                className="h-full bg-[#A88963] transition-all duration-500 ease-out"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content Steps */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* STEP 1: Garment Type */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        What would you like us to create?
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Select the primary category for your custom piece.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {garmentOptions.map((opt) => (
                        <div
                          key={opt.label}
                          onClick={() => setGarmentType(opt.label)}
                          className={`p-4 border cursor-pointer transition-all ${
                            garmentType === opt.label
                              ? 'border-[#171513] bg-[#171513] text-[#F7F3EC]'
                              : 'border-[#E8DED0] bg-white text-[#171513] hover:border-[#A88963]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-serif text-lg">{opt.label}</span>
                            {garmentType === opt.label && <CheckCircle2 className="w-4 h-4 text-[#A88963]" />}
                          </div>
                          <p className={`text-xs mt-1 font-light ${garmentType === opt.label ? 'text-[#E8DED0]/80' : 'text-[#171513]/60'}`}>
                            {opt.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 2: Design Details */}
                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Tell us about your design vision
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Describe the silhouette, neckline, drape, or special elements you envision.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-2">
                        Design Description *
                      </label>
                      <textarea
                        rows={5}
                        required
                        value={designDescription}
                        onChange={(e) => setDesignDescription(e.target.value)}
                        placeholder="e.g., I want an off-shoulder floor-length gown with an asymmetric pleat at the hip, high slit on the left, and internal waist support..."
                        className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 3: Style and Preferences */}
                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Style & Material Preferences
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Select your preferred colors and fabrics.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-2">
                          Color Preference
                        </label>
                        <input
                          type="text"
                          value={colorPreference}
                          onChange={(e) => setColorPreference(e.target.value)}
                          placeholder="e.g., Obsidian Black, Gold/Muted Bronze, Emerald"
                          className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-2">
                          Fabric Preference
                        </label>
                        <input
                          type="text"
                          value={fabricPreference}
                          onChange={(e) => setFabricPreference(e.target.value)}
                          placeholder="e.g., Corded French Lace, 40mm Mulberry Silk, Velvet"
                          className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-2">
                        Additional Fitting Notes
                      </label>
                      <input
                        type="text"
                        value={styleNotes}
                        onChange={(e) => setStyleNotes(e.target.value)}
                        placeholder="e.g., Preferred corset stiffness, modest lining, or dance-friendly skirt..."
                        className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: Measurements */}
                {currentStep === 4 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Body Measurements (Inches or CM)
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Provide your current measurements or choose to schedule a virtual/in-studio fitting later.
                      </p>
                    </div>

                    <div className="bg-[#E8DED0]/40 p-3 border-l-2 border-[#A88963] flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#A88963]" />
                        <span className="text-xs font-medium text-[#171513]">
                          Schedule measurement session later?
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={provideMeasurementsLater}
                        onChange={(e) => setProvideMeasurementsLater(e.target.checked)}
                        className="w-4 h-4 accent-[#A88963] cursor-pointer"
                      />
                    </div>

                    {!provideMeasurementsLater && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                            Bust
                          </label>
                          <input
                            type="text"
                            value={bust}
                            onChange={(e) => setBust(e.target.value)}
                            placeholder="e.g., 36 in"
                            className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                            Waist
                          </label>
                          <input
                            type="text"
                            value={waist}
                            onChange={(e) => setWaist(e.target.value)}
                            placeholder="e.g., 28 in"
                            className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                            Hips
                          </label>
                          <input
                            type="text"
                            value={hips}
                            onChange={(e) => setHips(e.target.value)}
                            placeholder="e.g., 40 in"
                            className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                            Height
                          </label>
                          <input
                            type="text"
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            placeholder="e.g., 5 ft 8 in"
                            className="w-full bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* STEP 5: Inspiration Images */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Inspiration & Reference Images
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Add sample photo URLs or reference links to guide our design atelier.
                      </p>
                    </div>

                    {/* Image Previews */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                      {inspirationImages.map((img, idx) => (
                        <div key={idx} className="relative aspect-square border border-[#E8DED0] group">
                          <img src={img} alt="Inspiration preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL (e.g., Pinterest/Unsplash link)..."
                        className="flex-1 bg-white border border-[#E8DED0] p-2.5 text-sm focus:outline-none focus:border-[#A88963]"
                      />
                      <button
                        type="button"
                        onClick={addSampleImage}
                        className="py-2.5 px-4 bg-[#171513] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#A88963] transition-colors"
                      >
                        Add Link
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 6: Timeline */}
                {currentStep === 6 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Timeline & Event Date
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        When do you need this garment delivered?
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-2">
                        Target Event or Delivery Date
                      </label>
                      <input
                        type="date"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 7: Customer Contact Details */}
                {currentStep === 7 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Your Contact Details
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Where should our lead client advisor send your design proposal and price estimate?
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          placeholder="e.g., Folake Coker"
                          className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
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
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            placeholder="folake@example.com"
                            className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>

                        <div>
                          <label className="block text-xs uppercase tracking-wider text-[#171513]/80 font-medium mb-1">
                            WhatsApp / Phone *
                          </label>
                          <input
                            type="tel"
                            required
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            placeholder="+234 800 000 0000"
                            className="w-full bg-white border border-[#E8DED0] p-3 text-sm focus:outline-none focus:border-[#A88963]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 8: Review & Submit */}
                {currentStep === 8 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171513]">
                        Review Your Custom Request
                      </h2>
                      <p className="text-xs text-[#171513]/70 font-light mt-1">
                        Confirm details before submitting to the Lumora atelier.
                      </p>
                    </div>

                    <div className="bg-white border border-[#E8DED0] p-6 space-y-4 text-xs text-[#171513]">
                      <div className="flex justify-between border-b pb-2">
                        <span className="font-medium uppercase text-[#A88963]">Garment Type:</span>
                        <span className="font-serif italic text-sm">{garmentType}</span>
                      </div>

                      <div className="border-b pb-2">
                        <span className="font-medium uppercase text-[#A88963] block mb-1">Design Vision:</span>
                        <p className="font-light">{designDescription || 'Not specified'}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4 border-b pb-2">
                        <div>
                          <span className="font-medium uppercase text-[#A88963] block">Color:</span>
                          <span>{colorPreference || 'Atelier Recommendation'}</span>
                        </div>
                        <div>
                          <span className="font-medium uppercase text-[#A88963] block">Fabric:</span>
                          <span>{fabricPreference || 'Lumora Silk/Lace'}</span>
                        </div>
                      </div>

                      <div className="border-b pb-2">
                        <span className="font-medium uppercase text-[#A88963] block">Client Contact:</span>
                        <span>{customerName} • {customerEmail} • {customerPhone}</span>
                      </div>
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 border-l-2 border-red-500 text-xs text-red-700">
                        {error}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="pt-8 border-t border-[#E8DED0] flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="py-3 px-6 border border-[#171513] text-[#171513] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#171513] hover:text-[#F7F3EC] transition-colors flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : <div />}

              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="py-3 px-6 bg-[#171513] text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#A88963] transition-colors flex items-center gap-2"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="py-3.5 px-8 bg-[#A88963] text-white text-xs uppercase tracking-[0.25em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center gap-2 shadow-lg"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? 'Transmitting Request...' : 'Submit Custom Request'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      ) : (
        /* Confirmation State */
        <div className="bg-[#171513] text-[#F7F3EC] border border-[#A88963]/30 p-8 sm:p-12 text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#A88963]/20 text-[#A88963] flex items-center justify-center mx-auto border border-[#A88963]/50">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-[10px] uppercase tracking-[0.35em] text-[#A88963] font-medium block">
            Bespoke Request Confirmed
          </span>

          <h2 className="font-serif text-3xl sm:text-4xl text-[#F7F3EC]">
            Thank You, {customerName}
          </h2>

          <div className="inline-block bg-[#F7F3EC]/10 border border-[#A88963]/30 py-2 px-6 font-mono text-sm text-[#A88963]">
            Tracking Reference: <span className="text-white font-bold">{trackingCode}</span>
          </div>

          <p className="text-sm font-light text-[#E8DED0]/80 max-w-lg mx-auto leading-relaxed">
            Your custom sewing request for a <span className="font-serif italic text-white">{garmentType}</span> has been logged with our Lagos atelier. Our senior bespoke coordinator will contact you via WhatsApp or Email within 24 hours to schedule your fitting consultation.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-3.5 px-6 bg-[#A88963] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#8C6D48] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Connect on WhatsApp Now</span>
            </a>

            <button
              onClick={() => onNavigate('/')}
              className="py-3.5 px-6 border border-[#E8DED0]/40 text-[#F7F3EC] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#F7F3EC] hover:text-[#171513] transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
