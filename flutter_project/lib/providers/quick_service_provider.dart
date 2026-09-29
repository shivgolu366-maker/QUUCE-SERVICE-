import 'dart:async';
import 'package:flutter/foundation.dart';
import '../models/service_item.dart';
import '../models/booking.dart';
import '../models/partner.dart';
import '../models/checklist_item.dart';
import '../models/subscription_package.dart';
import '../constants/mock_data.dart';

class QuickServiceProvider with ChangeNotifier {
  List<ServiceItem> _services = [];
  List<SubscriptionPlan> _subscriptionPlans = [];
  List<ServicePackage> _servicePackages = [];
  List<Booking> _bookings = [];
  Booking? _activeBooking;
  Partner _activePartner = MockData.mockPartner;
  bool _isSosActive = false;
  String _selectedCategory = 'All';

  // Partner incoming job state
  bool _hasIncomingJob = false;
  Booking? _incomingJob;
  int _incomingJobTimerSeconds = 30;
  Timer? _jobCountdownTimer;

  QuickServiceProvider() {
    _services = List.from(MockData.servicesCatalog);
    _subscriptionPlans = List.from(MockData.subscriptionPlans);
    _servicePackages = List.from(MockData.servicePackages);

    // Initial mock active booking with checklist to demonstrate immediately
    final initialService = _services.firstWhere((s) => s.id == 'srv-sabji-mandi');
    final initialBooking = Booking(
      id: 'QS-89211',
      service: initialService,
      status: BookingStatus.inProgress,
      bookingType: 'instant',
      createdAt: DateTime.now().subtract(const Duration(minutes: 25)),
      startOtp: '5192',
      assignedPartner: _activePartner,
      taskDescription: 'Early morning wholesale sabji mandi purchase with cash memo upload.',
      checklist: [
        ChecklistItem(id: 'chk-1', name: 'Aloo (Potato)', quantity: '2 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-2', name: 'Pyaaz (Onion)', quantity: '2 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-3', name: 'Tamatar (Tomato)', quantity: '1 kg', isPurchased: true, category: 'sabji'),
        ChecklistItem(id: 'chk-4', name: 'Amul Taza Doodh', quantity: '2 packet', isPurchased: false, category: 'kirana'),
      ],
      reimbursement: RunnerReimbursement(
        billPhotoUrl: 'https://images.unsplash.com/photo-1554415707-9e4c19a42f63?auto=format&fit=crop&w=400&q=80',
        billPhotoName: 'mandi_cash_memo_receipt.jpg',
        totalItemsAmount: 285.0,
        memoNotes: 'Purchased fresh wholesale vegetables from Mandi Gate 2 stall.',
        uploadedAt: DateTime.now().subtract(const Duration(minutes: 5)),
      ),
      pricing: BookingPricing(
        pricingType: 'hourly',
        hourlyLaborRate: 149.0,
        hoursSpent: 1.0,
        laborSubtotal: 149.0,
        actualItemsCost: 285.0,
        totalAmount: 434.0,
      ),
      isRecurring: true,
      recurrenceFrequency: 'weekly',
    );

    _bookings.add(initialBooking);
    _activeBooking = initialBooking;
  }

  // Getters
  List<ServiceItem> get services {
    if (_selectedCategory == 'All') return _services;
    return _services.where((s) => s.category.toLowerCase().contains(_selectedCategory.toLowerCase()) || s.categoryTag.toLowerCase() == _selectedCategory.toLowerCase()).toList();
  }

  List<SubscriptionPlan> get subscriptionPlans => _subscriptionPlans;
  List<ServicePackage> get servicePackages => _servicePackages;
  List<Booking> get bookings => _bookings;
  Booking? get activeBooking => _activeBooking;
  Partner get activePartner => _activePartner;
  bool get isSosActive => _isSosActive;
  String get selectedCategory => _selectedCategory;
  bool get hasIncomingJob => _hasIncomingJob;
  Booking? get incomingJob => _incomingJob;
  int get incomingJobTimerSeconds => _incomingJobTimerSeconds;

  void setSelectedCategory(String category) {
    _selectedCategory = category;
    notifyListeners();
  }

  void setActiveBooking(Booking? booking) {
    _activeBooking = booking;
    notifyListeners();
  }

  void togglePartnerOnline() {
    _activePartner = _activePartner.copyWith(isOnline: !_activePartner.isOnline);
    notifyListeners();
  }

  // Create Booking
  Booking createBooking({
    required ServiceItem service,
    ServiceSubOption? subOption,
    required String bookingType,
    DateTime? scheduledTime,
    required String taskDescription,
    List<ChecklistItem> checklist = const [],
    bool isRecurring = false,
    String? recurrenceFrequency,
    String? packageId,
    String? packageName,
    double discount = 0.0,
    String paymentMethod = 'upi',
  }) {
    final double laborRate = subOption?.price ?? service.basePrice;
    final double laborSubtotal = laborRate;
    final double totalAmount = (laborSubtotal - discount).clamp(0.0, double.infinity);

    final String generatedOtp = '${1000 + (DateTime.now().millisecondsSinceEpoch % 9000)}';
    final String bookingId = 'QS-${10000 + (_bookings.length + 1) * 37}';

    final newBooking = Booking(
      id: bookingId,
      service: service,
      selectedSubOption: subOption,
      status: BookingStatus.assigned,
      bookingType: bookingType,
      createdAt: DateTime.now(),
      scheduledTime: scheduledTime,
      startOtp: generatedOtp,
      assignedPartner: _activePartner,
      taskDescription: taskDescription,
      checklist: List.from(checklist),
      pricing: BookingPricing(
        pricingType: service.pricingType,
        hourlyLaborRate: laborRate,
        hoursSpent: 1.0,
        laborSubtotal: laborSubtotal,
        actualItemsCost: 0.0,
        discount: discount,
        totalAmount: totalAmount,
      ),
      isRecurring: isRecurring,
      recurrenceFrequency: recurrenceFrequency,
      packageId: packageId,
      packageName: packageName,
      paymentMethod: paymentMethod,
    );

    _bookings.insert(0, newBooking);
    _activeBooking = newBooking;

    // Simulate incoming job push on partner device
    _triggerPartnerIncomingJob(newBooking);

    notifyListeners();
    return newBooking;
  }

  void _triggerPartnerIncomingJob(Booking booking) {
    _hasIncomingJob = true;
    _incomingJob = booking;
    _incomingJobTimerSeconds = 30;
    _jobCountdownTimer?.cancel();

    _jobCountdownTimer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_incomingJobTimerSeconds > 1) {
        _incomingJobTimerSeconds--;
        notifyListeners();
      } else {
        timer.cancel();
        _hasIncomingJob = false;
        notifyListeners();
      }
    });
  }

  void acceptPartnerJob() {
    _jobCountdownTimer?.cancel();
    _hasIncomingJob = false;
    notifyListeners();
  }

  void rejectPartnerJob() {
    _jobCountdownTimer?.cancel();
    _hasIncomingJob = false;
    _incomingJob = null;
    notifyListeners();
  }

  // Toggle checklist item purchased state
  void toggleChecklistItem(String bookingId, String itemId) {
    final bookingIndex = _bookings.indexWhere((b) => b.id == bookingId);
    if (bookingIndex != -1) {
      final updatedChecklist = _bookings[bookingIndex].checklist.map((item) {
        if (item.id == itemId) {
          return item.copyWith(isPurchased: !item.isPurchased);
        }
        return item;
      }).toList();

      final updatedBooking = _bookings[bookingIndex].copyWith(checklist: updatedChecklist);
      _bookings[bookingIndex] = updatedBooking;
      if (_activeBooking?.id == bookingId) {
        _activeBooking = updatedBooking;
      }
      notifyListeners();
    }
  }

  // Runner cash memo reimbursement submission & dynamic formula calculation
  void submitRunnerReimbursement({
    required String bookingId,
    required double itemsBillAmount,
    required String billPhotoUrl,
    String? billPhotoName,
    String? memoNotes,
    double hoursSpent = 1.0,
  }) {
    final bookingIndex = _bookings.indexWhere((b) => b.id == bookingId);
    if (bookingIndex != -1) {
      final currentBooking = _bookings[bookingIndex];
      final double hourlyRate = currentBooking.pricing.hourlyLaborRate;
      final double laborSubtotal = hourlyRate * hoursSpent;

      // FORMULA: Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost
      final double newTotalAmount = laborSubtotal + itemsBillAmount - currentBooking.pricing.discount;

      final reimbursement = RunnerReimbursement(
        billPhotoUrl: billPhotoUrl,
        billPhotoName: billPhotoName ?? 'cash_memo_slip.jpg',
        totalItemsAmount: itemsBillAmount,
        memoNotes: memoNotes,
        uploadedAt: DateTime.now(),
        status: 'verified',
      );

      final newPricing = BookingPricing(
        pricingType: currentBooking.pricing.pricingType,
        hourlyLaborRate: hourlyRate,
        hoursSpent: hoursSpent,
        laborSubtotal: laborSubtotal,
        actualItemsCost: itemsBillAmount,
        discount: currentBooking.pricing.discount,
        totalAmount: newTotalAmount,
        formulaDescription: 'Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost',
      );

      final updatedBooking = currentBooking.copyWith(
        reimbursement: reimbursement,
        pricing: newPricing,
      );

      _bookings[bookingIndex] = updatedBooking;
      if (_activeBooking?.id == bookingId) {
        _activeBooking = updatedBooking;
      }

      // Update partner today earnings
      _activePartner = _activePartner.copyWith(
        todayEarnings: _activePartner.todayEarnings + laborSubtotal,
        completedJobs: _activePartner.completedJobs + 1,
      );

      notifyListeners();
    }
  }

  // Update Booking Status
  void updateBookingStatus(String bookingId, BookingStatus newStatus) {
    final index = _bookings.indexWhere((b) => b.id == bookingId);
    if (index != -1) {
      final updatedBooking = _bookings[index].copyWith(status: newStatus);
      _bookings[index] = updatedBooking;
      if (_activeBooking?.id == bookingId) {
        _activeBooking = updatedBooking;
      }
      notifyListeners();
    }
  }

  // Emergency SOS trigger
  void triggerEmergencySos() {
    _isSosActive = true;
    notifyListeners();
  }

  void dismissEmergencySos() {
    _isSosActive = false;
    notifyListeners();
  }

  @override
  void dispose() {
    _jobCountdownTimer?.cancel();
    super.dispose();
  }
}
