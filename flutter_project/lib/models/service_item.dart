class ServiceSubOption {
  final String id;
  final String title;
  final double price;
  final String duration;
  final String description;

  ServiceSubOption({
    required this.id,
    required this.title,
    required this.price,
    required this.duration,
    required this.description,
  });

  factory ServiceSubOption.fromJson(Map<String, dynamic> json) {
    return ServiceSubOption(
      id: json['id'] ?? '',
      title: json['title'] ?? '',
      price: (json['price'] as num?)?.toDouble() ?? 0.0,
      duration: json['duration'] ?? '',
      description: json['description'] ?? '',
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'title': title,
    'price': price,
    'duration': duration,
    'description': description,
  };
}

class ServiceItem {
  final String id;
  final String title;
  final String category;
  final String categoryTag;
  final String badgeTitle;
  final String description;
  final double basePrice;
  final String pricingType; // 'fixed' | 'hourly'
  final int estimatedMinutes;
  final double rating;
  final int reviewsCount;
  final String imageUrl;
  final List<String> includedFeatures;
  final List<ServiceSubOption> subOptions;
  final bool hasChecklist;
  final bool emergencySupported;

  ServiceItem({
    required this.id,
    required this.title,
    required this.category,
    required this.categoryTag,
    required this.badgeTitle,
    required this.description,
    required this.basePrice,
    required this.pricingType,
    required this.estimatedMinutes,
    required this.rating,
    required this.reviewsCount,
    required this.imageUrl,
    required this.includedFeatures,
    required this.subOptions,
    this.hasChecklist = false,
    this.emergencySupported = true,
  });
}
