import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/quick_service_provider.dart';
import '../constants/app_theme.dart';

class SosBottomSheet extends StatelessWidget {
  const SosBottomSheet({Key? key}) : super(key: key);

  static void show(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => const SosBottomSheet(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: const BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: [
          Container(
            width: 40,
            height: 4,
            decoration: BoxDecoration(
              color: AppTheme.darkBorder,
              borderRadius: BorderRadius.circular(2),
            ),
          ),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppTheme.roseSos.withOpacity(0.15),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.warning_amber_rounded, color: AppTheme.roseSos, size: 48),
          ),
          const SizedBox(height: 16),
          const Text(
            'Emergency Rapid Response (SOS)',
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.textLight,
            ),
          ),
          const SizedBox(height: 8),
          const Text(
            'Triggering SOS transmits your real-time GPS telemetry, booking logs, and audio beacon to our 24/7 Security Operations Room & Local Police PCR.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 13, color: AppTheme.textMuted, height: 1.4),
          ),
          const SizedBox(height: 24),
          Row(
            children: [
              Expanded(
                child: OutlinedButton(
                  onPressed: () => Navigator.pop(context),
                  child: const Text('Cancel'),
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppTheme.roseSos,
                    foregroundColor: Colors.white,
                  ),
                  onPressed: () {
                    Provider.of<QuickServiceProvider>(context, listen: false).triggerEmergencySos();
                    Navigator.pop(context);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('🚨 SOS Alert Dispatched! Ops Center & PCR Notified.'),
                        backgroundColor: AppTheme.roseSos,
                      ),
                    );
                  },
                  child: const Text('TRIGGER SOS'),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
