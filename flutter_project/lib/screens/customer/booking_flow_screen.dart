import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../models/service_item.dart';
import '../../models/checklist_item.dart';
import '../../providers/quick_service_provider.dart';
import '../../constants/app_theme.dart';
import '../../widgets/shopping_checklist_widget.dart';
import 'live_tracking_screen.dart';

class BookingFlowScreen extends StatefulWidget {
  final ServiceItem service;
  final ServiceSubOption? selectedSubOption;

  const BookingFlowScreen({
    Key? key,
    required this.service,
    this.selectedSubOption,
  }) : super(key: key);

  @override
  State<BookingFlowScreen> createState() => _BookingFlowScreenState();
}

class _BookingFlowScreenState extends State<BookingFlowScreen> {
  String _bookingType = 'instant';
  DateTime? _scheduledDateTime;
  final TextEditingController _taskDescriptionCtrl = TextEditingController();
  final TextEditingController _couponCtrl = TextEditingController();
  List<ChecklistItem> _checklist = [];
  bool _isRecurring = false;
  String _recurrenceFreq = 'weekly';
  String _paymentMethod = 'upi';
  double _discount = 0.0;

  @override
  void initState() {
    super.initState();
    // Default initial items for sabji/kirana if checklist is supported
    if (widget.service.hasChecklist) {
      if (widget.service.categoryTag == 'sabji') {
        _checklist = [
          ChecklistItem(id: 'c1', name: 'Aloo (Potato)', quantity: '2 kg', category: 'sabji'),
          ChecklistItem(id: 'c2', name: 'Tamatar (Tomato)', quantity: '1 kg', category: 'sabji'),
          ChecklistItem(id: 'c3', name: 'Pyaaz (Onion)', quantity: '2 kg', category: 'sabji'),
        ];
      } else if (widget.service.categoryTag == 'kirana') {
        _checklist = [
          ChecklistItem(id: 'c1', name: 'Amul Taza Doodh', quantity: '2 pkts', category: 'kirana'),
          ChecklistItem(id: 'c2', name: 'Atta 5kg Chakki Fresh', quantity: '1 bag', category: 'kirana'),
        ];
      }
    }
  }

  void _applyCoupon() {
    final code = _couponCtrl.text.trim().toUpperCase();
    if (code == 'QUICK100' || code == 'MANDI20') {
      setState(() {
        _discount = 50.0;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('🎉 Coupon applied! ₹50 discount added.'), backgroundColor: AppTheme.emeraldAccent),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Invalid coupon code.'), backgroundColor: AppTheme.roseSos),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context, listen: false);
    final double laborRate = widget.selectedSubOption?.price ?? widget.service.basePrice;
    final double recurringDiscount = _isRecurring ? (laborRate * 0.20) : 0.0;
    final double totalEstimated = (laborRate - _discount - recurringDiscount).clamp(0.0, 99999.0);

    return Scaffold(
      appBar: AppBar(
        title: Text('Book ${widget.service.title}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Instant vs Scheduled Selection
            const Text('Dispatch Type', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textLight)),
            const SizedBox(height: 8),
            Row(
              children: [
                Expanded(
                  child: InkWell(
                    onTap: () => setState(() => _bookingType = 'instant'),
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _bookingType == 'instant' ? AppTheme.primaryAmber.withOpacity(0.15) : AppTheme.darkSurface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _bookingType == 'instant' ? AppTheme.primaryAmber : AppTheme.darkBorder,
                          width: _bookingType == 'instant' ? 1.5 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.bolt, color: _bookingType == 'instant' ? AppTheme.primaryAmber : AppTheme.textMuted),
                          const SizedBox(height: 4),
                          const Text('Instant Dispatch', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textLight)),
                          const Text('Runner arrives in 15m', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                        ],
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: InkWell(
                    onTap: () async {
                      setState(() => _bookingType = 'scheduled');
                      final pickedDate = await showDatePicker(
                        context: context,
                        initialDate: DateTime.now().add(const Duration(days: 1)),
                        firstDate: DateTime.now(),
                        lastDate: DateTime.now().add(const Duration(days: 30)),
                      );
                      if (pickedDate != null) {
                        setState(() => _scheduledDateTime = pickedDate);
                      }
                    },
                    borderRadius: BorderRadius.circular(12),
                    child: Container(
                      padding: const EdgeInsets.symmetric(vertical: 12),
                      decoration: BoxDecoration(
                        color: _bookingType == 'scheduled' ? AppTheme.primaryAmber.withOpacity(0.15) : AppTheme.darkSurface,
                        borderRadius: BorderRadius.circular(12),
                        border: Border.all(
                          color: _bookingType == 'scheduled' ? AppTheme.primaryAmber : AppTheme.darkBorder,
                          width: _bookingType == 'scheduled' ? 1.5 : 1,
                        ),
                      ),
                      child: Column(
                        children: [
                          Icon(Icons.calendar_today, color: _bookingType == 'scheduled' ? AppTheme.primaryAmber : AppTheme.textMuted),
                          const SizedBox(height: 4),
                          const Text('Schedule Slot', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textLight)),
                          Text(
                            _scheduledDateTime != null ? '${_scheduledDateTime!.day}/${_scheduledDateTime!.month}' : 'Select date & time',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Shopping Checklist Builder if applicable
            if (widget.service.hasChecklist) ...[
              ShoppingChecklistEditor(
                initialItems: _checklist,
                categoryTag: widget.service.categoryTag,
                onChanged: (updatedList) {
                  setState(() => _checklist = updatedList);
                },
              ),
              const SizedBox(height: 20),
            ],

            // Recurring subscription toggle
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: _isRecurring ? AppTheme.primaryAmber : AppTheme.darkBorder),
              ),
              child: Row(
                children: [
                  const Icon(Icons.repeat, color: AppTheme.primaryAmber, size: 24),
                  const SizedBox(width: 12),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Repeat Booking Subscription', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 13)),
                        Text('Save 20% on every recurring trip. Cancel anytime.', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                      ],
                    ),
                  ),
                  Switch(
                    value: _isRecurring,
                    activeColor: AppTheme.primaryAmber,
                    onChanged: (val) => setState(() => _isRecurring = val),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Task instructions
            const Text('Special Instructions / Landmark Note', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight)),
            const SizedBox(height: 8),
            TextField(
              controller: _taskDescriptionCtrl,
              maxLines: 2,
              style: const TextStyle(fontSize: 13, color: AppTheme.textLight),
              decoration: const InputDecoration(
                hintText: 'e.g. Ring bell twice, ensure green vegetables are crisp and not overripe...',
              ),
            ),

            const SizedBox(height: 20),

            // Promo code
            Row(
              children: [
                Expanded(
                  child: TextField(
                    controller: _couponCtrl,
                    style: const TextStyle(fontSize: 13, color: AppTheme.textLight),
                    decoration: const InputDecoration(
                      hintText: 'Coupon code (Try QUICK100)',
                      contentPadding: EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                ElevatedButton(
                  onPressed: _applyCoupon,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  ),
                  child: const Text('Apply'),
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Payment Method
            const Text('Payment Method', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight)),
            const SizedBox(height: 8),
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.darkBorder),
              ),
              child: Column(
                children: [
                  RadioListTile<String>(
                    value: 'upi_qr',
                    groupValue: _paymentMethod,
                    title: const Text('Scan Dynamic UPI QR Code (Zero Surcharge)', style: TextStyle(fontSize: 13, color: AppTheme.textLight, fontWeight: FontWeight.w600)),
                    subtitle: const Text('Scan & pay via Google Pay, PhonePe, Paytm, BHIM, Cred', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                    activeColor: AppTheme.primaryAmber,
                    contentPadding: EdgeInsets.zero,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                  ),
                  RadioListTile<String>(
                    value: 'upi',
                    groupValue: _paymentMethod,
                    title: const Text('UPI App Intent / VPA Collect', style: TextStyle(fontSize: 13, color: AppTheme.textLight)),
                    activeColor: AppTheme.primaryAmber,
                    contentPadding: EdgeInsets.zero,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                  ),
                  RadioListTile<String>(
                    value: 'cash',
                    groupValue: _paymentMethod,
                    title: const Text('Pay Runner in Cash / UPI after Memo Delivery', style: TextStyle(fontSize: 13, color: AppTheme.textLight)),
                    activeColor: AppTheme.primaryAmber,
                    contentPadding: EdgeInsets.zero,
                    onChanged: (val) => setState(() => _paymentMethod = val!),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Price Breakdown Summary
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.darkBorder),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Base Labor Rate:', style: TextStyle(color: AppTheme.textMuted, fontSize: 13)),
                      Text('₹${laborRate.toInt()}', style: const TextStyle(color: AppTheme.textLight, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  if (recurringDiscount > 0) ...[
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text('Recurring Plan (20% Off):', style: TextStyle(color: AppTheme.emeraldAccent, fontSize: 13)),
                        Text('-₹${recurringDiscount.toInt()}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  if (_discount > 0) ...[
                    const SizedBox(height: 6),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        const Text('Coupon Discount:', style: TextStyle(color: AppTheme.emeraldAccent, fontSize: 13)),
                        Text('-₹${_discount.toInt()}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  if (widget.service.hasChecklist) ...[
                    const SizedBox(height: 6),
                    const Row(
                      mainAxisAlignment: MainAxisAlignment.between,
                      children: [
                        Text('Actual Items Memo Cost:', style: TextStyle(color: AppTheme.primaryAmber, fontSize: 12)),
                        Text('+ Added via Paper Memo', style: TextStyle(color: AppTheme.primaryAmber, fontSize: 12, fontWeight: FontWeight.bold)),
                      ],
                    ),
                  ],
                  const Divider(color: AppTheme.darkBorder, height: 20),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Estimated Labor Subtotal:', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 14)),
                      Text('₹${totalEstimated.toInt()}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.primaryAmber)),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 30),

            // Confirm Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton(
                onPressed: () {
                  final newBooking = provider.createBooking(
                    service: widget.service,
                    subOption: widget.selectedSubOption,
                    bookingType: _bookingType,
                    scheduledTime: _scheduledDateTime,
                    taskDescription: _taskDescriptionCtrl.text.isEmpty
                        ? 'Standard ${widget.service.title} task dispatch'
                        : _taskDescriptionCtrl.text,
                    checklist: _checklist,
                    isRecurring: _isRecurring,
                    recurrenceFrequency: _isRecurring ? _recurrenceFreq : null,
                    discount: _discount + recurringDiscount,
                    paymentMethod: _paymentMethod,
                  );

                  Navigator.pushReplacement(
                    context,
                    MaterialPageRoute(
                      builder: (_) => LiveTrackingScreen(bookingId: newBooking.id),
                    ),
                  );
                },
                child: const Text('Confirm & Dispatch Runner Now', style: TextStyle(fontSize: 16)),
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
