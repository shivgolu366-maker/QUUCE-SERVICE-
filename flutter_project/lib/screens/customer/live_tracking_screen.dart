import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/quick_service_provider.dart';
import '../../models/booking.dart';
import '../../constants/app_theme.dart';
import '../../widgets/sos_bottom_sheet.dart';

class LiveTrackingScreen extends StatelessWidget {
  final String bookingId;

  const LiveTrackingScreen({Key? key, required this.bookingId}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);
    final booking = provider.bookings.firstWhere(
      (b) => b.id == bookingId,
      orElse: () => provider.bookings.first,
    );

    final partner = booking.assignedPartner;
    final reimbursement = booking.reimbursement;

    return Scaffold(
      appBar: AppBar(
        title: Text('Order ${booking.id}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.warning_amber_rounded, color: AppTheme.roseSos),
            onPressed: () => SosBottomSheet.show(context),
            tooltip: 'Emergency SOS',
          ),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Live Simulation Map View Container
            Container(
              height: 200,
              width: double.infinity,
              decoration: const BoxDecoration(
                color: Color(0xFF0F172A),
              ),
              child: Stack(
                children: [
                  // Vector Grid / GPS Simulation Map
                  Positioned.fill(
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: RadialGradient(
                          center: const Alignment(0, 0),
                          radius: 1.0,
                          colors: [
                            AppTheme.primaryAmber.withOpacity(0.08),
                            const Color(0xFF090D16),
                          ],
                        ),
                      ),
                      child: CustomPaint(
                        painter: MapGridPainter(),
                      ),
                    ),
                  ),

                  // Center Runner & Customer Beacon
                  Center(
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: AppTheme.darkBg.withOpacity(0.9),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: AppTheme.primaryAmber),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Container(
                                width: 8,
                                height: 8,
                                decoration: const BoxDecoration(
                                  color: AppTheme.emeraldAccent,
                                  shape: BoxShape.circle,
                                ),
                              ),
                              const SizedBox(width: 8),
                              const Text(
                                'Runner 0.8 km away • Arriving in ~6 mins',
                                style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 12),
                        const Icon(Icons.two_wheeler, color: AppTheme.primaryAmber, size: 36),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Main Content Area
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 4-Digit Secure Start OTP Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primaryAmber, width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryAmber.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(Icons.vpn_key, color: AppTheme.primaryAmber, size: 24),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text('Start Task Secure OTP', style: TextStyle(fontSize: 11, color: AppTheme.textMuted)),
                              const SizedBox(height: 2),
                              Text(
                                booking.startOtp,
                                style: const TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.w900,
                                  letterSpacing: 4,
                                  color: AppTheme.primaryAmber,
                                ),
                              ),
                            ],
                          ),
                        ),
                        const Text(
                          'Share only when\nrunner arrives',
                          textAlign: TextAlign.right,
                          style: TextStyle(color: AppTheme.textMuted, fontSize: 10),
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 16),

                  // Runner Profile & Masked Call / Chat Actions
                  if (partner != null)
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.darkSurface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.darkBorder),
                      ),
                      child: Row(
                        children: [
                          ClipRRect(
                            borderRadius: BorderRadius.circular(12),
                            child: CachedNetworkImage(
                              imageUrl: partner.photoUrl,
                              width: 50,
                              height: 50,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Row(
                                  children: [
                                    Text(
                                      partner.name,
                                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight),
                                    ),
                                    const SizedBox(width: 6),
                                    const Icon(Icons.verified, color: AppTheme.primaryAmber, size: 14),
                                  ],
                                ),
                                const SizedBox(height: 2),
                                Text(
                                  '⭐ ${partner.rating} (${partner.completedJobs} trips) • ${partner.vehicleType}',
                                  style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                                ),
                              ],
                            ),
                          ),
                          // Masked Call
                          IconButton(
                            style: IconButton.styleFrom(
                              backgroundColor: AppTheme.emeraldAccent.withOpacity(0.15),
                              foregroundColor: AppTheme.emeraldAccent,
                            ),
                            icon: const Icon(Icons.call, size: 20),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(content: Text('📞 Connecting secure masked call with ${partner.name}...')),
                              );
                            },
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 16),

                  // Shopping Checklist Progress (If available)
                  if (booking.checklist.isNotEmpty) ...[
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.darkSurface,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.darkBorder),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              const Row(
                                children: [
                                  Icon(Icons.checklist, color: AppTheme.primaryAmber, size: 18),
                                  SizedBox(width: 8),
                                  Text('Shopping Checklist Live Status', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textLight)),
                                ],
                              ),
                              Text(
                                '${booking.checklist.where((i) => i.isPurchased).length} / ${booking.checklist.length} Purchased',
                                style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 11, fontWeight: FontWeight.bold),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          ...booking.checklist.map((item) {
                            return Padding(
                              padding: const EdgeInsets.symmetric(vertical: 4),
                              child: Row(
                                children: [
                                  Icon(
                                    item.isPurchased ? Icons.check_circle : Icons.circle_outlined,
                                    color: item.isPurchased ? AppTheme.emeraldAccent : AppTheme.textMuted,
                                    size: 16,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      item.name,
                                      style: TextStyle(
                                        color: item.isPurchased ? AppTheme.textLight : AppTheme.textMuted,
                                        decoration: item.isPurchased ? TextDecoration.lineThrough : null,
                                        fontSize: 12,
                                      ),
                                    ),
                                  ),
                                  Text(
                                    item.quantity,
                                    style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 11, fontWeight: FontWeight.bold),
                                  ),
                                ],
                              ),
                            );
                          }),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Cash Memo Receipt & Dynamic Bill Formula
                  if (reimbursement != null) ...[
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.emeraldAccent.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.emeraldAccent.withOpacity(0.4)),
                      ),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Icon(Icons.receipt_long, color: AppTheme.emeraldAccent, size: 18),
                              const SizedBox(width: 8),
                              const Expanded(
                                child: Text('Shopkeeper Cash Memo Reimbursement', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.emeraldAccent)),
                              ),
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: AppTheme.emeraldAccent,
                                  borderRadius: BorderRadius.circular(4),
                                ),
                                child: const Text('ATTACHED', style: TextStyle(color: Colors.black, fontSize: 9, fontWeight: FontWeight.bold)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(10),
                            child: CachedNetworkImage(
                              imageUrl: reimbursement.billPhotoUrl,
                              height: 140,
                              width: double.infinity,
                              fit: BoxFit.cover,
                            ),
                          ),
                          const SizedBox(height: 10),
                          Text('Note: ${reimbursement.memoNotes ?? "Attached physical memo"}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 10),
                          const Divider(color: AppTheme.darkBorder),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              const Text('Actual Items Memo Cost:', style: TextStyle(color: AppTheme.textLight, fontSize: 12)),
                              Text('₹${reimbursement.totalItemsAmount.toStringAsFixed(2)}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 14)),
                            ],
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 16),
                  ],

                  // Live Total Bill Calculation Card
                  Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      color: AppTheme.darkSurface,
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.darkBorder),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('Billing Breakdown', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textLight)),
                        const SizedBox(height: 8),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            Text('Labor Subtotal (${booking.pricing.hoursSpent} hr):', style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                            Text('₹${booking.pricing.laborSubtotal.toInt()}', style: const TextStyle(color: AppTheme.textLight, fontWeight: FontWeight.bold)),
                          ],
                        ),
                        if (booking.pricing.actualItemsCost > 0) ...[
                          const SizedBox(height: 6),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              const Text('Actual Items Memo Cost:', style: TextStyle(color: AppTheme.emeraldAccent, fontSize: 12)),
                              Text('+ ₹${booking.pricing.actualItemsCost.toStringAsFixed(2)}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold)),
                            ],
                          ),
                        ],
                        const Divider(color: AppTheme.darkBorder, height: 16),
                        Row(
                          mainAxisAlignment: MainAxisAlignment.between,
                          children: [
                            const Text('Total Payable:', style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 14)),
                            Text('₹${booking.pricing.totalAmount.toStringAsFixed(2)}', style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 18, color: AppTheme.primaryAmber)),
                          ],
                        ),
                      ],
                    ),
                  ),

                  const SizedBox(height: 40),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class MapGridPainter extends CustomPainter {
  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = const Color(0xFF1E293B).withOpacity(0.5)
      ..strokeWidth = 1;

    for (double i = 0; i < size.width; i += 30) {
      canvas.drawLine(Offset(i, 0), Offset(i, size.height), paint);
    }
    for (double j = 0; j < size.height; j += 30) {
      canvas.drawLine(Offset(0, j), Offset(size.width, j), paint);
    }
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
