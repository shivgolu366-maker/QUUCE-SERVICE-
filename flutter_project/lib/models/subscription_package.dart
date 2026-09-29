class SubscriptionPlan {
  final String id;
  final String title;
  final String subtitle;
  final String frequency; // 'weekly' | 'monthly'
  final int totalVisits;
  final double discountedPrice;
  final double originalPrice;
  final int savingsPercent;
  final String serviceCategory;
  final List<String> benefits;
  final bool isPopular;

  SubscriptionPlan({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.frequency,
    required this.totalVisits,
    required this.discountedPrice,
    required this.originalPrice,
    required this.savingsPercent,
    required this.serviceCategory,
    required this.benefits,
    this.isPopular = false,
  });
}

class ServicePackage {
  final String id;
  final String title;
  final String tagline;
  final double bundlePrice;
  final double originalValue;
  final double savingsAmount;
  final String durationEstimate;
  final List<String> includedServices;
  final List<String> perks;
  final String badgeText;

  ServicePackage({
    required this.id,
    required this.title,
    required this.tagline,
    required this.bundlePrice,
    required this.originalValue,
    required this.savingsAmount,
    required this.durationEstimate,
    required this.includedServices,
    required this.perks,
    required this.badgeText,
  });
}
