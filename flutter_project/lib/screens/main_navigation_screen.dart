import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quick_service_provider.dart';
import '../constants/app_theme.dart';
import 'customer/home_screen.dart';
import 'customer/packages_subscriptions_screen.dart';
import 'customer/live_tracking_screen.dart';
import 'partner/partner_duty_screen.dart';

class MainNavigationScreen extends StatefulWidget {
  const MainNavigationScreen({Key? key}) : super(key: key);

  @override
  State<MainNavigationScreen> createState() => _MainNavigationScreenState();
}

class _MainNavigationScreenState extends State<MainNavigationScreen> {
  int _currentIndex = 0;

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);
    final activeBooking = provider.activeBooking;

    final List<Widget> screens = [
      const HomeScreen(),
      const PackagesSubscriptionsScreen(),
      if (activeBooking != null)
        LiveTrackingScreen(bookingId: activeBooking.id)
      else
        const Center(
          child: Text('No active booking right now.', style: TextStyle(color: AppTheme.textMuted)),
        ),
      const PartnerDutyScreen(),
    ];

    return Scaffold(
      body: screens[_currentIndex],
      bottomNavigationBar: NavigationBar(
        selectedIndex: _currentIndex,
        backgroundColor: AppTheme.darkSurface,
        indicatorColor: AppTheme.primaryAmber.withOpacity(0.2),
        onDestinationSelected: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
        destinations: [
          const NavigationDestination(
            icon: Icon(Icons.home_outlined),
            selectedIcon: Icon(Icons.home, color: AppTheme.primaryAmber),
            label: 'Home',
          ),
          const NavigationDestination(
            icon: Icon(Icons.card_membership_outlined),
            selectedIcon: Icon(Icons.card_membership, color: AppTheme.primaryAmber),
            label: 'Passes',
          ),
          NavigationDestination(
            icon: Stack(
              children: [
                const Icon(Icons.location_on_outlined),
                if (activeBooking != null)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppTheme.emeraldAccent,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            selectedIcon: const Icon(Icons.location_on, color: AppTheme.primaryAmber),
            label: 'Track',
          ),
          NavigationDestination(
            icon: Stack(
              children: [
                const Icon(Icons.badge_outlined),
                if (provider.hasIncomingJob)
                  Positioned(
                    right: 0,
                    top: 0,
                    child: Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: AppTheme.roseSos,
                        shape: BoxShape.circle,
                      ),
                    ),
                  ),
              ],
            ),
            selectedIcon: const Icon(Icons.badge, color: AppTheme.primaryAmber),
            label: 'Partner Duty',
          ),
        ],
      ),
    );
  }
}
