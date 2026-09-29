import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Booking, 
  Partner, 
  CustomerUser, 
  Coupon, 
  EmergencyAlert, 
  ChatMessage, 
  AdminMetrics, 
  ServiceItem,
  TaskAttachment,
  ChecklistItem,
  ServiceCategory
} from '../types';
import { 
  MOCK_CUSTOMER, 
  MOCK_PARTNERS, 
  MOCK_COUPONS, 
  INITIAL_BOOKINGS, 
  SERVICES_CATALOG 
} from '../data/mockData';
import { playIncomingBookingChime, playClaimSuccessChime, playSmsNotificationSound } from '../utils/audioNotify';
import { triggerAppSms } from '../components/common/GlobalSmsNotification';

export type AppViewMode = 'customer' | 'partner' | 'admin' | 'blueprint' | 'flutter' | 'download';

const updateBrowserManifest = (mode: AppViewMode) => {
  if (typeof document === 'undefined') return;
  let link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'manifest';
    document.head.appendChild(link);
  }
  if (mode === 'partner') {
    link.href = '/manifest-partner.json';
  } else if (mode === 'admin') {
    link.href = '/manifest-admin.json';
  } else {
    link.href = '/manifest-customer.json';
  }
};

interface CallState {
  isOpen: boolean;
  partnerOrUserName: string;
  phoneNumber: string;
  avatarUrl: string;
  role: 'partner' | 'customer';
  bookingId: string;
  status: 'calling' | 'connected' | 'ended';
  durationSeconds: number;
  isMuted: boolean;
  isSpeaker: boolean;
}

interface QuickServiceContextType {
  viewMode: AppViewMode;
  setViewMode: (mode: AppViewMode) => void;
  deviceFrame: 'mobile' | 'responsive';
  setDeviceFrame: (frame: 'mobile' | 'responsive') => void;
  
  // Data
  customer: CustomerUser;
  services: ServiceItem[];
  bookings: Booking[];
  partners: Partner[];
  activePartnerId: string;
  setActivePartnerId: (id: string) => void;
  activePartner: Partner;
  availableOpenJobs: Booking[];
  coupons: Coupon[];
  emergencyAlerts: EmergencyAlert[];
  messages: ChatMessage[];
  adminMetrics: AdminMetrics;

  // Active states
  activeBookingId: string | null;
  setActiveBookingId: (id: string | null) => void;
  activeBooking: Booking | null;

  // Actions - Customer
  createBooking: (bookingData: {
    service: ServiceItem;
    selectedSubOptionId?: string;
    bookingType: 'instant' | 'scheduled';
    scheduledDate?: string;
    scheduledTime?: string;
    taskDescription: string;
    attachments: TaskAttachment[];
    checklist?: ChecklistItem[];
    isRecurring?: boolean;
    recurrenceFrequency?: 'weekly' | 'biweekly' | 'monthly';
    packageId?: string;
    packageName?: string;
    couponCode?: string;
    address?: string;
    coords?: [number, number];
    paymentMethod: 'upi' | 'card' | 'wallet' | 'cash';
  }) => string; // returns bookingId
  
  cancelBooking: (bookingId: string, reason?: string) => void;
  submitReview: (bookingId: string, rating: number, tags: string[], comment: string) => void;
  addWalletMoney: (amount: number) => void;
  updateBookingReimbursement: (bookingId: string, data: Partial<Booking>) => void;
  loginCustomer: (name: string, phone: string, email?: string) => void;
  logoutCustomer: () => void;
  verifyCustomerAadhaar: (data: {
    aadhaarNumber: string;
    aadhaarName: string;
    dob?: string;
    gender?: string;
    address?: string;
    docUrl?: string;
  }) => void;
  updateCustomerProfile: (data: Partial<CustomerUser>) => void;
  saveCustomerAddress: (address: CustomerUser['savedAddresses'][0]) => void;
  deleteCustomerAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
  triggerGlobalSms: (phone: string, otp: string, sender?: string) => void;
  isPhoneAuthModalOpen: boolean;
  setIsPhoneAuthModalOpen: (open: boolean) => void;
  phoneAuthRole: 'customer' | 'partner';
  setPhoneAuthRole: (role: 'customer' | 'partner') => void;
  openPhoneAuth: (role?: 'customer' | 'partner') => void;

  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  isAadhaarModalOpen: boolean;
  setIsAadhaarModalOpen: (open: boolean) => void;
  isAddressModalOpen: boolean;
  setIsAddressModalOpen: (open: boolean) => void;
  editingAddress: CustomerUser['savedAddresses'][0] | null;
  setEditingAddress: (addr: CustomerUser['savedAddresses'][0] | null) => void;

  // Mock SMS OTP Service (User Requirement: 6-digit codes to customer and partner phone numbers)
  mockSmsOtpService: {
    lastOtp: string | null;
    lastPhone: string | null;
    lastRole: 'customer' | 'partner' | null;
    deliveryStatus: 'idle' | 'sending' | 'delivered';
    history: { id: string; phone: string; otp: string; role: 'customer' | 'partner'; timestamp: string; sender: string }[];
  };
  sendMockSmsOtp: (phone: string, role: 'customer' | 'partner', customSender?: string) => Promise<{ success: boolean; otp: string; message: string }>;
  verifyMockSmsOtp: (phone: string, otp: string, role?: 'customer' | 'partner') => { success: boolean; message: string };

  // Actions & State - Partner Authentication & Details Edit (User Requirement)
  isPartnerLoggedIn: boolean;
  setIsPartnerLoggedIn: (loggedIn: boolean) => void;
  loginPartnerWithOtp: (phone: string, proofData?: {
    fullName: string;
    category: ServiceCategory;
    proofType: 'aadhaar' | 'license' | 'certificate' | 'police_clearance' | 'pan';
    docNumber: string;
    vehicleInfo?: string;
    experienceYears?: number;
    skills?: string[];
  }) => { success: boolean; partner: Partner; isNew: boolean };
  logoutPartner: () => void;
  updatePartnerProfile: (partnerId: string, updates: Partial<Partner>) => void;
  isPartnerLoginModalOpen: boolean;
  setIsPartnerLoginModalOpen: (open: boolean) => void;
  isPartnerEditModalOpen: boolean;
  setIsPartnerEditModalOpen: (open: boolean) => void;
  togglePartnerOnline: () => void;
  acceptIncomingJob: (bookingId: string) => { success: boolean; message?: string };
  rejectIncomingJob: (bookingId: string) => void;
  updateJobStatus: (bookingId: string, status: Booking['status'], otpCode?: string) => { success: boolean; message?: string };
  withdrawPartnerEarnings: (amount: number) => void;

  // Actions - Admin
  updateSurgeMultiplier: (surge: number) => void;
  updateCommissionRate: (rate: number) => void;
  verifyPartnerKYC: (partnerId: string, docType: string, approve: boolean, reason?: string) => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCoupon: (code: string) => void;
  resolveEmergencyAlert: (alertId: string) => void;
  triggerEmergencySOS: (bookingId: string, triggeredBy: 'customer' | 'partner') => void;

  // In-app calling & chat
  callState: CallState;
  startCall: (name: string, phone: string, avatar: string, role: 'partner' | 'customer', bookingId: string) => void;
  endCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  
  chatBookingId: string | null;
  openChat: (bookingId: string) => void;
  closeChat: () => void;
  sendMessage: (bookingId: string, text: string, sender: 'customer' | 'partner') => void;

  // Incoming Dispatch notification for partner
  incomingJobOffer: Booking | null;
  dismissIncomingJob: () => void;
}

const QuickServiceContext = createContext<QuickServiceContextType | undefined>(undefined);

const getInitialViewMode = (): AppViewMode => {
  if (typeof window !== 'undefined') {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('download') || hash.includes('apps')) return 'download';
    if (hash.includes('partner')) return 'partner';
    if (hash.includes('admin') || hash.includes('developer') || hash.includes('blueprint') || hash.includes('flutter')) return 'admin';
  }
  return 'customer';
};

export const QuickServiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewMode, setViewModeState] = useState<AppViewMode>(() => {
    const initial = getInitialViewMode();
    updateBrowserManifest(initial);
    return initial;
  });
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'responsive'>('mobile');

  // Sync hash changes with viewMode
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      let newMode: AppViewMode = 'customer';
      if (hash.includes('download') || hash.includes('apps')) {
        newMode = 'download';
      } else if (hash.includes('partner')) {
        newMode = 'partner';
      } else if (hash.includes('admin') || hash.includes('developer') || hash.includes('blueprint') || hash.includes('flutter')) {
        newMode = 'admin';
      }
      setViewModeState(newMode);
      updateBrowserManifest(newMode);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const setViewMode = (mode: AppViewMode) => {
    setViewModeState(mode);
    updateBrowserManifest(mode);
    if (typeof window !== 'undefined') {
      if (mode === 'customer') {
        window.location.hash = '#/customer';
      } else if (mode === 'partner') {
        window.location.hash = '#/partner';
      } else if (mode === 'admin') {
        window.location.hash = '#/admin';
      } else if (mode === 'download') {
        window.location.hash = '#/download';
      }
    }
  };

  // Customer
  const [customer, setCustomer] = useState<CustomerUser>(() => {
    const saved = localStorage.getItem('qs_customer');
    return saved ? JSON.parse(saved) : MOCK_CUSTOMER;
  });

  // Services
  const [services] = useState<ServiceItem[]>(SERVICES_CATALOG);

  // Bookings
  const [bookings, setBookings] = useState<Booking[]>(() => {
    try {
      const saved = localStorage.getItem('qs_bookings');
      if (saved) {
        const parsed: Booking[] = JSON.parse(saved);
        // Ensure old mock sample orders QS-89211 and QS-84291 are marked completed so partner isn't blocked
        return parsed.map(b => {
          if ((b.id === 'QS-89211' || b.id === 'QS-84291') && b.status !== 'completed') {
            return { ...b, status: 'completed' as const };
          }
          return b;
        });
      }
    } catch (e) {}
    return INITIAL_BOOKINGS;
  });

  // Active Booking
  const [activeBookingId, setActiveBookingId] = useState<string | null>(null);

  // Partners
  const [partners, setPartners] = useState<Partner[]>(() => {
    const saved = localStorage.getItem('qs_partners');
    return saved ? JSON.parse(saved) : MOCK_PARTNERS;
  });

  // Active Logged-in Partner for Partner View
  const [activePartnerId, setActivePartnerIdState] = useState<string>(() => {
    return localStorage.getItem('qs_active_partner_id') || 'pt-101';
  });

  const setActivePartnerId = (id: string) => {
    setActivePartnerIdState(id);
    localStorage.setItem('qs_active_partner_id', id);
  };

  const activePartner = partners.find(p => p.id === activePartnerId) || partners[0];

  // Partner Authentication & Modal States
  const [isPartnerLoggedIn, setIsPartnerLoggedInState] = useState<boolean>(() => {
    const saved = localStorage.getItem('qs_partner_logged_in');
    return saved !== null ? saved === 'true' : true;
  });

  const setIsPartnerLoggedIn = (val: boolean) => {
    setIsPartnerLoggedInState(val);
    localStorage.setItem('qs_partner_logged_in', String(val));
  };

  const [isPartnerLoginModalOpen, setIsPartnerLoginModalOpen] = useState<boolean>(false);
  const [isPartnerEditModalOpen, setIsPartnerEditModalOpen] = useState<boolean>(false);

  // Mock SMS OTP Service State (Simulates successful delivery of 6-digit codes to customer and partner)
  const [mockSmsOtpService, setMockSmsOtpService] = useState<{
    lastOtp: string | null;
    lastPhone: string | null;
    lastRole: 'customer' | 'partner' | null;
    deliveryStatus: 'idle' | 'sending' | 'delivered';
    history: { id: string; phone: string; otp: string; role: 'customer' | 'partner'; timestamp: string; sender: string }[];
  }>(() => {
    return {
      lastOtp: null,
      lastPhone: null,
      lastRole: null,
      deliveryStatus: 'idle',
      history: []
    };
  });

  // Coupons
  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('qs_coupons');
    return saved ? JSON.parse(saved) : MOCK_COUPONS;
  });

  // Emergency SOS Alerts
  const [emergencyAlerts, setEmergencyAlerts] = useState<EmergencyAlert[]>([
    {
      id: 'sos-1',
      bookingId: 'QS-84291',
      triggeredBy: 'customer',
      userName: 'Aarav Malhotra',
      userPhone: '+91 98201 54321',
      location: 'Lotus Boulevard, Sector 100, Noida',
      coords: [28.5365, 77.3920],
      timestamp: 'Today, 10:15 AM',
      status: 'resolved',
      notes: 'Customer triggered test safety drill; confirmed all okay.'
    }
  ]);

  // Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      bookingId: 'QS-84291',
      sender: 'system',
      senderName: 'Quick Service AI',
      text: 'Booking confirmed! Partner Rajesh Verma is en route. Share OTP 4829 on arrival.',
      timestamp: '10:14 AM'
    },
    {
      id: 'm2',
      bookingId: 'QS-84291',
      sender: 'partner',
      senderName: 'Rajesh Verma (Partner)',
      text: 'Hello sir, I have taken the tools and replacement washer kit. Arriving in ~8 mins. Please keep gate pass ready.',
      timestamp: '10:16 AM'
    },
    {
      id: 'm3',
      bookingId: 'QS-84291',
      sender: 'customer',
      senderName: 'Aarav Malhotra',
      text: 'Thank you! Gate code is #4012.',
      timestamp: '10:17 AM'
    }
  ]);

  // Admin Metrics
  const [adminMetrics, setAdminMetrics] = useState<AdminMetrics>({
    totalRevenue: 348500,
    platformTakeRate: 0.18, // 18% commission
    completedBookingsCount: 1420,
    activeOnlinePartners: 4,
    surgeMultiplier: 1.0,
    autoAssignRadiusKm: 5.0
  });

  // Incoming Job Offer to Partner
  const [incomingJobOffer, setIncomingJobOffer] = useState<Booking | null>(null);

  // Calling state
  const [callState, setCallState] = useState<CallState>({
    isOpen: false,
    partnerOrUserName: '',
    phoneNumber: '',
    avatarUrl: '',
    role: 'partner',
    bookingId: '',
    status: 'calling',
    durationSeconds: 0,
    isMuted: false,
    isSpeaker: false
  });

  // Chat modal state
  const [chatBookingId, setChatBookingId] = useState<string | null>(null);

  // Customer Login, Aadhaar & Address Modal state
  const [isPhoneAuthModalOpen, setIsPhoneAuthModalOpen] = useState<boolean>(false);
  const [phoneAuthRole, setPhoneAuthRole] = useState<'customer' | 'partner'>('customer');
  const openPhoneAuth = (targetRole: 'customer' | 'partner' = 'customer') => {
    setPhoneAuthRole(targetRole);
    setIsPhoneAuthModalOpen(true);
  };

  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [isAadhaarModalOpen, setIsAadhaarModalOpen] = useState<boolean>(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState<boolean>(false);
  const [editingAddress, setEditingAddress] = useState<CustomerUser['savedAddresses'][0] | null>(null);

  // Broadcast helper for cross-tab / cross-window synchronization
  const broadcastCrossTab = (message: any) => {
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        const bc = new BroadcastChannel('quick_service_dispatch_channel');
        bc.postMessage(message);
        bc.close();
      }
    } catch (e) {}
  };

  // Cross-app / Cross-window Real-time Sync
  useEffect(() => {
    let bc: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        bc = new BroadcastChannel('quick_service_dispatch_channel');
        bc.onmessage = (event) => {
          const data = event.data;
          if (!data) return;

          if (data.type === 'NEW_BOOKING_DISPATCH') {
            const newBooking = data.booking as Booking;
            setBookings(prev => {
              if (prev.some(b => b.id === newBooking.id)) return prev;
              return [newBooking, ...prev];
            });
            // Show alert & chime on partner app
            setIncomingJobOffer(newBooking);
            playIncomingBookingChime();
          } else if (data.type === 'BOOKING_CLAIMED') {
            setBookings(prev => prev.map(b => {
              if (b.id === data.bookingId) {
                return {
                  ...b,
                  status: 'assigned',
                  partnerId: data.partnerId,
                  partnerName: data.claimedBy,
                  ...(data.updatedBooking || {})
                };
              }
              return b;
            }));
            // Dismiss incoming modal if it's the one claimed
            setIncomingJobOffer(prev => prev?.id === data.bookingId ? null : prev);
          }
        };
      }
    } catch (e) {}

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'qs_bookings' && e.newValue) {
        try {
          const list = JSON.parse(e.newValue);
          setBookings(list);
        } catch (err) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      bc?.close();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('qs_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('qs_partners', JSON.stringify(partners));
  }, [partners]);

  useEffect(() => {
    localStorage.setItem('qs_customer', JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem('qs_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Call timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (callState.isOpen) {
      if (callState.status === 'calling') {
        timer = setTimeout(() => {
          setCallState(prev => ({ ...prev, status: 'connected' }));
        }, 2500);
      } else if (callState.status === 'connected') {
        timer = setInterval(() => {
          setCallState(prev => ({ ...prev, durationSeconds: prev.durationSeconds + 1 }));
        }, 1000);
      }
    }
    return () => clearInterval(timer);
  }, [callState.isOpen, callState.status]);

  // Live ETA simulation for en_route booking
  useEffect(() => {
    const interval = setInterval(() => {
      setBookings(prev => prev.map(b => {
        if (b.status === 'en_route' && b.etaMinutes > 1) {
          return { ...b, etaMinutes: b.etaMinutes - 1 };
        }
        return b;
      }));
    }, 45000);
    return () => clearInterval(interval);
  }, []);

  const activeBooking = bookings.find(b => b.id === activeBookingId) || null;

  // Actions - Customer
  const createBooking = (bookingData: {
    service: ServiceItem;
    selectedSubOptionId?: string;
    bookingType: 'instant' | 'scheduled';
    scheduledDate?: string;
    scheduledTime?: string;
    taskDescription: string;
    attachments: TaskAttachment[];
    checklist?: ChecklistItem[];
    isRecurring?: boolean;
    recurrenceFrequency?: 'weekly' | 'biweekly' | 'monthly';
    packageId?: string;
    packageName?: string;
    couponCode?: string;
    address?: string;
    coords?: [number, number];
    paymentMethod: 'upi' | 'card' | 'wallet' | 'cash';
  }) => {
    const bookingId = `QS-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    
    // Find sub option price if any
    let price = bookingData.service.basePrice;
    if (bookingData.selectedSubOptionId && bookingData.service.subOptions) {
      const sub = bookingData.service.subOptions.find(s => s.id === bookingData.selectedSubOptionId);
      if (sub) price = sub.price;
    }

    // Apply surge
    const surge = adminMetrics.surgeMultiplier;
    let baseTotal = Math.round(price * surge);

    // Apply coupon
    let discount = 0;
    if (bookingData.couponCode) {
      const c = coupons.find(cp => cp.code === bookingData.couponCode && cp.active);
      if (c && baseTotal >= c.minOrder) {
        discount = Math.min(Math.round((baseTotal * c.discountPercent) / 100), c.maxDiscount);
      }
    }

    const finalAmount = Math.max(0, baseTotal - discount);

    const newBooking: Booking = {
      id: bookingId,
      customerId: customer.id,
      customerName: customer.name,
      customerPhone: customer.phone,
      customerAadhaarVerified: !!customer.isAadhaarVerified,
      customerAddress: bookingData.address || customer.savedAddresses.find(a => a.isDefault)?.address || customer.savedAddresses[0]?.address || 'Sector 62, Noida',
      customerCoords: bookingData.coords || customer.savedAddresses.find(a => a.isDefault)?.coords || [28.5365, 77.3920],
      serviceId: bookingData.service.id,
      serviceName: bookingData.service.name,
      category: bookingData.service.category,
      bookingType: bookingData.bookingType,
      scheduledDate: bookingData.scheduledDate,
      scheduledTime: bookingData.scheduledTime,
      taskDescription: bookingData.taskDescription || `${bookingData.service.name} requested at doorstep.`,
      attachments: bookingData.attachments,
      checklist: bookingData.checklist,
      isRecurring: bookingData.isRecurring,
      recurrenceFrequency: bookingData.recurrenceFrequency,
      packageId: bookingData.packageId,
      packageName: bookingData.packageName,
      status: 'searching',
      partnerId: '',
      partnerName: '',
      partnerPhone: '',
      partnerRating: 4.9,
      partnerVehicle: '',
      partnerAvatar: '',
      partnerCoords: [28.5395, 77.3940],
      startOtp: randomOtp,
      basePrice: price,
      laborRate: bookingData.service.hourlyRate || price,
      hoursSpent: 1,
      surgeMultiplier: surge,
      discount,
      couponCode: bookingData.couponCode,
      totalAmount: finalAmount,
      paymentMethod: bookingData.paymentMethod,
      paymentStatus: bookingData.paymentMethod === 'cash' ? 'pending' : 'paid',
      createdAt: 'Just now',
      etaMinutes: 12
    };

    setBookings(prev => [newBooking, ...prev]);
    setActiveBookingId(bookingId);

    // Trigger audible chime and open incoming dispatch offer for partner
    setIncomingJobOffer(newBooking);
    playIncomingBookingChime();

    // Broadcast across tabs/apps so partner app receives it immediately
    broadcastCrossTab({
      type: 'NEW_BOOKING_DISPATCH',
      booking: newBooking
    });

    return bookingId;
  };

  const updateBookingReimbursement = (bookingId: string, data: Partial<Booking>) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          ...data,
          checklist: data.checklist || b.checklist,
          reimbursement: data.reimbursement || b.reimbursement,
          totalAmount: data.totalAmount !== undefined ? data.totalAmount : b.totalAmount
        };
      }
      return b;
    }));
  };

  const cancelBooking = (bookingId: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return { ...b, status: 'cancelled' };
      }
      return b;
    }));
    if (activeBookingId === bookingId) {
      setActiveBookingId(null);
    }
  };

  const submitReview = (bookingId: string, rating: number, tags: string[], comment: string) => {
    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          ratingGiven: rating,
          reviewTags: tags,
          reviewComment: comment,
        };
      }
      return b;
    }));
  };

  const addWalletMoney = (amount: number) => {
    setCustomer(prev => ({
      ...prev,
      walletBalance: prev.walletBalance + amount
    }));
  };

  const loginCustomer = (name: string, phone: string, email?: string) => {
    const formattedPhone = phone.startsWith('+91') ? phone : `+91 ${phone.replace(/^0+/, '').trim()}`;
    setCustomer(prev => ({
      ...prev,
      name: name.trim(),
      phone: formattedPhone,
      email: email?.trim() || prev.email || `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
      isLoggedIn: true,
      memberSince: prev.memberSince || 'Today'
    }));
    setIsLoginModalOpen(false);
  };

  const logoutCustomer = () => {
    setCustomer(prev => ({
      ...prev,
      id: `usr-${Date.now()}`,
      name: 'Guest Customer',
      phone: '',
      email: '',
      isLoggedIn: false,
      isAadhaarVerified: false,
      aadhaarNumber: undefined,
      aadhaarName: undefined,
      aadhaarVerifiedAt: undefined
    }));
  };

  const verifyCustomerAadhaar = (data: {
    aadhaarNumber: string;
    aadhaarName: string;
    dob?: string;
    gender?: string;
    address?: string;
    docUrl?: string;
  }) => {
    const cleanDigits = data.aadhaarNumber.replace(/\D/g, '');
    const last4 = cleanDigits.slice(-4) || '5518';
    const masked = `XXXX XXXX ${last4}`;
    const bonusReward = 200;

    setCustomer(prev => ({
      ...prev,
      isAadhaarVerified: true,
      aadhaarNumber: masked,
      aadhaarName: data.aadhaarName.trim(),
      aadhaarDob: data.dob || '1994-08-15',
      aadhaarGender: data.gender || 'Male',
      aadhaarAddress: data.address || prev.savedAddresses[0]?.address || 'Verified Address, India',
      aadhaarVerifiedAt: new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      aadhaarDocUrl: data.docUrl,
      walletBalance: prev.walletBalance + bonusReward
    }));
    setIsAadhaarModalOpen(false);
  };

  const updateCustomerProfile = (data: Partial<CustomerUser>) => {
    setCustomer(prev => ({
      ...prev,
      ...data
    }));
  };

  const saveCustomerAddress = (newAddr: CustomerUser['savedAddresses'][0]) => {
    setCustomer(prev => {
      let updatedAddresses: CustomerUser['savedAddresses'];
      const exists = prev.savedAddresses.some(a => a.id === newAddr.id);
      
      if (exists) {
        updatedAddresses = prev.savedAddresses.map(a => {
          if (a.id === newAddr.id) return newAddr;
          if (newAddr.isDefault) return { ...a, isDefault: false };
          return a;
        });
      } else {
        const resetOldDefaults = newAddr.isDefault 
          ? prev.savedAddresses.map(a => ({ ...a, isDefault: false }))
          : prev.savedAddresses;
        updatedAddresses = [newAddr, ...resetOldDefaults];
      }

      const updated = {
        ...prev,
        savedAddresses: updatedAddresses
      };
      localStorage.setItem('qs_customer', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCustomerAddress = (addressId: string) => {
    setCustomer(prev => {
      const filtered = prev.savedAddresses.filter(a => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some(a => a.isDefault)) {
        filtered[0].isDefault = true;
      }
      const updated = { ...prev, savedAddresses: filtered };
      localStorage.setItem('qs_customer', JSON.stringify(updated));
      return updated;
    });
  };

  const setDefaultAddress = (addressId: string) => {
    setCustomer(prev => {
      const updated = {
        ...prev,
        savedAddresses: prev.savedAddresses.map(a => ({
          ...a,
          isDefault: a.id === addressId
        }))
      };
      localStorage.setItem('qs_customer', JSON.stringify(updated));
      return updated;
    });
  };

  const triggerGlobalSms = (phone: string, otp: string, sender = 'VK-QKSERV') => {
    triggerAppSms(phone, otp, sender);
  };

  // =========================================================================
  // Mock SMS OTP Service (User Requirement: 6-digit codes delivery simulation)
  // =========================================================================
  const sendMockSmsOtp = async (
    phone: string, 
    role: 'customer' | 'partner' = 'customer', 
    customSender?: string
  ): Promise<{ success: boolean; otp: string; message: string }> => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    // Generate authentic 6-digit secure code
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const sender = customSender || (role === 'partner' ? 'VK-QKPRTN' : 'VK-QKSERV');

    setMockSmsOtpService(prev => ({
      ...prev,
      lastOtp: generatedOtp,
      lastPhone: cleanPhone,
      lastRole: role,
      deliveryStatus: 'sending'
    }));

    // Trigger instant realistic push SMS banner and audio chime
    playSmsNotificationSound();
    triggerAppSms(cleanPhone, generatedOtp, sender);

    const historyItem = {
      id: 'sms-' + Date.now(),
      phone: cleanPhone,
      otp: generatedOtp,
      role,
      timestamp: 'Just now',
      sender
    };

    setMockSmsOtpService(prev => ({
      ...prev,
      deliveryStatus: 'delivered',
      history: [historyItem, ...prev.history.slice(0, 19)]
    }));

    return {
      success: true,
      otp: generatedOtp,
      message: `SMS delivered successfully with 6-digit code to +91 ${cleanPhone}`
    };
  };

  const verifyMockSmsOtp = (phone: string, otp: string, _role?: 'customer' | 'partner'): { success: boolean; message: string } => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const cleanOtp = otp.trim();
    if (
      (mockSmsOtpService.lastOtp && mockSmsOtpService.lastOtp === cleanOtp && (!mockSmsOtpService.lastPhone || mockSmsOtpService.lastPhone === cleanPhone)) ||
      cleanOtp === mockSmsOtpService.lastOtp ||
      cleanOtp === '123456' ||
      cleanOtp === '000000' ||
      cleanOtp === '492815' ||
      cleanOtp === '999999'
    ) {
      return { success: true, message: 'OTP verified successfully' };
    }
    return {
      success: false,
      message: `Invalid OTP! Please enter code ${mockSmsOtpService.lastOtp || '123456'}`
    };
  };

  // =========================================================================
  // Partner Authentication with Proof & Details Edit (User Requirement)
  // =========================================================================
  const loginPartnerWithOtp = (phone: string, proofData?: {
    fullName: string;
    category: ServiceCategory;
    proofType: 'aadhaar' | 'license' | 'certificate' | 'police_clearance' | 'pan';
    docNumber: string;
    vehicleInfo?: string;
    experienceYears?: number;
    skills?: string[];
  }): { success: boolean; partner: Partner; isNew: boolean } => {
    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const existing = partners.find(p => p.phone.replace(/\D/g, '').endsWith(cleanPhone));
    if (existing) {
      if (proofData) {
        const updated = partners.map(p => {
          if (p.id === existing.id) {
            const newDocs = [...p.kycDocs];
            const existingDocIdx = newDocs.findIndex(d => d.type === proofData.proofType);
            const docItem = {
              type: proofData.proofType,
              label: (proofData.proofType || 'Proof').toUpperCase() + ' Verification Document',
              docNumber: proofData.docNumber || 'DOC-VERIFIED',
              documentUrl: '/docs/' + proofData.proofType + '.pdf',
              uploadedAt: 'Today (Online Verified)',
              status: 'verified' as const
            };
            if (existingDocIdx >= 0) newDocs[existingDocIdx] = docItem;
            else newDocs.push(docItem);
            return {
              ...p,
              name: proofData.fullName?.trim() || p.name,
              category: proofData.category || p.category,
              kycStatus: 'verified' as const,
              kycDocs: newDocs,
              vehicleInfo: proofData.vehicleInfo || p.vehicleInfo,
              isOnline: true
            };
          }
          return p;
        });
        setPartners(updated);
        localStorage.setItem('qs_partners', JSON.stringify(updated));
      }
      setActivePartnerId(existing.id);
      setIsPartnerLoggedIn(true);
      return { success: true, partner: existing, isNew: false };
    }

    // Register brand new partner with verification proof
    const newPartnerId = 'pt-' + Math.floor(1000 + Math.random() * 9000);
    const categoryLabels: Record<string, string> = {
      repairs: 'Plumbing & Maintenance',
      cleaning: 'Home Deep Cleaning',
      electric: 'Electrician & Appliances',
      appliances: 'AC & Refrigeration',
      driver: 'Chauffeur & Mobility',
      carpentry: 'Carpentry & Furniture',
      painting: 'Wall Painting & Waterproofing',
      pest: 'Pest Control',
      gardening: 'Garden & Lawn Care'
    };

    const newPartner: Partner = {
      id: newPartnerId,
      name: proofData?.fullName?.trim() || `Partner (+91 ${cleanPhone.slice(-4)})`,
      phone: `+91 ${cleanPhone}`,
      email: `${(proofData?.fullName || 'partner').toLowerCase().replace(/\s+/g, '')}@quickservice.pro`,
      category: proofData?.category || 'repairs',
      categoryName: categoryLabels[proofData?.category || 'repairs'] || 'Quick Services Pro',
      skills: proofData?.skills && proofData.skills.length > 0 ? proofData.skills : ['Verified Specialist', 'Express Dispatch', 'Tools Certified'],
      rating: 5.0,
      totalJobs: 0,
      isOnline: true,
      kycStatus: 'verified',
      kycDocs: [
        {
          type: proofData?.proofType || 'aadhaar',
          label: (proofData?.proofType || 'Aadhaar').toUpperCase() + ' Proof of Identity',
          docNumber: proofData?.docNumber || 'DOC-VERIFIED-' + cleanPhone.slice(-4),
          documentUrl: '/docs/partner_proof.pdf',
          uploadedAt: 'Today (Online Verified)',
          status: 'verified'
        }
      ],
      currentCoords: [28.5365, 77.3920],
      walletBalance: 500, // ₹500 welcome bonus for new verified partner
      todayEarnings: 0,
      weeklyEarnings: 0,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      vehicleInfo: proofData?.vehicleInfo || 'Motorcycle (DL-3S-4122)',
      experienceYears: proofData?.experienceYears || 3,
      upiId: `${cleanPhone}@paytm`,
      city: 'Delhi NCR (Noida/Greater Noida)'
    };

    const updatedPartners = [newPartner, ...partners];
    setPartners(updatedPartners);
    localStorage.setItem('qs_partners', JSON.stringify(updatedPartners));
    setActivePartnerId(newPartnerId);
    setIsPartnerLoggedIn(true);

    return { success: true, partner: newPartner, isNew: true };
  };

  const logoutPartner = () => {
    setIsPartnerLoggedIn(false);
  };

  const updatePartnerProfile = (partnerId: string, updates: Partial<Partner>) => {
    setPartners(prev => {
      const updated = prev.map(p => {
        if (p.id === partnerId) {
          return { ...p, ...updates };
        }
        return p;
      });
      localStorage.setItem('qs_partners', JSON.stringify(updated));
      return updated;
    });
  };

  // Actions - Partner
  const togglePartnerOnline = () => {
    setPartners(prev => prev.map(p => {
      if (p.id === activePartner.id) {
        return { ...p, isOnline: !p.isOnline };
      }
      return p;
    }));
  };

  const acceptIncomingJob = (bookingId: string): { success: boolean; message?: string } => {
    // Check latest state from localStorage to ensure atomic first-to-claim
    let currentBookings = bookings;
    try {
      const saved = localStorage.getItem('qs_bookings');
      if (saved) currentBookings = JSON.parse(saved);
    } catch (e) {}

    const target = currentBookings.find(b => b.id === bookingId);
    if (!target) {
      setIncomingJobOffer(null);
      return { success: false, message: 'Booking request no longer available.' };
    }

    // Check if another partner already claimed it
    if (target.partnerId && target.partnerId !== activePartner.id && target.status !== 'searching') {
      setIncomingJobOffer(null);
      return { 
        success: false, 
        message: `Already Claimed! Ye booking pehle hi ${target.partnerName || 'dusre employee'} ne accept kar li hai.` 
      };
    }

    const updatedBooking: Booking = {
      ...target,
      status: 'assigned',
      partnerId: activePartner.id,
      partnerName: activePartner.name,
      partnerPhone: activePartner.phone,
      partnerAvatar: activePartner.avatarUrl,
      partnerRating: activePartner.rating,
      partnerVehicle: activePartner.vehicleInfo,
    };

    const nextBookings = currentBookings.map(b => b.id === bookingId ? updatedBooking : b);
    setBookings(nextBookings);
    localStorage.setItem('qs_bookings', JSON.stringify(nextBookings));
    setIncomingJobOffer(null);

    // Audio chime for won job
    playClaimSuccessChime();

    // Broadcast to all other tabs that this employee won the job
    broadcastCrossTab({
      type: 'BOOKING_CLAIMED',
      bookingId,
      claimedBy: activePartner.name,
      partnerId: activePartner.id,
      updatedBooking
    });

    return { 
      success: true, 
      message: `🎉 Booking Accepted! Aapko ${target.serviceName} ka order assign ho gaya hai.` 
    };
  };

  const rejectIncomingJob = (_bookingId: string) => {
    setIncomingJobOffer(null);
  };

  const updateJobStatus = (bookingId: string, nextStatus: Booking['status'], otpCode?: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return { success: false, message: 'Booking not found' };

    // If transitioning to in_progress, verify OTP
    if (nextStatus === 'in_progress') {
      if (otpCode !== booking.startOtp) {
        return { success: false, message: 'Incorrect 4-digit customer OTP' };
      }
    }

    setBookings(prev => prev.map(b => {
      if (b.id === bookingId) {
        const isComplete = nextStatus === 'completed';
        return {
          ...b,
          status: nextStatus,
          completedAt: isComplete ? 'Just now' : b.completedAt,
          paymentStatus: isComplete ? 'paid' : b.paymentStatus,
        };
      }
      return b;
    }));

    // If completed, update partner earnings
    if (nextStatus === 'completed') {
      const partnerEarning = Math.round(booking.totalAmount * (1 - adminMetrics.platformTakeRate));
      setPartners(prev => prev.map(p => {
        if (p.id === (booking.partnerId || activePartner.id)) {
          return {
            ...p,
            walletBalance: p.walletBalance + partnerEarning,
            todayEarnings: p.todayEarnings + partnerEarning,
            weeklyEarnings: p.weeklyEarnings + partnerEarning,
            totalJobs: p.totalJobs + 1
          };
        }
        return p;
      }));
    }

    return { success: true };
  };

  const withdrawPartnerEarnings = (amount: number) => {
    setPartners(prev => prev.map(p => {
      if (p.id === activePartner.id) {
        return {
          ...p,
          walletBalance: Math.max(0, p.walletBalance - amount)
        };
      }
      return p;
    }));
  };

  // Actions - Admin
  const updateSurgeMultiplier = (surge: number) => {
    setAdminMetrics(prev => ({ ...prev, surgeMultiplier: surge }));
  };

  const updateCommissionRate = (rate: number) => {
    setAdminMetrics(prev => ({ ...prev, platformTakeRate: rate }));
  };

  const verifyPartnerKYC = (partnerId: string, docType: string, approve: boolean, reason?: string) => {
    setPartners(prev => prev.map(p => {
      if (p.id === partnerId) {
        const updatedDocs = p.kycDocs.map(doc => {
          if (doc.type === docType) {
            return {
              ...doc,
              status: approve ? ('verified' as const) : ('rejected' as const),
              rejectionReason: approve ? undefined : (reason || 'Document unreadable or invalid')
            };
          }
          return doc;
        });
        const allVerified = updatedDocs.every(d => d.status === 'verified');
        const anyRejected = updatedDocs.some(d => d.status === 'rejected');
        return {
          ...p,
          kycDocs: updatedDocs,
          kycStatus: allVerified ? 'verified' : anyRejected ? 'rejected' : 'pending'
        };
      }
      return p;
    }));
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons(prev => [coupon, ...prev]);
  };

  const toggleCoupon = (code: string) => {
    setCoupons(prev => prev.map(c => c.code === code ? { ...c, active: !c.active } : c));
  };

  const resolveEmergencyAlert = (alertId: string) => {
    setEmergencyAlerts(prev => prev.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a));
  };

  const triggerEmergencySOS = (bookingId: string, triggeredBy: 'customer' | 'partner') => {
    const booking = bookings.find(b => b.id === bookingId);
    const newAlert: EmergencyAlert = {
      id: `sos-${Date.now()}`,
      bookingId,
      triggeredBy,
      userName: triggeredBy === 'customer' ? (booking?.customerName || customer.name) : (booking?.partnerName || activePartner.name),
      userPhone: triggeredBy === 'customer' ? (booking?.customerPhone || customer.phone) : (booking?.partnerPhone || activePartner.phone),
      location: booking?.customerAddress || 'Noida Sector 100, Urban Zone',
      coords: booking?.customerCoords || [28.5365, 77.3920],
      timestamp: 'Just now',
      status: 'active',
      notes: 'PANIC SOS BUTTON PRESSED! Live location broadcasted to 24/7 Response Center.'
    };
    setEmergencyAlerts(prev => [newAlert, ...prev]);
  };

  // Calling
  const startCall = (name: string, phone: string, avatar: string, role: 'partner' | 'customer', bookingId: string) => {
    setCallState({
      isOpen: true,
      partnerOrUserName: name,
      phoneNumber: phone,
      avatarUrl: avatar,
      role,
      bookingId,
      status: 'calling',
      durationSeconds: 0,
      isMuted: false,
      isSpeaker: false
    });
  };

  const endCall = () => {
    setCallState(prev => ({ ...prev, isOpen: false, status: 'ended' }));
  };

  const toggleMute = () => {
    setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleSpeaker = () => {
    setCallState(prev => ({ ...prev, isSpeaker: !prev.isSpeaker }));
  };

  // Chat
  const openChat = (bookingId: string) => {
    setChatBookingId(bookingId);
  };

  const closeChat = () => {
    setChatBookingId(null);
  };

  const sendMessage = (bookingId: string, text: string, sender: 'customer' | 'partner') => {
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      bookingId,
      sender,
      senderName: sender === 'customer' ? customer.name : activePartner.name,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const dismissIncomingJob = () => {
    setIncomingJobOffer(null);
  };

  const availableOpenJobs = bookings.filter(b => b.status === 'searching');

  return (
    <QuickServiceContext.Provider
      value={{
        viewMode,
        setViewMode,
        deviceFrame,
        setDeviceFrame,
        customer,
        services,
        bookings,
        partners,
        activePartnerId,
        setActivePartnerId,
        activePartner,
        availableOpenJobs,
        coupons,
        emergencyAlerts,
        messages,
        adminMetrics,
        activeBookingId,
        setActiveBookingId,
        activeBooking,
        createBooking,
        cancelBooking,
        submitReview,
        addWalletMoney,
        updateBookingReimbursement,
        loginCustomer,
        logoutCustomer,
        verifyCustomerAadhaar,
        updateCustomerProfile,
        saveCustomerAddress,
        deleteCustomerAddress,
        setDefaultAddress,
        triggerGlobalSms,
        isPhoneAuthModalOpen,
        setIsPhoneAuthModalOpen,
        phoneAuthRole,
        setPhoneAuthRole,
        openPhoneAuth,
        isLoginModalOpen,
        setIsLoginModalOpen,
        isAadhaarModalOpen,
        setIsAadhaarModalOpen,
        isAddressModalOpen,
        setIsAddressModalOpen,
        editingAddress,
        setEditingAddress,
        mockSmsOtpService,
        sendMockSmsOtp,
        verifyMockSmsOtp,
        isPartnerLoggedIn,
        setIsPartnerLoggedIn,
        loginPartnerWithOtp,
        logoutPartner,
        updatePartnerProfile,
        isPartnerLoginModalOpen,
        setIsPartnerLoginModalOpen,
        isPartnerEditModalOpen,
        setIsPartnerEditModalOpen,
        togglePartnerOnline,
        acceptIncomingJob,
        rejectIncomingJob,
        updateJobStatus,
        withdrawPartnerEarnings,
        updateSurgeMultiplier,
        updateCommissionRate,
        verifyPartnerKYC,
        addCoupon,
        toggleCoupon,
        resolveEmergencyAlert,
        triggerEmergencySOS,
        callState,
        startCall,
        endCall,
        toggleMute,
        toggleSpeaker,
        chatBookingId,
        openChat,
        closeChat,
        sendMessage,
        incomingJobOffer,
        dismissIncomingJob,
      }}
    >
      {children}
    </QuickServiceContext.Provider>
  );
};

export const useQuickService = () => {
  const context = useContext(QuickServiceContext);
  if (!context) {
    throw new Error('useQuickService must be used within a QuickServiceProvider');
  }
  return context;
};
