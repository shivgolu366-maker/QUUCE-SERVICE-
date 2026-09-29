export type ServiceCategory = 'repairs' | 'chores' | 'mobility';

export type PricingType = 'fixed' | 'hourly' | 'quote';

export interface ServiceSubOption {
  id: string;
  name: string;
  price: number;
  timeEstimate: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  categoryLabel: string;
  icon: string;
  illustrationType?: 'sabji' | 'kirana' | 'medicine' | 'courier' | 'labor' | 'pickdrop' | 'plumber' | 'electrician' | 'carpenter' | 'appliance' | 'painter' | 'cleaning' | 'laundry' | 'cook' | 'maid' | 'driver';
  badgeTitle?: string;
  supportsChecklist?: boolean;
  description: string;
  detailedSpecs: string[];
  pricingType: PricingType;
  basePrice: number;
  hourlyRate?: number;
  estimatedTimeMinutes: number;
  rating: number;
  reviewsCount: number;
  popularTag?: string;
  subOptions?: ServiceSubOption[];
}

export type BookingStatus = 
  | 'searching'
  | 'assigned'
  | 'en_route'
  | 'arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export interface TaskAttachment {
  type: 'photo' | 'audio';
  url: string;
  name?: string;
  duration?: number; // seconds for audio
}

export interface ChecklistItem {
  id: string;
  name: string;
  quantity: string;
  isPurchased: boolean;
  category?: 'sabji' | 'kirana' | 'medicine' | 'general';
}

export interface BillReimbursement {
  billPhotoUrl?: string;
  billPhotoName?: string;
  totalItemsAmount: number;
  memoNotes?: string;
  uploadedAt?: string;
  status: 'pending' | 'submitted' | 'approved';
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  visitsPerMonth: number;
  monthlyPrice: number;
  originalMonthlyPrice: number;
  discountPercent: number;
  popularTag?: string;
  perks: string[];
}

export interface ServicePackage {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  includedServices: {
    serviceId: string;
    name: string;
    visits: number;
  }[];
  bundledPrice: number;
  originalPrice: number;
  savingsAmount: number;
  validityDays: number;
  badge?: string;
  popularTag?: string;
}

export interface CustomerSubscription {
  id: string;
  planId: string;
  planName: string;
  serviceName: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  nextScheduledDate: string;
  renewalDate: string;
  visitsRemaining: number;
  monthlyPrice: number;
  autoRenew: boolean;
}

export interface CustomerPackageCredit {
  id: string;
  packageId: string;
  packageName: string;
  remainingCredits: {
    serviceName: string;
    visitsLeft: number;
  }[];
  expiryDate: string;
}

export interface Booking {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  customerAadhaarVerified?: boolean;
  customerAddress: string;
  customerCoords: [number, number]; // [lat, lng]
  serviceId: string;
  serviceName: string;
  category: ServiceCategory;
  bookingType: 'instant' | 'scheduled';
  scheduledDate?: string;
  scheduledTime?: string;
  taskDescription: string;
  attachments: TaskAttachment[];
  status: BookingStatus;
  partnerId?: string;
  partnerName?: string;
  partnerPhone?: string;
  partnerRating?: number;
  partnerVehicle?: string;
  partnerAvatar?: string;
  partnerCoords?: [number, number];
  startOtp: string; // 4-digit code
  basePrice: number;
  laborRate?: number;
  hoursSpent?: number;
  surgeMultiplier: number;
  discount: number;
  couponCode?: string;
  totalAmount: number;
  checklist?: ChecklistItem[];
  reimbursement?: BillReimbursement;
  isRecurring?: boolean;
  recurrenceFrequency?: 'weekly' | 'biweekly' | 'monthly';
  packageId?: string;
  packageName?: string;
  paymentMethod: 'upi' | 'card' | 'wallet' | 'cash';
  paymentStatus: 'pending' | 'paid';
  createdAt: string;
  completedAt?: string;
  ratingGiven?: number;
  reviewTags?: string[];
  reviewComment?: string;
  etaMinutes: number;
}

export interface PartnerKYCDoc {
  type: 'aadhaar' | 'license' | 'certificate' | 'police_clearance';
  label: string;
  docNumber: string;
  documentUrl: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
  rejectionReason?: string;
}

export interface Partner {
  id: string;
  name: string;
  phone: string;
  email: string;
  category: ServiceCategory;
  categoryName: string;
  skills: string[];
  rating: number;
  totalJobs: number;
  isOnline: boolean;
  kycStatus: 'verified' | 'pending' | 'rejected';
  kycDocs: PartnerKYCDoc[];
  currentCoords: [number, number];
  walletBalance: number;
  todayEarnings: number;
  weeklyEarnings: number;
  avatarUrl: string;
  vehicleInfo?: string;
  experienceYears: number;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  savedAddresses: {
    id: string;
    label: 'Home' | 'Work' | 'Other';
    address: string;
    coords: [number, number];
    isDefault: boolean;
  }[];
  walletBalance: number;
  memberSince: string;
  activeSubscriptions?: CustomerSubscription[];
  activePackages?: CustomerPackageCredit[];
  isLoggedIn?: boolean;
  isAadhaarVerified?: boolean;
  aadhaarNumber?: string;
  aadhaarName?: string;
  aadhaarDob?: string;
  aadhaarGender?: string;
  aadhaarAddress?: string;
  aadhaarVerifiedAt?: string;
  aadhaarDocUrl?: string;
}

export interface ChatMessage {
  id: string;
  bookingId: string;
  sender: 'customer' | 'partner' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface Coupon {
  code: string;
  description: string;
  discountPercent: number;
  maxDiscount: number;
  minOrder: number;
  active: boolean;
}

export interface EmergencyAlert {
  id: string;
  bookingId: string;
  triggeredBy: 'customer' | 'partner';
  userName: string;
  userPhone: string;
  location: string;
  coords: [number, number];
  timestamp: string;
  status: 'active' | 'investigating' | 'resolved';
  notes?: string;
}

export interface AdminMetrics {
  totalRevenue: number;
  platformTakeRate: number; // 0.15 = 15%
  completedBookingsCount: number;
  activeOnlinePartners: number;
  surgeMultiplier: number;
  autoAssignRadiusKm: number;
}
