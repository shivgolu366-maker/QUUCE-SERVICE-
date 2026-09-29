import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/quick_service_provider.dart';
import '../../constants/app_theme.dart';
import '../../widgets/service_card.dart';
import '../../widgets/sos_bottom_sheet.dart';
import 'service_detail_screen.dart';
import 'live_tracking_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({Key? key}) : super(key: key);

  final List<String> categories = const [
    'All',
    'Runner & Errands',
    'Driver & Transport',
    'Home Services',
    'Personal Care'
  ];

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);
    final activeBooking = provider.activeBooking;

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(6),
              decoration: BoxDecoration(
                color: AppTheme.primaryAmber,
                borderRadius: BorderRadius.circular(8),
              ),
              child: const Icon(Icons.flash_on, color: AppTheme.darkBg, size: 18),
            ),
            const SizedBox(width: 8),
            const Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text('Quick Service', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
                Text('Instant Local Dispatch & Errands', style: TextStyle(color: AppTheme.textMuted, fontSize: 10)),
              ],
            ),
          ],
        ),
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
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Active Ongoing Booking Tracker Card
            if (activeBooking != null)
              Padding(
                padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
                child: InkWell(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => LiveTrackingScreen(bookingId: activeBooking.id),
                      ),
                    );
                  },
                  borderRadius: BorderRadius.circular(16),
                  child: Container(
                    padding: const EdgeInsets.all(14),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF1E293B), Color(0xFF0F172A)],
                      ),
                      borderRadius: BorderRadius.circular(16),
                      border: Border.all(color: AppTheme.primaryAmber.withOpacity(0.5), width: 1.5),
                    ),
                    child: Row(
                      children: [
                        Container(
                          width: 10,
                          height: 10,
                          decoration: const BoxDecoration(
                            color: AppTheme.emeraldAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 10),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Row(
                                children: [
                                  Text(
                                    activeBooking.service.title,
                                    style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.textLight),
                                  ),
                                  const SizedBox(width: 6),
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 1),
                                    decoration: BoxDecoration(
                                      color: AppTheme.emeraldAccent.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(4),
                                    ),
                                    child: const Text('TRACK LIVE', style: TextStyle(color: AppTheme.emeraldAccent, fontSize: 9, fontWeight: FontWeight.bold)),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 2),
                              Text(
                                'OTP: ${activeBooking.startOtp} • Runner: ${activeBooking.assignedPartner?.name ?? 'Assigned'}',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                              ),
                            ],
                          ),
                        ),
                        const Icon(Icons.arrow_forward_ios, size: 14, color: AppTheme.primaryAmber),
                      ],
                    ),
                  ),
                ),
              ),

            // Emergency / Fast dispatch banner
            Padding(
              padding: const EdgeInsets.all(16),
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: BoxDecoration(
                  color: AppTheme.darkSurface,
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: AppTheme.darkBorder),
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryAmber.withOpacity(0.15),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Icon(Icons.electric_moped, color: AppTheme.primaryAmber, size: 24),
                    ),
                    const SizedBox(width: 12),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Sabji Mandi & Kirana Express Runs',
                            style: TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 13),
                          ),
                          SizedBox(height: 2),
                          Text(
                            'Runner ticks list & attaches shopkeeper memo. Transparent hourly + items bill formula.',
                            style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Category Filter Chips
            SizedBox(
              height: 40,
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 16),
                scrollDirection: Axis.horizontal,
                itemCount: categories.length,
                itemBuilder: (context, index) {
                  final cat = categories[index];
                  final isSelected = provider.selectedCategory == cat;
                  return Padding(
                    padding: const EdgeInsets.only(right: 8),
                    child: ChoiceChip(
                      selected: isSelected,
                      label: Text(cat),
                      selectedColor: AppTheme.primaryAmber,
                      backgroundColor: AppTheme.darkSurface,
                      labelStyle: TextStyle(
                        color: isSelected ? AppTheme.darkBg : AppTheme.textLight,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                        fontSize: 12,
                      ),
                      onSelected: (_) => provider.setSelectedCategory(cat),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 16),

            // Services Grid
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.between,
                children: [
                  const Text(
                    'Available Instant Services',
                    style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppTheme.textLight),
                  ),
                  Text(
                    '${provider.services.length} ready nearby',
                    style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 12, fontWeight: FontWeight.bold),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 12),

            GridView.builder(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
                crossAxisCount: 2,
                childAspectRatio: 0.68,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
              ),
              itemCount: provider.services.length,
              itemBuilder: (context, index) {
                final service = provider.services[index];
                return ServiceBadgeCard(
                  service: service,
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => ServiceDetailScreen(service: service),
                      ),
                    );
                  },
                );
              },
            ),

            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
