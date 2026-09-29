import 'checklist_item.dart';
import 'partner.dart';
import 'service_item.dart';

enum BookingStatus {
  pending,
  assigned,
  arrived,
  inProgress,
  completed,
  cancelled
}

class RunnerReimbursement {
  final String billPhotoUrl;
  final String? billPhotoName;
  final double totalItemsAmount;
  final String? memoNotes;
  final DateTime uploadedAt;
  final String status;

  RunnerReimbursement({
    required this.billPhotoUrl,
    this.billPhotoName,
    required this.totalItemsAmount,
    this.memoNotes,
    required this.uploadedAt,
    this.status = 'submitted',
  });
}

class BookingPricing {
  final String pricingType;
  final double hourlyLaborRate;
  final double hoursSpent;
  final double laborSubtotal;
  final double actualItemsCost;
  final double surgeMultiplier;
  final double discount;
  final double totalAmount;
  final String formulaDescription;

  BookingPricing({
    required this.pricingType,
    required this.hourlyLaborRate,
    required this.hoursSpent,
    required this.laborSubtotal,
    required this.actualItemsCost,
    this.surgeMultiplier = 1.0,
    this.discount = 0.0,
    required this.totalAmount,
    this.formulaDescription = 'Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost',
  });
}

class Booking {
  final String id;
  final ServiceItem service;
  final ServiceSubOption? selectedSubOption;
  final BookingStatus status;
  final String bookingType; // 'instant' | 'scheduled'
  final DateTime createdAt;
  final DateTime? scheduledTime;
  final String startOtp;
  final Partner? assignedPartner;
  final String taskDescription;
  final List<ChecklistItem> checklist;
  final RunnerReimbursement? reimbursement;
  final BookingPricing pricing;
  final bool isRecurring;
  final String? recurrenceFrequency;
  final String? packageId;
  final String? packageName;
  final String paymentMethod;
  final double customerRating;

  Booking({
    required this.id,
    required this.service,
    this.selectedSubOption,
    required this.status,
    required this.bookingType,
    required this.createdAt,
    this.scheduledTime,
    required this.startOtp,
    this.assignedPartner,
    required this.taskDescription,
    this.checklist = const [],
    this.reimbursement,
    required this.pricing,
    this.isRecurring = false,
    this.recurrenceFrequency,
    this.packageId,
    this.packageName,
    this.paymentMethod = 'upi',
    this.customerRating = 0.0,
  });

  Booking copyWith({
    String? id,
    ServiceItem? service,
    ServiceSubOption? selectedSubOption,
    BookingStatus? status,
    String? bookingType,
    DateTime? createdAt,
    DateTime? scheduledTime,
    String? startOtp,
    Partner? assignedPartner,
    String? taskDescription,
    List<ChecklistItem>? checklist,
    RunnerReimbursement? reimbursement,
    BookingPricing? pricing,
    bool? isRecurring,
    String? recurrenceFrequency,
    String? packageId,
    String? packageName,
    String? paymentMethod,
    double? customerRating,
  }) {
    return Booking(
      id: id ?? this.id,
      service: service ?? this.service,
      selectedSubOption: selectedSubOption ?? this.selectedSubOption,
      status: status ?? this.status,
      bookingType: bookingType ?? this.bookingType,
      createdAt: createdAt ?? this.createdAt,
      scheduledTime: scheduledTime ?? this.scheduledTime,
      startOtp: startOtp ?? this.startOtp,
      assignedPartner: assignedPartner ?? this.assignedPartner,
      taskDescription: taskDescription ?? this.taskDescription,
      checklist: checklist ?? this.checklist,
      reimbursement: reimbursement ?? this.reimbursement,
      pricing: pricing ?? this.pricing,
      isRecurring: isRecurring ?? this.isRecurring,
      recurrenceFrequency: recurrenceFrequency ?? this.recurrenceFrequency,
      packageId: packageId ?? this.packageId,
      packageName: packageName ?? this.packageName,
      paymentMethod: paymentMethod ?? this.paymentMethod,
      customerRating: customerRating ?? this.customerRating,
    );
  }
}
