import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/app_theme.dart';
import 'providers/quick_service_provider.dart';
import 'screens/customer/home_screen.dart';

/// Standalone entry point for compiling Quick Service Customer App
/// Build command: flutter build apk --target lib/main_customer.dart --release
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuickServiceCustomerApp());
}

class QuickServiceCustomerApp extends StatelessWidget {
  const QuickServiceCustomerApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuickServiceProvider()),
      ],
      child: MaterialApp(
        title: 'Quick Service Customer',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const CustomerHomeScreen(),
      ),
    );
  }
}
