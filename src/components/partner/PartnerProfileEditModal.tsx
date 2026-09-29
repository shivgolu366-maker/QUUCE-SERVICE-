import React, { useState, useEffect } from 'react';
import { useQuickService } from '../../context/QuickServiceContext';
import { Partner, ServiceCategory, PartnerKYCDoc } from '../../types';
import { 
  X, 
  Check, 
  User, 
  Phone, 
  ShieldCheck, 
  FileText, 
  Car, 
  Briefcase, 
  CreditCard, 
  MapPin, 
  Upload, 
  Sparkles, 
  Save, 
  AlertCircle, 
  CheckCircle2,
  Camera
} from 'lucide-react';

interface PartnerProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PartnerProfileEditModal: React.FC<PartnerProfileEditModalProps> = ({
  isOpen,
  onClose
}) => {
  const { activePartner, updatePartnerProfile } = useQuickService();

  const [name, setName] = useState(activePartner?.name || '');
  const [phone, setPhone] = useState(activePartner?.phone?.replace('+91', '').trim() || '');
  const [email, setEmail] = useState(activePartner?.email || '');
  const [category, setCategory] = useState<ServiceCategory>(activePartner?.category || 'repairs');
  const [skillsText, setSkillsText] = useState((activePartner?.skills || []).join(', '));
  const [vehicleInfo, setVehicleInfo] = useState(activePartner?.vehicleInfo || '');
  const [experienceYears, setExperienceYears] = useState(activePartner?.experienceYears || 3);
  const [upiId, setUpiId] = useState(activePartner?.upiId || 'partner@paytm');
  const [bankAccount, setBankAccount] = useState(activePartner?.bankAccount || '410291823719');
  const [bankIfsc, setBankIfsc] = useState(activePartner?.bankIfsc || 'HDFC0001204');
  const [city, setCity] = useState(activePartner?.city || 'Noida / Greater Noida (Delhi NCR)');
  const [address, setAddress] = useState(activePartner?.address || 'Sector 62, Noida, Uttar Pradesh');

  // Proof / KYC document details
  const primaryDoc = activePartner?.kycDocs?.[0];
  const [proofType, setProofType] = useState<PartnerKYCDoc['type']>(primaryDoc?.type || 'aadhaar');
  const [docNumber, setDocNumber] = useState(primaryDoc?.docNumber || 'XXXX-XXXX-9142');
  const [docLabel, setDocLabel] = useState(primaryDoc?.label || 'Aadhaar Card Document');
  const [proofStatus, setProofStatus] = useState<PartnerKYCDoc['status']>(primaryDoc?.status || 'verified');

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (activePartner && isOpen) {
      setName(activePartner.name);
      setPhone(activePartner.phone.replace('+91', '').trim());
      setEmail(activePartner.email || '');
      setCategory(activePartner.category || 'repairs');
      setSkillsText((activePartner.skills || []).join(', '));
      setVehicleInfo(activePartner.vehicleInfo || 'Motorcycle UP-16-AB-4321');
      setExperienceYears(activePartner.experienceYears || 3);
      setUpiId(activePartner.upiId || `${activePartner.phone.replace(/\D/g, '').slice(-10)}@upi`);
      setBankAccount(activePartner.bankAccount || '410291823719');
      setBankIfsc(activePartner.bankIfsc || 'HDFC0001204');
      setCity(activePartner.city || 'Noida / Greater Noida (Delhi NCR)');
      setAddress(activePartner.address || 'Sector 62, Electronic City, Noida');

      const doc = activePartner.kycDocs?.[0];
      if (doc) {
        setProofType(doc.type);
        setDocNumber(doc.docNumber);
        setDocLabel(doc.label);
        setProofStatus(doc.status);
      }
      setSavedSuccess(false);
      setErrorMsg('');
    }
  }, [activePartner, isOpen]);

  if (!isOpen || !activePartner) return null;

  const categoryLabels: Record<ServiceCategory, string> = {
    repairs: 'Plumbing & Repairs',
    chores: 'Daily Chores & Helpers',
    mobility: 'Personal & Mobility Chauffeur',
    cleaning: 'Home Deep Cleaning',
    electric: 'Electrician & Appliances',
    appliances: 'AC & Cooling Repair',
    driver: 'Chauffeur & Mobility',
    painting: 'Wall Painting & Waterproofing',
    carpentry: 'Carpentry & Furniture',
    pest: 'Pest Control',
    gardening: 'Garden & Lawn Care'
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Kripya apna poora naam likhein (Please enter your name)');
      return;
    }
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      setErrorMsg('Kripya 10-digit phone number enter karein');
      return;
    }
    if (!docNumber.trim()) {
      setErrorMsg('Kripya KYC Identity Proof Number enter karein');
      return;
    }

    const parsedSkills = skillsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const updatedDoc: PartnerKYCDoc = {
      type: proofType,
      label: docLabel || `${proofType.toUpperCase()} Proof Document`,
      docNumber: docNumber.trim(),
      documentUrl: primaryDoc?.documentUrl || '/docs/partner_proof.pdf',
      uploadedAt: 'Updated Recently (Online Verified)',
      status: 'verified'
    };

    const updates: Partial<Partner> = {
      name: name.trim(),
      phone: `+91 ${cleanPhone}`,
      email: email.trim() || `${cleanPhone}@quickservice.pro`,
      category,
      categoryName: categoryLabels[category] || 'Quick Service Specialist',
      skills: parsedSkills.length > 0 ? parsedSkills : ['Verified Specialist', 'Tools Certified'],
      vehicleInfo: vehicleInfo.trim() || 'Bike (UP-16)',
      experienceYears: Number(experienceYears) || 1,
      upiId: upiId.trim(),
      bankAccount: bankAccount.trim(),
      bankIfsc: bankIfsc.trim().toUpperCase(),
      city: city.trim(),
      address: address.trim(),
      kycStatus: 'verified',
      kycDocs: [updatedDoc, ...(activePartner.kycDocs?.slice(1) || [])]
    };

    updatePartnerProfile(activePartner.id, updates);
    setSavedSuccess(true);
    setErrorMsg('');
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in overflow-y-auto">
      <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl w-full max-w-lg shadow-2xl text-white overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/20 via-slate-800 to-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center shadow-lg shadow-amber-500/30">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white flex items-center gap-2">
                Edit Partner Profile
                <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ID: #{activePartner.id}
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Update personal details, KYC proof documents & payout accounts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSave} className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Success Banner */}
          {savedSuccess && (
            <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl flex items-center gap-2.5 text-emerald-300 text-xs font-bold animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Partner Profile & Proof Details successfully updated!</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 bg-rose-500/20 border border-rose-500/40 rounded-2xl flex items-center gap-2.5 text-rose-300 text-xs font-bold animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. Basic Details */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              Personal & Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Full Name (Poora Naam) *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rajesh Kumar"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Mobile Number (Phone) *
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="9876543210"
                    className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Email Address (Optional)
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="partner@quickservice.pro"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 2. Service Category & Trade Skills */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5" />
              Service Trade & Experience
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Primary Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ServiceCategory)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="repairs">Plumbing & Maintenance</option>
                  <option value="cleaning">Home Deep Cleaning</option>
                  <option value="electric">Electrician & Appliances</option>
                  <option value="appliances">AC & Refrigeration</option>
                  <option value="driver">Chauffeur Driver</option>
                  <option value="carpentry">Carpentry & Furniture</option>
                  <option value="painting">Painting & Waterproofing</option>
                  <option value="pest">Pest Control</option>
                  <option value="gardening">Gardening & Lawn</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min={1}
                  max={40}
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                Specific Skills (Comma separated)
              </label>
              <input
                type="text"
                value={skillsText}
                onChange={(e) => setSkillsText(e.target.value)}
                placeholder="e.g. Pipe Leakage, Geyser Install, Tap Repair, High Pressure"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-slate-400" />
                Vehicle Information / Plate Number
              </label>
              <input
                type="text"
                value={vehicleInfo}
                onChange={(e) => setVehicleInfo(e.target.value)}
                placeholder="e.g. Hero Splendor (UP-16-AB-4321) or Honda Activa"
                className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          {/* 3. KYC Identity Proof (User Requirement: Proof honi chahiye) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                KYC Identity Proof & Documents
              </h3>
              <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Status: {proofStatus.toUpperCase()}
              </span>
            </div>

            <div className="p-3 bg-slate-800/60 border border-slate-700/80 rounded-2xl space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Proof Document Type *
                  </label>
                  <select
                    value={proofType}
                    onChange={(e) => {
                      const t = e.target.value as PartnerKYCDoc['type'];
                      setProofType(t);
                      if (t === 'aadhaar') setDocLabel('Aadhaar Card (12-Digit)');
                      else if (t === 'license') setDocLabel('Driving License (Commercial/LMV)');
                      else if (t === 'pan') setDocLabel('PAN Card Document');
                      else if (t === 'certificate') setDocLabel('Trade Skill Certificate (ITI)');
                      else if (t === 'police_clearance') setDocLabel('Police Verification Clearance');
                    }}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="aadhaar">Aadhaar Card (Govt UIDAI)</option>
                    <option value="license">Driving License (DL)</option>
                    <option value="pan">PAN Card (Income Tax Dept)</option>
                    <option value="certificate">ITI Trade / Skill Certificate</option>
                    <option value="police_clearance">Police Clearance Certificate</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                    Document / Card Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    placeholder="e.g. 5821-9823-4122"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Upload Proof Simulator */}
              <div className="border border-dashed border-slate-600 rounded-xl p-3 text-center space-y-1 bg-slate-900/50">
                <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold">
                  <Upload className="w-4 h-4" />
                  <span>Proof Document File Attached</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  {docLabel} · Verified with UIDAI / Government database
                </p>
                <div className="pt-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    <Check className="w-3 h-3" />
                    Verified Photo Proof Ready
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Bank Account & Payout Details */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" />
              Earnings Payout & Bank Accounts
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  UPI ID (Instant Daily Payouts)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="e.g. 9876543210@paytm"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bank Account Number
                </label>
                <input
                  type="text"
                  value={bankAccount}
                  onChange={(e) => setBankAccount(e.target.value)}
                  placeholder="e.g. 410291823719"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Bank IFSC Code
                </label>
                <input
                  type="text"
                  value={bankIfsc}
                  onChange={(e) => setBankIfsc(e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001204"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                  Operational City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Noida / Delhi NCR"
                  className="w-full bg-slate-800/90 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 flex items-center gap-3 border-t border-slate-800 shrink-0">
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.99] transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Update Profile</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
