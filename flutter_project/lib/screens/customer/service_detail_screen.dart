import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../models/service_item.dart';
import '../../constants/app_theme.dart';
import 'booking_flow_screen.dart';

class ServiceDetailScreen extends StatefulWidget {
  final ServiceItem service;

  const ServiceDetailScreen({Key? key, required this.service}) : super(key: key);

  @override
  State<ServiceDetailScreen> createState() => _ServiceDetailScreenState();
}

class _ServiceDetailScreenState extends State<ServiceDetailScreen> {
  ServiceSubOption? _selectedSubOption;

  @override
  void initState() {
    super.initState();
    if (widget.service.subOptions.isNotEmpty) {
      _selectedSubOption = widget.service.subOptions.first;
    }
  }

  @override
  Widget build(BuildContext context) {
    final double displayPrice = _selectedSubOption?.price ?? widget.service.basePrice;

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          SliverAppBar(
            expandedHeight: 240,
            pinned: true,
            flexibleSpace: FlexibleSpaceBar(
              title: Text(
                widget.service.title,
                style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              background: Stack(
                fit: StackFit.expand,
                children: [
                  CachedNetworkImage(
                    imageUrl: widget.service.imageUrl,
                    fit: BoxFit.cover,
                  ),
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        begin: Alignment.topCenter,
                        end: Alignment.bottomCenter,
                        colors: [Colors.transparent, AppTheme.darkBg.withOpacity(0.9)],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
          SliverToBoxAdapter(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badges
                  Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryAmber.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.primaryAmber),
                        ),
                        child: Text(
                          widget.service.badgeTitle,
                          style: const TextStyle(color: AppTheme.primaryAmber, fontWeight: FontWeight.bold, fontSize: 11),
                        ),
                      ),
                      const SizedBox(width: 8),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: AppTheme.darkSurface,
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: AppTheme.darkBorder),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.star, color: AppTheme.primaryAmber, size: 14),
                            const SizedBox(width: 4),
                            Text(
                              '${widget.service.rating} (${widget.service.reviewsCount} reviews)',
                              style: const TextStyle(color: AppTheme.textLight, fontSize: 11),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),

                  const Text(
                    'About this Service',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    widget.service.description,
                    style: const TextStyle(color: AppTheme.textMuted, fontSize: 13, height: 1.5),
                  ),
                  const SizedBox(height: 20),

                  // Formula transparency box for Runner & Errands
                  if (widget.service.hasChecklist)
                    Container(
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: AppTheme.emeraldAccent.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: AppTheme.emeraldAccent.withOpacity(0.4)),
                      ),
                      child: const Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Icon(Icons.receipt_long, color: AppTheme.emeraldAccent, size: 18),
                              SizedBox(width: 8),
                              Text(
                                'Transparent Bill Reimbursement Formula',
                                style: TextStyle(color: AppTheme.emeraldAccent, fontWeight: FontWeight.bold, fontSize: 13),
                              ),
                            ],
                          ),
                          SizedBox(height: 6),
                          Text(
                            'Total Bill = (Hourly Labor Rate × Hours) + Actual Items Bill Cost',
                            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 12),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'You only pay the standard hourly rate plus the real shopkeeper cash memo attached by the runner.',
                            style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
                          ),
                        ],
                      ),
                    ),

                  const SizedBox(height: 20),

                  // Sub Options
                  if (widget.service.subOptions.isNotEmpty) ...[
                    const Text(
                      'Choose Service Tier / Variant',
                      style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                    ),
                    const SizedBox(height: 10),
                    ...widget.service.subOptions.map((opt) {
                      final isSelected = _selectedSubOption?.id == opt.id;
                      return Padding(
                        padding: const EdgeInsets.only(bottom: 8),
                        child: InkWell(
                          onTap: () => setState(() => _selectedSubOption = opt),
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: isSelected ? AppTheme.primaryAmber.withOpacity(0.1) : AppTheme.darkSurface,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected ? AppTheme.primaryAmber : AppTheme.darkBorder,
                                width: isSelected ? 1.5 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Icon(
                                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                                  color: isSelected ? AppTheme.primaryAmber : AppTheme.textMuted,
                                ),
                                const SizedBox(width: 12),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment: CrossAxisAlignment.start,
                                    children: [
                                      Text(opt.title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.textLight, fontSize: 13)),
                                      Text(opt.description, style: const TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                                    ],
                                  ),
                                ),
                                Text(
                                  '₹${opt.price.toInt()}',
                                  style: const TextStyle(fontWeight: FontWeight.bold, color: AppTheme.primaryAmber, fontSize: 15),
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }).toList(),
                  ],

                  const SizedBox(height: 20),

                  // What's included
                  const Text(
                    'What\'s Included',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppTheme.textLight),
                  ),
                  const SizedBox(height: 10),
                  ...widget.service.includedFeatures.map((feat) => Padding(
                        padding: const EdgeInsets.only(bottom: 6),
                        child: Row(
                          children: [
                            const Icon(Icons.check_circle, color: AppTheme.emeraldAccent, size: 16),
                            const SizedBox(width: 8),
                            Expanded(child: Text(feat, style: const TextStyle(color: AppTheme.textLight, fontSize: 12))),
                          ],
                        ),
                      )),

                  const SizedBox(height: 80),
                ],
              ),
            ),
          ),
        ],
      ),
      bottomSheet: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(
          color: AppTheme.darkSurface,
          border: Border(top: BorderSide(color: AppTheme.darkBorder)),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.between,
          children: [
            Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Text('Estimated Base Labor', style: TextStyle(color: AppTheme.textMuted, fontSize: 11)),
                Text(
                  '₹${displayPrice.toInt()}${widget.service.pricingType == 'hourly' ? '/hr' : ' flat'}',
                  style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.primaryAmber),
                ),
              ],
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => BookingFlowScreen(
                      service: widget.service,
                      selectedSubOption: _selectedSubOption,
                    ),
                  ),
                );
              },
              child: const Text('Proceed to Book'),
            ),
          ],
        ),
      ),
    );
  }
}
