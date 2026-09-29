import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/app_theme.dart';
import 'providers/quick_service_provider.dart';
import 'screens/partner/partner_duty_screen.dart';

/// Standalone entry point for compiling Quick Service Partner App
/// Build command: flutter build apk --target lib/main_partner.dart --release
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuickServicePartnerApp());
}

class QuickServicePartnerApp extends StatelessWidget {
  const QuickServicePartnerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuickServiceProvider()),
      ],
      child: MaterialApp(
        title: 'Quick Service Partner',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const PartnerDutyScreen(),
      ),
    );
  }
}
