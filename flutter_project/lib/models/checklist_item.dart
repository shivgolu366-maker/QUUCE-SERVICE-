class ChecklistItem {
  final String id;
  String name;
  String quantity;
  bool isPurchased;
  String? category;

  ChecklistItem({
    required this.id,
    required this.name,
    required this.quantity,
    this.isPurchased = false,
    this.category,
  });

  factory ChecklistItem.fromJson(Map<String, dynamic> json) {
    return ChecklistItem(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      quantity: json['quantity'] ?? '',
      isPurchased: json['isPurchased'] ?? false,
      category: json['category'],
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'quantity': quantity,
    'isPurchased': isPurchased,
    'category': category,
  };

  ChecklistItem copyWith({
    String? id,
    String? name,
    String? quantity,
    bool? isPurchased,
    String? category,
  }) {
    return ChecklistItem(
      id: id ?? this.id,
      name: name ?? this.name,
      quantity: quantity ?? this.quantity,
      isPurchased: isPurchased ?? this.isPurchased,
      category: category ?? this.category,
    );
  }
}
