import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/quick_service_provider.dart';
import '../../models/booking.dart';
import '../../constants/app_theme.dart';

class RunnerReimbursementScreen extends StatefulWidget {
  final Booking booking;

  const RunnerReimbursementScreen({Key? key, required this.booking}) : super(key: key);

  @override
  State<RunnerReimbursementScreen> createState() => _RunnerReimbursementScreenState();
}

class _RunnerReimbursementScreenState extends State<RunnerReimbursementScreen> {
  final TextEditingController _amountCtrl = TextEditingController(text: '285.00');
  final TextEditingController _notesCtrl = TextEditingController(text: 'Purchased A-grade fresh produce from Mandi Gate 2 stall.');
  String _billPhotoUrl = 'https://images.unsplash.com/photo-1554415707-9e4c19a42f63?auto=format&fit=crop&w=600&q=80';
  double _hoursSpent = 1.0;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);
    final booking = provider.bookings.firstWhere(
      (b) => b.id == widget.booking.id,
      orElse: () => widget.booking,
    );

    final double hourlyRate = booking.pricing.hourlyLaborRate;
    final double laborSubtotal = hourlyRate * _hoursSpent;
    final double itemsCost = double.tryParse(_amountCtrl.text) ?? 0.0;
    // FORMULA: Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost
    final double dynamicTotal = laborSubtotal + itemsCost;

    return Scaffold(
      appBar: AppBar(
        title: Text('Task Runner Memo: ${booking.id}'),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Instructions banner
            Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.primaryAmber.withOpacity(0.12),
                borderRadius: BorderRadius.circular(12),
                border: Border.all(color: AppTheme.primaryAmber.withOpacity(0.3)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.info_outline, color: AppTheme.primaryAmber, size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      'Tick off items as purchased in market, take a crisp photo of physical bill, and enter exact total for instant reimbursement.',
                      style: TextStyle(color: AppTheme.textLight, fontSize: 11),
                    ),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 16),

            // Checklist verification section
            if (booking.checklist.isNotEmpty) ...[
              const Text(
                '1. Customer Shopping Checklist (Tick to Verify)',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight),
              ),
              const SizedBox(height: 8),
              Container(
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppTheme.darkBorder),
                ),
                child: ListView.separated(
                  shrinkWrap: true,
                  physics: const NeverScrollableScrollPhysics(),
                  itemCount: booking.checklist.length,
                  separatorBuilder: (_, __) => const Divider(color: AppTheme.darkBorder, height: 1),
                  itemBuilder: (context, index) {
                    final item = booking.checklist[index];
                    return CheckboxListTile(
                      value: item.isPurchased,
                      activeColor: AppTheme.emeraldAccent,
                      checkColor: Colors.black,
                      title: Text(
                        item.name,
                        style: TextStyle(
                          color: item.isPurchased ? AppTheme.textLight : AppTheme.textMuted,
                          fontWeight: FontWeight.w600,
                          fontSize: 13,
                        ),
                      ),
                      subtitle: Text(
                        'Qty: ${item.quantity}',
                        style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 11),
                      ),
                      onChanged: (_) {
                        provider.toggleChecklistItem(booking.id, item.id);
                      },
                    );
                  },
                ),
              ),
              const SizedBox(height: 20),
            ],

            // Step 2: Upload Cash Memo Photo
            const Text(
              '2. Physical Cash Memo / Mandi Slip Photograph',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight),
            ),
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: AppTheme.darkSurface,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppTheme.darkBorder),
              ),
              child: Column(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: CachedNetworkImage(
                      imageUrl: _billPhotoUrl,
                      height: 160,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),
                  const SizedBox(height: 10),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      ElevatedButton.icon(
                        onPressed: () {
                          // Simulate camera capture with alternative receipt photo
                          setState(() {
                            _billPhotoUrl = 'https://images.unsplash.com/photo-1554415707-9e4c19a42f63?auto=format&fit=crop&w=700&q=80';
                          });
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(content: Text('📸 Cash memo receipt captured!'), backgroundColor: AppTheme.emeraldAccent),
                          );
                        },
                        icon: const Icon(Icons.camera_alt, size: 16),
                        label: const Text('Capture with Camera', style: TextStyle(fontSize: 12)),
                        style: ElevatedButton.styleFrom(
                          backgroundColor: AppTheme.darkCard,
                          foregroundColor: AppTheme.textLight,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Step 3: Enter Actual Memo Amount
            const Text(
              '3. Actual Shopkeeper Cash Memo Total Amount',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight),
            ),
            const SizedBox(height: 8),
            TextField(
              controller: _amountCtrl,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.emeraldAccent),
              decoration: const InputDecoration(
                prefixText: '₹ ',
                prefixStyle: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.emeraldAccent),
                hintText: 'Enter exact bill total (e.g. 285.00)',
              ),
              onChanged: (_) => setState(() {}),
            ),

            const SizedBox(height: 16),

            // Hours spent slider
            Row(
              mainAxisAlignment: MainAxisAlignment.between,
              children: [
                const Text('Hours Spent on Market Run:', style: TextStyle(fontSize: 13, color: AppTheme.textLight)),
                Text('${_hoursSpent.toStringAsFixed(1)} hr', style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold)),
              ],
            ),
            Slider(
              value: _hoursSpent,
              min: 0.5,
              max: 4.0,
              divisions: 7,
              activeColor: AppTheme.primaryAmber,
              inactiveColor: AppTheme.darkBorder,
              onChanged: (val) => setState(() => _hoursSpent = val),
            ),

            const SizedBox(height: 16),

            // Formula Breakdown Card
            Container(
              padding: const EdgeInsets.all(14),
              decoration: BoxDecoration(
                color: AppTheme.emeraldAccent.withOpacity(0.1),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppTheme.emeraldAccent.withOpacity(0.5)),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Reimbursement Formula Calculation',
                    style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.emeraldAccent, fontSize: 13),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost',
                    style: TextStyle(fontSize: 11, color: AppTheme.textLight),
                  ),
                  const Divider(color: AppTheme.darkBorder, height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      Text('Labor: (₹${hourlyRate.toInt()} × ${_hoursSpent.toStringAsFixed(1)}h):', style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                      Text('₹${laborSubtotal.toStringAsFixed(2)}', style: const TextStyle(color: AppTheme.textLight, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const SizedBox(height: 4),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Actual Items Cash Memo:', style: TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                      Text('+ ₹${itemsCost.toStringAsFixed(2)}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold)),
                    ],
                  ),
                  const Divider(color: AppTheme.darkBorder, height: 16),
                  Row(
                    mainAxisAlignment: MainAxisAlignment.between,
                    children: [
                      const Text('Final Customer Bill:', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 14)),
                      Text(
                        '₹${dynamicTotal.toStringAsFixed(2)}',
                        style: const TextStyle(fontWeight: FontWeight.w900, fontSize: 18, color: AppTheme.primaryAmber),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 24),

            // Submit Button
            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                onPressed: () {
                  provider.submitRunnerReimbursement(
                    bookingId: booking.id,
                    itemsBillAmount: itemsCost,
                    billPhotoUrl: _billPhotoUrl,
                    memoNotes: _notesCtrl.text,
                    hoursSpent: _hoursSpent,
                  );

                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(
                      content: Text('✅ Memo & bill submitted! Customer bill updated with formula.'),
                      backgroundColor: AppTheme.emeraldAccent,
                    ),
                  );

                  Navigator.pop(context);
                },
                child: const Text('Submit Verified Memo & Update Bill'),
              ),
            ),

            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }
}
