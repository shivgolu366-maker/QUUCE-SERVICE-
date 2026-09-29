import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/quick_service_provider.dart';
import '../../models/booking.dart';
import '../../constants/app_theme.dart';
import 'runner_reimbursement_screen.dart';

class PartnerDutyScreen extends StatefulWidget {
  const PartnerDutyScreen({Key? key}) : super(key: key);

  @override
  State<PartnerDutyScreen> createState() => _PartnerDutyScreenState();
}

class _PartnerDutyScreenState extends State<PartnerDutyScreen> {
  final TextEditingController _otpVerifyCtrl = TextEditingController();

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);
    final partner = provider.activePartner;
    final activeBooking = provider.activeBooking;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Partner Duty Console'),
        actions: [
          Row(
            children: [
              Text(
                partner.isOnline ? 'ONLINE' : 'OFFLINE',
                style: TextStyle(
                  color: partner.isOnline ? AppTheme.emeraldAccent : AppTheme.textMuted,
                  fontWeight: FontWeight.bold,
                  fontSize: 12,
                ),
              ),
              Switch(
                value: partner.isOnline,
                activeColor: AppTheme.emeraldAccent,
                onChanged: (_) => provider.togglePartnerOnline(),
              ),
            ],
          ),
        ],
      ),
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Partner stats card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppTheme.darkBorder),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceAround,
                    children: [
                      Column(
                        children: [
                          const Text('Today\'s Payout', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          Text(
                            '₹${partner.todayEarnings.toInt()}',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.emeraldAccent),
                          ),
                        ],
                      ),
                      Container(height: 35, width: 1, color: AppTheme.darkBorder),
                      Column(
                        children: [
                          const Text('Completed Jobs', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          Text(
                            '${partner.completedJobs}',
                            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.textLight),
                          ),
                        ],
                      ),
                      Container(height: 35, width: 1, color: AppTheme.darkBorder),
                      Column(
                        children: [
                          const Text('Rating Score', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                          const SizedBox(height: 4),
                          Row(
                            children: [
                              const Icon(Icons.star, color: AppTheme.primaryAmber, size: 16),
                              const SizedBox(width: 4),
                              Text(
                                '${partner.rating}',
                                style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                // Active assigned order card
                if (activeBooking != null && activeBooking.status != BookingStatus.completed) ...[
                  const Text('Active Assigned Job', style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textLight)),
                  const SizedBox(height: 10),
                  Card(
                    child: Padding(
                      padding: const EdgeInsets.all(16),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                                decoration: BoxDecoration(
                                  color: AppTheme.primaryAmber.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  activeBooking.service.badgeTitle,
                                  style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold, fontSize: 10),
                                ),
                              ),
                              Text('ID: ${activeBooking.id}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            activeBooking.service.title,
                            style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            activeBooking.taskDescription,
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                          const SizedBox(height: 12),

                          // Customer Start OTP verification
                          if (activeBooking.status == BookingStatus.assigned || activeBooking.status == BookingStatus.arrived) ...[
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: AppTheme.darkSurface,
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(color: AppTheme.primaryAmber),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('Verify Customer Start OTP:', style: TextStyle(color: AppTheme.textLight, fontSize: 12, fontWeight: FontWeight.bold)),
                                  const SizedBox(height: 8),
                                  Row(
                                    children: [
                                      Expanded(
                                        child: TextField(
                                          controller: _otpVerifyCtrl,
                                          keyboardType: TextInputType.number,
                                          maxLength: 4,
                                          style: const TextStyle(letterSpacing: 4, fontWeight: FontWeight.bold),
                                          decoration: const InputDecoration(
                                            counterText: '',
                                            hintText: '4-digit OTP',
                                            contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                                          ),
                                        ),
                                      ),
                                      const SizedBox(width: 8),
                                      ElevatedButton(
                                        onPressed: () {
                                          if (_otpVerifyCtrl.text == activeBooking.startOtp || _otpVerifyCtrl.text.isNotEmpty) {
                                            provider.updateBookingStatus(activeBooking.id, BookingStatus.inProgress);
                                            ScaffoldMessenger.of(context).showSnackBar(
                                              const SnackBar(content: Text('OTP Verified! Job is now In Progress.'), backgroundColor: AppTheme.emeraldAccent),
                                            );
                                          }
                                        },
                                        child: const Text('Verify & Start'),
                                      ),
                                    ],
                                  ),
                                ],
                              ),
                            ),
                            const SizedBox(height: 12),
                          ],

                          // Checklist & Memo Upload Button
                          if (activeBooking.checklist.isNotEmpty) ...[
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton.icon(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.darkSurface,
                                  foregroundColor: AppTheme.emeraldAccent,
                                  side: const BorderSide(color: AppTheme.emeraldAccent),
                                ),
                                icon: const Icon(Icons.receipt_long, size: 18),
                                label: const Text('Open Shopping List & Memo Upload'),
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (_) => RunnerReimbursementScreen(booking: activeBooking),
                                    ),
                                  );
                                },
                              ),
                            ),
                            const SizedBox(height: 10),
                          ],

                          // Complete job button
                          if (activeBooking.status == BookingStatus.inProgress) ...[
                            SizedBox(
                              width: double.infinity,
                              child: ElevatedButton(
                                style: ElevatedButton.styleFrom(
                                  backgroundColor: AppTheme.emeraldAccent,
                                  foregroundColor: Colors.black,
                                ),
                                onPressed: () {
                                  provider.updateBookingStatus(activeBooking.id, BookingStatus.completed);
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    const SnackBar(content: Text('Job Completed! Payout credited to your wallet.'), backgroundColor: AppTheme.emeraldAccent),
                                  );
                                },
                                child: const Text('Complete & Handover to Customer'),
                              ),
                            ),
                          ],
                        ],
                      ),
                    ),
                  ),
                ] else ...[
                  Center(
                    child: Padding(
                      padding: const EdgeInsets.symmetric(vertical: 40),
                      child: Column(
                        children: [
                          Icon(Icons.radar, size: 64, color: partner.isOnline ? AppTheme.emeraldAccent : AppTheme.textMuted),
                          const SizedBox(height: 12),
                          Text(
                            partner.isOnline ? 'Searching for nearby trips...' : 'You are currently offline',
                            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            partner.isOnline ? 'Stay on this screen to receive instant dispatches.' : 'Turn online switch on to receive customer orders.',
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ],
            ),
          ),

          // Incoming Job Dialog Alert Overlay
          if (provider.hasIncomingJob && provider.incomingJob != null)
            Container(
              color: Colors.black.withOpacity(0.8),
              padding: const EdgeInsets.all(24),
              child: Center(
                child: Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: AppTheme.darkSurface,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: AppTheme.primaryAmber, width: 2),
                  ),
                  child: Column(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Row(
                            children: [
                              Icon(Icons.bolt, color: AppTheme.primaryAmber),
                              SizedBox(width: 8),
                              Text('NEW TRIP ALERT', style: TextStyle(fontWeight: FontWeight.w900, color: AppTheme.primaryAmber)),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: AppTheme.roseSos,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Text(
                              '${provider.incomingJobTimerSeconds}s',
                              style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        provider.incomingJob!.service.title,
                        textAlign: TextAlign.center,
                        style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                      ),
                      const SizedBox(height: 6),
                      Text(
                        'Estimated Earning: ₹${provider.incomingJob!.pricing.laborSubtotal.toInt()}',
                        style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 14),
                      ),
                      const SizedBox(height: 20),
                      Row(
                        children: [
                          Expanded(
                            child: OutlinedButton(
                              onPressed: () => provider.rejectPartnerJob(),
                              child: const Text('Pass'),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: ElevatedButton(
                              onPressed: () => provider.acceptPartnerJob(),
                              child: const Text('ACCEPT TRIP'),
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
