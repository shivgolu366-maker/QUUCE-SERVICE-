import '../models/service_item.dart';
import '../models/partner.dart';
import '../models/subscription_package.dart';

class MockData {
  static final Partner mockPartner = Partner(
    id: 'partner-101',
    name: 'Rajesh Kumar',
    photoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
    phone: '+91 98765 43210',
    rating: 4.88,
    completedJobs: 412,
    isVerified: true,
    isOnline: true,
    vehicleType: 'Hero Splendor Plus (EV Dual-Carrier)',
    vehicleNumber: 'DL 4S BR 9081',
    skills: ['Sabji Mandi Specialist', 'Kirana Delivery', 'Emergency Chauffeur'],
    latitude: 28.5355,
    longitude: 77.3910,
    todayEarnings: 1540.0,
  );

  static final List<ServiceItem> servicesCatalog = [
    ServiceItem(
      id: 'srv-sabji-mandi',
      title: 'Sabji Mandi / Fresh Vegetables',
      category: 'Runner & Errands',
      categoryTag: 'sabji',
      badgeTitle: 'MANDI FRESH',
      description: 'Runner visits local wholesale Sabji Mandi at sunrise. Hand-picks fresh vegetables, negotiates local mandi rates, ticks items on checklist and shares physical cash memo.',
      basePrice: 149.0,
      pricingType: 'hourly',
      estimatedMinutes: 45,
      rating: 4.92,
      reviewsCount: 382,
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80',
      hasChecklist: true,
      emergencySupported: true,
      includedFeatures: [
        'Local wholesale mandi rate benefit',
        'Physical paper cash memo photograph upload',
        'Transparent formula: Labor + Actual Sabji Cost',
        'Handpicked fresh green produce'
      ],
      subOptions: [
        ServiceSubOption(id: 'sub-mandi-morning', title: 'Morning Mandi Rush (6AM - 10AM)', price: 149.0, duration: '45 mins', description: 'Early morning wholesale arrivals with crispest greens'),
        ServiceSubOption(id: 'sub-mandi-evening', title: 'Evening Mandi Run (5PM - 9PM)', price: 129.0, duration: '40 mins', description: 'Evening neighborhood vegetable and fruit stalls'),
      ],
    ),
    ServiceItem(
      id: 'srv-kirana-grocery',
      title: 'Kirana / Grocery Store Run',
      category: 'Runner & Errands',
      categoryTag: 'kirana',
      badgeTitle: 'KIRANA STORE',
      description: 'Runner visits your trusted neighborhood Kirana / Ration shop. Procures grains, milk packets, spices, staples according to your checklist and attaches merchant bill.',
      basePrice: 129.0,
      pricingType: 'hourly',
      estimatedMinutes: 35,
      rating: 4.88,
      reviewsCount: 294,
      imageUrl: 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?auto=format&fit=crop&w=600&q=80',
      hasChecklist: true,
      emergencySupported: true,
      includedFeatures: [
        'Branded staples and loose grain purchase',
        'Checklist verification before leaving shop',
        'Merchant stamp bill reimbursement',
        'Heavy lifting up to 15 kg included'
      ],
      subOptions: [
        ServiceSubOption(id: 'sub-kirana-quick', title: 'Quick Daily Essentials (up to 5 items)', price: 99.0, duration: '25 mins', description: 'Milk, bread, eggs, curd & tea essentials'),
        ServiceSubOption(id: 'sub-kirana-monthly', title: 'Monthly Ration Bulk Run (up to 20 items)', price: 199.0, duration: '60 mins', description: 'Atta, rice, oils, pulses, detergent & provisions'),
      ],
    ),
    ServiceItem(
      id: 'srv-medicine-pickup',
      title: 'Medicine / Pharmacy Pickup',
      category: 'Runner & Errands',
      categoryTag: 'medicine',
      badgeTitle: 'Rx PHARMA',
      description: 'Urgent prescription medicine and healthcare supplies purchase from nearby 24/7 chemist. Temperature-guarded insulated delivery.',
      basePrice: 119.0,
      pricingType: 'hourly',
      estimatedMinutes: 20,
      rating: 4.96,
      reviewsCount: 410,
      imageUrl: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=600&q=80',
      hasChecklist: true,
      emergencySupported: true,
      includedFeatures: [
        'Prescription photo match at chemist counter',
        'Cold-chain transport for insulin/syrups',
        'Detailed GST tax invoice attached'
      ],
      subOptions: [
        ServiceSubOption(id: 'sub-rx-instant', title: 'Emergency 20-min Pharmacy Drop', price: 149.0, duration: '20 mins', description: 'Immediate priority routing to open chemist'),
        ServiceSubOption(id: 'sub-rx-standard', title: 'Standard Prescription Refill', price: 99.0, duration: '40 mins', description: 'Regular chronic care monthly medicine run'),
      ],
    ),
    ServiceItem(
      id: 'srv-chauffeur-driver',
      title: 'Personal Chauffeur / Driver on Demand',
      category: 'Driver & Transport',
      categoryTag: 'driver',
      badgeTitle: 'CHAUFFEUR',
      description: 'Verified background-checked driver to pilot your personal manual or automatic car. Safe city traffic transit, night returns & outstation.',
      basePrice: 249.0,
      pricingType: 'hourly',
      estimatedMinutes: 60,
      rating: 4.90,
      reviewsCount: 512,
      imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=600&q=80',
      hasChecklist: false,
      emergencySupported: true,
      includedFeatures: [
        'Commercial driving license + police verified',
        'Automatic & manual transmission certified',
        'Live route GPS tracking with speed alerts'
      ],
      subOptions: [
        ServiceSubOption(id: 'sub-drv-hourly', title: 'Hourly City Drive (Min 2 Hours)', price: 399.0, duration: '120 mins', description: 'City meetings, hospital visits or late night party return'),
        ServiceSubOption(id: 'sub-drv-day', title: 'Full Day Chauffeur (8 Hours)', price: 1299.0, duration: '480 mins', description: 'Dedicated personal pilot for office or outstation'),
      ],
    ),
    ServiceItem(
      id: 'srv-deep-clean',
      title: 'Full House Deep Cleaning',
      category: 'Home Services',
      categoryTag: 'cleaning',
      badgeTitle: 'DEEP CLEAN',
      description: 'Hospital-grade sanitization, floor scrubbing machine, kitchen degreasing and washroom limescale removal by trained 2-person crew.',
      basePrice: 1499.0,
      pricingType: 'fixed',
      estimatedMinutes: 180,
      rating: 4.85,
      reviewsCount: 620,
      imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80',
      hasChecklist: false,
      emergencySupported: false,
      includedFeatures: [
        'Single-disc floor scrubbing machine',
        'Kitchen chimney and tile degreasing',
        'Taski chemicals for marble & glass'
      ],
      subOptions: [
        ServiceSubOption(id: 'sub-cln-1bhk', title: '1 BHK Deep Scrubbing', price: 1199.0, duration: '120 mins', description: 'Complete 1BHK sanitization & balcony wash'),
        ServiceSubOption(id: 'sub-cln-3bhk', title: '3 BHK Deep Sanitization', price: 2199.0, duration: '240 mins', description: '3 BHK complete deep clean with balcony & windows'),
      ],
    ),
  ];

  static final List<SubscriptionPlan> subscriptionPlans = [
    SubscriptionPlan(
      id: 'sub-mandi-weekly',
      title: 'Weekly Sabji Mandi & Kirana Pass',
      subtitle: '4 priority runs/month • Zero surge • Checklist verification',
      frequency: 'weekly',
      totalVisits: 4,
      discountedPrice: 449.0,
      originalPrice: 596.0,
      savingsPercent: 25,
      serviceCategory: 'Runner & Errands',
      isPopular: true,
      benefits: [
        '4 Scheduled or on-demand Mandi & Kirana runner runs',
        'Physical paper cash memo photograph upload',
        'Zero surge during peak morning mandi hours',
        'Pre-vetted vegetable selecting runners'
      ],
    ),
    SubscriptionPlan(
      id: 'sub-clean-monthly',
      title: 'Pristine Home Cleaning Monthly Pass',
      subtitle: '4 weekend deep-cleans with industrial grade scrubbers',
      frequency: 'weekly',
      totalVisits: 4,
      discountedPrice: 1399.0,
      originalPrice: 1996.0,
      savingsPercent: 30,
      serviceCategory: 'Home Services',
      benefits: [
        '4 Weekly 2-hour thorough cleaning visits',
        'Floor buffer & Taski eco-sanitizer included',
        'Priority slot lock-in on Saturday & Sunday'
      ],
    ),
    SubscriptionPlan(
      id: 'sub-cook-monthly',
      title: 'Daily Home Chef & Cook Monthly Plan',
      subtitle: '24 meal preparation visits with fresh diet tailoring',
      frequency: 'monthly',
      totalVisits: 24,
      discountedPrice: 5999.0,
      originalPrice: 8376.0,
      savingsPercent: 28,
      serviceCategory: 'Personal Care',
      benefits: [
        '24 Cook visits (Lunch or Dinner preparation)',
        'Up to 4 people North/South Indian menu customization',
        'Hygiene certified cooks with routine thermal checks'
      ],
    ),
  ];

  static final List<ServicePackage> servicePackages = [
    ServicePackage(
      id: 'pkg-move-in',
      title: 'Move-In Deep Refresh & Diagnostics',
      tagline: 'Deep cleaning + Electrician load check + Plumbing test',
      bundlePrice: 2199.0,
      originalValue: 2997.0,
      savingsAmount: 798.0,
      durationEstimate: '4 - 5 Hours',
      badgeText: 'HOT DEAL',
      includedServices: [
        'Full 2BHK Deep Sanitization with machine scrub',
        'Master Electrician 12-point switchboard inspection',
        'Plumber pressure gauge & geyser line diagnostics'
      ],
      perks: [
        'Single supervisor for all 3 tasks',
        'Spare parts warranty certificate for 30 days',
        'Free doorstep key handover assistance'
      ],
    ),
    ServicePackage(
      id: 'pkg-senior-care',
      title: 'Senior Citizen Helper & Errand Care Pack',
      tagline: '2 Helper visits + 2 Pharmacy pickups + 2 Sabji runs',
      bundlePrice: 1299.0,
      originalValue: 1995.0,
      savingsAmount: 696.0,
      durationEstimate: 'Valid for 30 Days',
      badgeText: 'FAMILY CARE',
      includedServices: [
        '2 Domestic helper house upkeep visits (2 hrs each)',
        '2 Prescription medicine doorstep pickups with bill receipt',
        '2 Morning Sabji Mandi vegetable runs with memo upload'
      ],
      perks: [
        'Dedicated senior-friendly verified runners',
        'Real-time WhatsApp tracking link sent to family members',
        'Direct emergency SOS support priority'
      ],
    ),
  ];
}
