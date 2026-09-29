import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'constants/app_theme.dart';
import 'providers/quick_service_provider.dart';
import 'screens/main_navigation_screen.dart';

/// Standalone entry point for compiling Quick Service Admin Operations Desk
/// Build command: flutter build apk --target lib/main_admin.dart --release
void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const QuickServiceAdminApp());
}

class QuickServiceAdminApp extends StatelessWidget {
  const QuickServiceAdminApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => QuickServiceProvider()),
      ],
      child: MaterialApp(
        title: 'Quick Service Admin',
        debugShowCheckedModeBanner: false,
        theme: AppTheme.darkTheme,
        home: const MainNavigationScreen(),
      ),
    );
  }
}
