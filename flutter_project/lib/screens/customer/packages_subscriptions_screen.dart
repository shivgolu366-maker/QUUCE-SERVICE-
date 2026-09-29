import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../providers/quick_service_provider.dart';
import '../../constants/app_theme.dart';

class PackagesSubscriptionsScreen extends StatelessWidget {
  const PackagesSubscriptionsScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final provider = Provider.of<QuickServiceProvider>(context);

    return DefaultTabController(
      length: 2,
      child: Scaffold(
        appBar: AppBar(
          title: const Text('Passes & Service Packages'),
          bottom: const TabBar(
            indicatorColor: AppTheme.primaryAmber,
            labelColor: AppTheme.primaryAmber,
            unselectedLabelColor: AppTheme.textMuted,
            tabs: [
              Tab(text: 'Recurring Passes'),
              Tab(text: 'Bundled Packages'),
            ],
          ),
        ),
        body: TabBarView(
          children: [
            // Tab 1: Recurring Passes (Weekly & Monthly)
            ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.subscriptionPlans.length,
              itemBuilder: (context, index) {
                final plan = provider.subscriptionPlans[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Card(
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
                                  'SAVE ${plan.savingsPercent}%',
                                  style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold, fontSize: 10),
                                ),
                              ),
                              Text(
                                '${plan.totalVisits} Trips / Month',
                                style: const TextStyle(color: AppTheme.textMuted, fontSize: 11),
                              ),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            plan.title,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textLight),
                          ),
                          const SizedBox(height: 4),
                          Text(
                            plan.subtitle,
                            style: const TextStyle(color: AppTheme.textMuted, fontSize: 12),
                          ),
                          const SizedBox(height: 12),
                          ...plan.benefits.map((b) => Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Row(
                                  children: [
                                    const Icon(Icons.check, color: AppTheme.emeraldAccent, size: 14),
                                    const SizedBox(width: 8),
                                    Expanded(child: Text(b, style: const TextStyle(color: AppTheme.textLight, fontSize: 11))),
                                  ],
                                ),
                              )),
                          const SizedBox(height: 14),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.baseline,
                                textBaseline: TextBaseline.alphabetic,
                                children: [
                                  Text(
                                    '₹${plan.discountedPrice.toInt()}',
                                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.primaryAmber),
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    '₹${plan.originalPrice.toInt()}',
                                    style: const TextStyle(decoration: TextDecoration.lineThrough, color: AppTheme.textMuted, fontSize: 12),
                                  ),
                                  const Text(' /mo', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                                ],
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('🎉 Subscribed to ${plan.title}! Pass activated in your account.')),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                ),
                                child: const Text('Subscribe Pass', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),

            // Tab 2: Bundled Care Packages
            ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: provider.servicePackages.length,
              itemBuilder: (context, index) {
                final pkg = provider.servicePackages[index];
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: Card(
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
                                  color: AppTheme.emeraldAccent.withOpacity(0.15),
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  pkg.badgeText,
                                  style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 10),
                                ),
                              ),
                              Text('Save ₹${pkg.savingsAmount.toInt()}', style: const TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 11)),
                            ],
                          ),
                          const SizedBox(height: 10),
                          Text(
                            pkg.title,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: AppTheme.textLight),
                          ),
                          const SizedBox(height: 4),
                          Text(pkg.tagline, style: const TextStyle(color: AppTheme.textMuted, fontSize: 12)),
                          const SizedBox(height: 12),
                          const Text('Included Services:', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.textLight)),
                          const SizedBox(height: 6),
                          ...pkg.includedServices.map((s) => Padding(
                                padding: const EdgeInsets.only(bottom: 4),
                                child: Row(
                                  children: [
                                    const Icon(Icons.arrow_right, color: AppTheme.primaryAmber, size: 16),
                                    const SizedBox(width: 4),
                                    Expanded(child: Text(s, style: const TextStyle(color: AppTheme.textLight, fontSize: 11))),
                                  ],
                                ),
                              )),
                          const SizedBox(height: 14),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.between,
                            children: [
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    '₹${pkg.bundlePrice.toInt()}',
                                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: AppTheme.primaryAmber),
                                  ),
                                  Text('Est: ${pkg.durationEstimate}', style: const TextStyle(color: AppTheme.textMuted, fontSize: 10)),
                                ],
                              ),
                              ElevatedButton(
                                onPressed: () {
                                  ScaffoldMessenger.of(context).showSnackBar(
                                    SnackBar(content: Text('📦 Booked package ${pkg.title}! Supervisor scheduled.')),
                                  );
                                },
                                style: ElevatedButton.styleFrom(
                                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                                ),
                                child: const Text('Book Package', style: TextStyle(fontSize: 12)),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
          ],
        ),
      ),
    );
  }
}
