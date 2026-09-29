class Partner {
  final String id;
  final String name;
  final String photoUrl;
  final String phone;
  final double rating;
  final int completedJobs;
  final bool isVerified;
  final bool isOnline;
  final String vehicleType;
  final String vehicleNumber;
  final List<String> skills;
  final double latitude;
  final double longitude;
  final double todayEarnings;

  Partner({
    required this.id,
    required this.name,
    required this.photoUrl,
    required this.phone,
    required this.rating,
    required this.completedJobs,
    this.isVerified = true,
    this.isOnline = true,
    required this.vehicleType,
    required this.vehicleNumber,
    required this.skills,
    required this.latitude,
    required this.longitude,
    this.todayEarnings = 1420.0,
  });

  Partner copyWith({
    String? id,
    String? name,
    String? photoUrl,
    String? phone,
    double? rating,
    int? completedJobs,
    bool? isVerified,
    bool? isOnline,
    String? vehicleType,
    String? vehicleNumber,
    List<String>? skills,
    double? latitude,
    double? longitude,
    double? todayEarnings,
  }) {
    return Partner(
      id: id ?? this.id,
      name: name ?? this.name,
      photoUrl: photoUrl ?? this.photoUrl,
      phone: phone ?? this.phone,
      rating: rating ?? this.rating,
      completedJobs: completedJobs ?? this.completedJobs,
      isVerified: isVerified ?? this.isVerified,
      isOnline: isOnline ?? this.isOnline,
      vehicleType: vehicleType ?? this.vehicleType,
      vehicleNumber: vehicleNumber ?? this.vehicleNumber,
      skills: skills ?? this.skills,
      latitude: latitude ?? this.latitude,
      longitude: longitude ?? this.longitude,
      todayEarnings: todayEarnings ?? this.todayEarnings,
    );
  }
}
