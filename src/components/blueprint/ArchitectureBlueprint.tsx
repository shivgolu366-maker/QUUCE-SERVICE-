import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  GitBranch, 
  Calendar, 
  Server, 
  Smartphone, 
  ShieldCheck, 
  MapPin, 
  Cpu, 
  Cloud, 
  Lock, 
  Copy, 
  Check, 
  FileCode, 
  ArrowRight
} from 'lucide-react';

export const ArchitectureBlueprint: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'flutter_widgets' | 'nosql_schema' | 'sql_schema' | 'user_flow' | 'roadmap'>('architecture');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const sqlSchemaCode = `-- =========================================================================
-- QUICK SERVICE: PRODUCTION POSTGRESQL SCHEMA (WITH POSTGIS)
-- =========================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. USERS TABLE (CUSTOMERS)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) UNIQUE,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00 CHECK (wallet_balance >= 0),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. USER ADDRESSES
CREATE TABLE user_addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    label VARCHAR(30) DEFAULT 'Home', -- 'Home', 'Work', 'Other'
    address_line TEXT NOT NULL,
    city VARCHAR(80) NOT NULL,
    postal_code VARCHAR(12),
    location GEOMETRY(Point, 4326) NOT NULL, -- Lat/Lng for proximity queries
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_user_addresses_location ON user_addresses USING GIST(location);

-- 3. SERVICE CATEGORIES & SERVICES CATALOG
CREATE TABLE service_categories (
    id VARCHAR(50) PRIMARY KEY, -- 'repairs', 'chores', 'mobility'
    title VARCHAR(100) NOT NULL,
    description TEXT,
    icon_name VARCHAR(50),
    sort_order INT DEFAULT 0
);

CREATE TABLE services (
    id VARCHAR(80) PRIMARY KEY,
    category_id VARCHAR(50) NOT NULL REFERENCES service_categories(id),
    name VARCHAR(150) NOT NULL,
    description TEXT,
    pricing_type VARCHAR(20) DEFAULT 'fixed', -- 'fixed', 'hourly', 'quote'
    base_price NUMERIC(10, 2) NOT NULL,
    hourly_rate NUMERIC(10, 2),
    estimated_duration_min INT DEFAULT 45,
    is_active BOOLEAN DEFAULT TRUE
);

-- 4. PARTNERS (WORKERS / PROFESSIONALS)
CREATE TABLE partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    phone_number VARCHAR(15) UNIQUE NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    category_id VARCHAR(50) REFERENCES service_categories(id),
    rating_avg NUMERIC(3, 2) DEFAULT 5.00,
    total_jobs_completed INT DEFAULT 0,
    is_online BOOLEAN DEFAULT FALSE,
    kyc_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
    current_location GEOMETRY(Point, 4326),
    last_location_ping TIMESTAMPTZ,
    wallet_balance NUMERIC(12, 2) DEFAULT 0.00,
    bank_account_number VARCHAR(34),
    bank_ifsc VARCHAR(20),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_partners_location ON partners USING GIST(current_location);

-- 5. PARTNER KYC DOCUMENTS
CREATE TABLE partner_kyc_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    partner_id UUID NOT NULL REFERENCES partners(id) ON DELETE CASCADE,
    doc_type VARCHAR(50) NOT NULL, -- 'aadhaar', 'license', 'skill_certificate', 'police_clearance'
    doc_number VARCHAR(100),
    file_url TEXT NOT NULL,
    verification_status VARCHAR(20) DEFAULT 'pending',
    rejection_reason TEXT,
    verified_at TIMESTAMPTZ,
    verified_by UUID
);

-- 6. BOOKINGS TABLE
CREATE TABLE bookings (
    id VARCHAR(20) PRIMARY KEY, -- e.g. 'QS-84291'
    customer_id UUID NOT NULL REFERENCES users(id),
    partner_id UUID REFERENCES partners(id),
    service_id VARCHAR(80) NOT NULL REFERENCES services(id),
    booking_type VARCHAR(20) DEFAULT 'instant', -- 'instant', 'scheduled'
    scheduled_for TIMESTAMPTZ,
    status VARCHAR(30) DEFAULT 'searching', 
    -- 'searching', 'assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled'
    pickup_address TEXT NOT NULL,
    pickup_location GEOMETRY(Point, 4326) NOT NULL,
    task_description TEXT,
    voice_note_url TEXT,
    start_otp VARCHAR(6) NOT NULL, -- 4-digit code provided to start work
    base_fare NUMERIC(10, 2) NOT NULL,
    surge_multiplier NUMERIC(3, 2) DEFAULT 1.00,
    discount_amount NUMERIC(10, 2) DEFAULT 0.00,
    coupon_code VARCHAR(30),
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL, -- 'upi', 'card', 'wallet', 'cash'
    payment_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'paid', 'refunded'
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_customer ON bookings(customer_id);
CREATE INDEX idx_bookings_partner ON bookings(partner_id);

-- 7. REVIEWS & RATINGS
CREATE TABLE booking_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(20) UNIQUE NOT NULL REFERENCES bookings(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    compliment_tags TEXT[],
    comment TEXT,
    tip_amount NUMERIC(10, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. EMERGENCY SOS ALERTS
CREATE TABLE emergency_alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id VARCHAR(20) REFERENCES bookings(id),
    triggered_by VARCHAR(20) NOT NULL, -- 'customer', 'partner'
    location GEOMETRY(Point, 4326) NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'investigating', 'resolved'
    incident_notes TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);`;

  const noSqlSchemaCode = `// =========================================================================
// QUICK SERVICE: CLOUD FIRESTORE DOCUMENT SCHEMAS & SAMPLE JSON
// =========================================================================

// COLLECTION: /users/{userId}
{
  "userId": "usr_901",
  "phone": "+919820154321",
  "name": "Aarav Malhotra",
  "email": "aarav.malhotra@gmail.com",
  "walletBalance": 650.00,
  "savedAddresses": [
    {
      "id": "addr_1",
      "label": "Home",
      "address": "Tower 4, Flat 1204, Lotus Boulevard, Sector 100, Noida",
      "geo": { "latitude": 28.5365, "longitude": 77.3920 },
      "isDefault": true
    }
  ],
  "createdAt": "2026-03-10T10:00:00Z"
}

// COLLECTION: /partners/{partnerId}
{
  "partnerId": "pt_101",
  "name": "Rajesh Kumar Verma",
  "phone": "+919876543210",
  "category": "repairs",
  "categoryName": "Plumbing & Maintenance",
  "rating": 4.92,
  "totalJobs": 842,
  "isOnline": true,
  "kycStatus": "verified",
  "currentLocation": {
    "geohash": "ttp7j...",
    "coordinates": { "latitude": 28.5355, "longitude": 77.3910 }
  },
  "vehicle": "Hero Splendor (DL 04 CZ 3918)",
  "walletBalance": 4280.00,
  "todayEarnings": 1190.00
}

// COLLECTION: /bookings/{bookingId} (NEW CHECKLIST & BILL REIMBURSEMENT)
{
  "bookingId": "QS-89211",
  "customerId": "usr_901",
  "partnerId": "pt_101",
  "serviceId": "srv-sabji-mandi",
  "serviceName": "Sabji Mandi / Fresh Vegetables",
  "status": "in_progress",
  "startOtp": "5192",

  // 1. SHOPPING CHECKLIST ITEMS
  "checklist": [
    { "id": "chk-1", "name": "Aloo (Potato)", "quantity": "2 kg", "isPurchased": true, "category": "sabji" },
    { "id": "chk-2", "name": "Pyaaz (Onion)", "quantity": "2 kg", "isPurchased": true, "category": "sabji" },
    { "id": "chk-3", "name": "Tamatar (Tomato)", "quantity": "1 kg", "isPurchased": true, "category": "sabji" },
    { "id": "chk-4", "name": "Amul Taza Doodh", "quantity": "2 packet", "isPurchased": true, "category": "kirana" }
  ],

  // 2. CASH MEMO BILL REIMBURSEMENT
  "reimbursement": {
    "billPhotoUrl": "https://firebasestorage.googleapis.com/v0/b/.../mandi_memo_89211.jpg",
    "billPhotoName": "mandi_cash_memo.jpg",
    "totalItemsAmount": 285.00,
    "memoNotes": "Purchased A-grade vegetables from local Sector 100 Mandi",
    "uploadedAt": "2026-09-28T10:20:00Z",
    "status": "submitted"
  },

  // 3. REIMBURSEMENT FORMULA CALCULATION
  "pricing": {
    "pricingType": "hourly_plus_items",
    "hourlyLaborRate": 149.00,
    "hoursSpent": 1.0,
    "laborSubtotal": 149.00,
    "actualItemsCost": 285.00,
    "surgeMultiplier": 1.0,
    "discount": 0.00,
    "totalAmount": 434.00,
    "formulaDescription": "Total Bill = (Hourly Labor Rate * Hours) + Actual Items Bill Cost"
  },

  // 4. RECURRING SUBSCRIPTIONS & BUNDLED PACKAGES
  "isRecurring": true,
  "subscriptionPlanId": "sub-mandi-weekly",
  "recurrenceFrequency": "weekly"
}

// COLLECTION: /subscription_plans/{planId}
{
  "planId": "sub-cleaning-weekly",
  "name": "Weekly Pristine House Deep Cleaning",
  "serviceId": "srv-cleaning",
  "frequency": "weekly",
  "visitsPerMonth": 4,
  "monthlyPrice": 1399.00,
  "originalMonthlyPrice": 1996.00,
  "discountPercent": 30,
  "active": true
}

// COLLECTION: /service_packages/{packageId}
{
  "packageId": "pkg-move-in",
  "name": "Move-In Deep Refresh & Diagnostics",
  "bundledPrice": 1899.00,
  "originalPrice": 2697.00,
  "savingsAmount": 798.00,
  "validityDays": 60,
  "includedServices": [
    { "serviceId": "srv-cleaning", "visits": 1 },
    { "serviceId": "srv-electrician", "visits": 1 },
    { "serviceId": "srv-plumber", "visits": 1 }
  ]
}`;

  const flutterWidgetsCode = `// =========================================================================
// QUICK SERVICE: FLUTTER UI WIDGETS (CachedNetworkImage + Checklist + Formula)
// =========================================================================

import 'package:flutter/material.dart';
import 'package:cached_network_image/cached_network_image.dart';

// 1. SERVICE CARD WITH BADGE & CACHED IMAGE
class ServiceIconCard extends StatelessWidget {
  final String title;
  final String categoryTag;
  final String badgeTitle;
  final String imageUrl;
  final double price;
  final bool hasChecklist;
  final VoidCallback onTap;

  const ServiceIconCard({
    Key? key,
    required this.title,
    required this.categoryTag,
    required this.badgeTitle,
    required this.imageUrl,
    required this.price,
    this.hasChecklist = false,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFF1E293B),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFF334155)),
        ),
        child: Row(
          children: [
            // CachedNetworkImage illustration
            Stack(
              children: [
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: CachedNetworkImage(
                    imageUrl: imageUrl,
                    width: 56,
                    height: 56,
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      width: 56,
                      height: 56,
                      color: const Color(0xFF0F172A),
                      child: const Icon(Icons.shopping_bag, color: Colors.amber, size: 24),
                    ),
                    errorWidget: (context, url, error) => Container(
                      width: 56,
                      height: 56,
                      color: const Color(0xFF0F172A),
                      child: const Icon(Icons.storefront, color: Colors.amber, size: 24),
                    ),
                  ),
                ),
                Positioned(
                  bottom: 2,
                  right: 2,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 1),
                    decoration: BoxDecoration(
                      color: Colors.black.withOpacity(0.8),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(badgeTitle, style: const TextStyle(color: Colors.amber, fontSize: 8, fontWeight: FontWeight.bold)),
                  ),
                ),
              ],
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(title, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.white, fontSize: 13)),
                      if (hasChecklist) ...[
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 1.5),
                          decoration: BoxDecoration(
                            color: Colors.green.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(4),
                          ),
                          child: const Text('MEMO BILL', style: TextStyle(color: Colors.greenAccent, fontSize: 8, fontWeight: FontWeight.bold)),
                        ),
                      ],
                    ],
                  ),
                  const SizedBox(height: 4),
                  Text(categoryTag, style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 11)),
                ],
              ),
            ),
            Text('₹\${price.toInt()}', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 15)),
          ],
        ),
      ),
    );
  }
}

// 2. GROCERY & SABJI MANDI SHOPPING CHECKLIST WIDGET
class GroceryItemChecklistWidget extends StatefulWidget {
  final List<Map<String, dynamic>> items;
  final bool isRunnerView;
  final Function(List<Map<String, dynamic>>) onChecklistUpdated;

  const GroceryItemChecklistWidget({
    Key? key,
    required this.items,
    this.isRunnerView = false,
    required this.onChecklistUpdated,
  }) : super(key: key);

  @override
  State<GroceryItemChecklistWidget> createState() => _GroceryItemChecklistWidgetState();
}

class _GroceryItemChecklistWidgetState extends State<GroceryItemChecklistWidget> {
  final TextEditingController _itemCtrl = TextEditingController();
  final TextEditingController _qtyCtrl = TextEditingController();

  void _addItem() {
    if (_itemCtrl.text.trim().isEmpty) return;
    final updated = List<Map<String, dynamic>>.from(widget.items);
    updated.add({
      'id': DateTime.now().millisecondsSinceEpoch.toString(),
      'name': _itemCtrl.text.trim(),
      'quantity': _qtyCtrl.text.trim().isEmpty ? '1 item' : _qtyCtrl.text.trim(),
      'isPurchased': false,
    });
    widget.onChecklistUpdated(updated);
    _itemCtrl.clear();
    _qtyCtrl.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF0F172A),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: const Color(0xFF334155)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('Shopping Checklist', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              Text('\${widget.items.where((i) => i['isPurchased'] == true).length}/\${widget.items.length} bought',
                  style: const TextStyle(color: Colors.amber, fontSize: 11)),
            ],
          ),
          const SizedBox(height: 10),
          if (!widget.isRunnerView) ...[
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: TextField(
                    controller: _itemCtrl,
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    decoration: const InputDecoration(hintText: 'Item (e.g. Aloo, Doodh)', hintStyle: TextStyle(color: Colors.white38)),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 2,
                  child: TextField(
                    controller: _qtyCtrl,
                    style: const TextStyle(color: Colors.white, fontSize: 12),
                    decoration: const InputDecoration(hintText: 'Qty (2kg)', hintStyle: TextStyle(color: Colors.white38)),
                  ),
                ),
                IconButton(
                  onPressed: _addItem,
                  icon: const Icon(Icons.add_circle, color: Colors.amber),
                ),
              ],
            ),
            const Divider(color: Colors.white12),
          ],
          ListView.builder(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: widget.items.length,
            itemBuilder: (context, index) {
              final item = widget.items[index];
              return CheckboxListTile(
                contentPadding: EdgeInsets.zero,
                activeColor: Colors.green,
                dense: true,
                title: Text(item['name'], style: TextStyle(
                  color: Colors.white,
                  decoration: item['isPurchased'] == true ? TextDecoration.lineThrough : null,
                )),
                subtitle: Text(item['quantity'], style: const TextStyle(color: Colors.amber, fontSize: 11)),
                value: item['isPurchased'] ?? false,
                onChanged: widget.isRunnerView ? (val) {
                  final updated = List<Map<String, dynamic>>.from(widget.items);
                  updated[index]['isPurchased'] = val;
                  widget.onChecklistUpdated(updated);
                } : null,
              );
            },
          ),
        ],
      ),
    );
  }
}

// 3. RUNNER CASH MEMO REIMBURSEMENT & TOTAL BILL FORMULA WIDGET
class SabjiBillReimbursementWidget extends StatelessWidget {
  final double hourlyLaborRate;
  final double hoursSpent;
  final double actualItemsCost;
  final String? memoPhotoUrl;
  final VoidCallback onUploadMemo;

  const SabjiBillReimbursementWidget({
    Key? key,
    required this.hourlyLaborRate,
    required this.hoursSpent,
    required this.actualItemsCost,
    this.memoPhotoUrl,
    required this.onUploadMemo,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    // FORMULA: Total Bill = (Hourly Labor Rate * Hours) + Actual Items Bill Cost
    final double laborCost = hourlyLaborRate * hoursSpent;
    final double totalFinalBill = laborCost + actualItemsCost;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: const Color(0xFF1E293B),
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: Colors.amber.withOpacity(0.3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text('Bill Reimbursement & Total', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
          const SizedBox(height: 8),
          Text('Labor: ₹\${hourlyLaborRate.toInt()} × \$hoursSpent hr = ₹\${laborCost.toInt()}', style: const TextStyle(color: Colors.white70, fontSize: 12)),
          Text('Mandi Cash Memo: +₹\${actualItemsCost.toInt()}', style: const TextStyle(color: Colors.greenAccent, fontWeight: FontWeight.bold, fontSize: 12)),
          const Divider(color: Colors.white24, height: 16),
          Row(
            mainAxisAlignment: MainAxisAlignment.between,
            children: [
              const Text('TOTAL BILL PAYABLE:', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 13)),
              Text('₹\${totalFinalBill.toInt()}', style: const TextStyle(color: Colors.amber, fontWeight: FontWeight.bold, fontSize: 16)),
            ],
          ),
        ],
      ),
    );
  }
}`;

  return (
    <div className="flex-1 bg-slate-950 text-slate-100 flex flex-col min-h-screen">
      
      {/* Top Header */}
      <div className="border-b border-slate-800 bg-slate-900/80 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-white tracking-tight">
              Quick Service Engineering Blueprint
            </h1>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded font-semibold">
              ARCHITECTURE SPEC v2.4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            System topology, PostgreSQL DDL schemas, Firestore NoSQL models, and 15-week MVP roadmap
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl border border-slate-700/60 overflow-x-auto no-scrollbar">
          {[
            { id: 'architecture', label: 'System Topology', icon: Server },
            { id: 'sql_schema', label: 'PostgreSQL DDL', icon: Database },
            { id: 'nosql_schema', label: 'Firestore NoSQL', icon: FileCode },
            { id: 'user_flow', label: 'Dispatch State Machine', icon: GitBranch },
            { id: 'roadmap', label: 'MVP Roadmap (15 Weeks)', icon: Calendar },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  isActive 
                    ? 'bg-amber-500 text-slate-950 font-bold shadow' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6 flex-1">
        
        {/* Tab 1: System Architecture Diagram */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            
            {/* Diagram Viewport */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">
                    Microservices & Distributed Real-Time Architecture
                  </h3>
                  <p className="text-xs text-slate-400">
                    High-availability event-driven topology with Geo-spatial PostGIS indexing
                  </p>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
                  99.95% SLA Target
                </span>
              </div>

              {/* Graphical Architecture Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                
                {/* Layer 1: Client Applications */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
                    <Smartphone className="w-4 h-4" />
                    <span>Client Apps</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Customer App (iOS/Android)
                      <span className="text-[10px] text-slate-400 block font-normal">React Native / Flutter + Web</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Service Partner App
                      <span className="text-[10px] text-slate-400 block font-normal">Background GPS, Offline Cache</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Admin Control Center
                      <span className="text-[10px] text-slate-400 block font-normal">React SPA + Live WebSockets</span>
                    </div>
                  </div>
                </div>

                {/* Layer 2: Gateway & Edge */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
                    <Cloud className="w-4 h-4" />
                    <span>Edge & Gateway</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Cloudflare CDN & WAF
                      <span className="text-[10px] text-slate-400 block font-normal">DDoS Shield, SSL Termination</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Traefik API Gateway
                      <span className="text-[10px] text-slate-400 block font-normal">JWT Auth, Rate Limiter, Proxy</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      WebSocket Gateway
                      <span className="text-[10px] text-slate-400 block font-normal">Persistent Live GPS Streaming</span>
                    </div>
                  </div>
                </div>

                {/* Layer 3: Backend Microservices */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                    <Cpu className="w-4 h-4" />
                    <span>Microservices</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Dispatch & Matching Engine
                      <span className="text-[10px] text-slate-400 block font-normal">Geo-radius (5km) & PostGIS Index</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Payment & Escrow Service
                      <span className="text-[10px] text-slate-400 block font-normal">Razorpay, UPI Payouts, Wallet</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      VoIP & Masked Calling
                      <span className="text-[10px] text-slate-400 block font-normal">Twilio PBX Masked Proxy Relay</span>
                    </div>
                  </div>
                </div>

                {/* Layer 4: Storage & Data Tier */}
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                    <Database className="w-4 h-4" />
                    <span>Data & Persistence</span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      PostgreSQL 16 + PostGIS
                      <span className="text-[10px] text-slate-400 block font-normal">ACID Bookings, Users & Ledger</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      Redis Cluster 7.0
                      <span className="text-[10px] text-slate-400 block font-normal">Partner Location Geohashes & Locks</span>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 font-semibold text-white">
                      S3 / Firebase Storage
                      <span className="text-[10px] text-slate-400 block font-normal">KYC PDFs, Voice Notes, Photos</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Core Tech Stack Summary Table */}
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-3">
              <h3 className="text-sm font-bold text-white tracking-tight">
                Recommended Production Stack Matrix
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-amber-400 font-bold block">Mobile & Web Frontend</span>
                  <p className="text-slate-300">React Native / Flutter for iOS & Android, Tailwind CSS, Lucide Icons, Vite SPA for Admin Dashboard.</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-sky-400 font-bold block">Backend & Realtime</span>
                  <p className="text-slate-300">Node.js (NestJS / Express) or FastAPI Python, Socket.IO / WebSockets, Redis PubSub for geo-pings.</p>
                </div>
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-emerald-400 font-bold block">Database & External APIs</span>
                  <p className="text-slate-300">PostgreSQL with PostGIS geometry, Google Maps Distance Matrix API, Razorpay / Cashfree, Twilio Voice Proxy.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* Tab 2: PostgreSQL Schema */}
        {activeTab === 'sql_schema' && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  PostgreSQL Production DDL (with PostGIS Spatial Indexing)
                </h3>
                <p className="text-xs text-slate-400">
                  Fully normalized tables, constraints, foreign keys, and GIS indexes
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(sqlSchemaCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied SQL' : 'Copy DDL'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-emerald-300 overflow-x-auto max-h-[500px] leading-relaxed no-scrollbar">
              {sqlSchemaCode}
            </pre>
          </div>
        )}

        {/* Tab 3: Firestore NoSQL Schema */}
        {activeTab === 'nosql_schema' && (
          <div className="p-5 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Google Cloud Firestore NoSQL Document Blueprint
                </h3>
                <p className="text-xs text-slate-400">
                  Document tree collections for real-time document listeners and offline sync
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(noSqlSchemaCode)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-amber-400 border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied JSON' : 'Copy Schema'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-[11px] font-mono text-amber-300 overflow-x-auto max-h-[500px] leading-relaxed no-scrollbar">
              {noSqlSchemaCode}
            </pre>
          </div>
        )}

        {/* Tab 4: User Flow & Dispatch Engine State Machine */}
        {activeTab === 'user_flow' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                End-to-End User Flow & Dispatch State Machine
              </h3>
              <p className="text-xs text-slate-400">
                Detailed step-by-step transaction lifecycle from customer demand to partner payout
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  step: '01. Discovery & Intent Formulation',
                  actor: 'Customer App',
                  color: 'border-amber-500/40 text-amber-400',
                  desc: 'Customer selects category (Plumber, Electrician, Maid, Driver). Sub-options & transparent prices displayed. User specifies address and adds problem description with optional voice note recording and photos of the leak/appliance.'
                },
                {
                  step: '02. Dynamic Pricing & Escrow Payment',
                  actor: 'Pricing Engine & Gateway',
                  color: 'border-sky-500/40 text-sky-400',
                  desc: 'Platform computes base fare, applies dynamic surge multiplier (e.g. 1.2x if peak rain), deducts discount coupon (e.g. QUICKFIRST), and authorizes payment via UPI/Card/Wallet or locks order as COD.'
                },
                {
                  step: '03. Geo-Spatial Dispatch & 30-Second Ping',
                  actor: 'PostGIS / Redis Geospatial Matcher',
                  color: 'border-emerald-500/40 text-emerald-400',
                  desc: 'System searches online verified partners within 5 km radius sorted by distance and rating. Dispatches push broadcast with a 30s countdown. Partner views customer distance, estimated earnings, and task details. If accepted, job transitions to "assigned".'
                },
                {
                  step: '04. Live GPS Navigation & Secure Handshake',
                  actor: 'Partner App & Customer Live Tracking',
                  color: 'border-purple-500/40 text-purple-400',
                  desc: 'Partner navigates to customer doorstep with real-time GPS coordinates streamed to customer map. Masked phone calling & in-app chat available. On arrival, partner must enter customer\'s 4-digit security code (Start OTP) before job timer begins.'
                },
                {
                  step: '05. Job Completion, Review & Instant Settlement',
                  actor: 'Admin Settlement Service',
                  color: 'border-rose-500/40 text-rose-400',
                  desc: 'Partner taps "Complete Job". Customer receives digital invoice and submits 5-star rating with compliment badges. Platform deducts 18% commission and credits 82% immediately to partner\'s withdrawable wallet.'
                }
              ].map((flow, i) => (
                <div key={i} className={`p-4 bg-slate-950 rounded-2xl border ${flow.color} space-y-1.5`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">{flow.step}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      {flow.actor}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {flow.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 5: Step-by-Step MVP Development Roadmap */}
        {activeTab === 'roadmap' && (
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-6">
            <div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                Step-by-Step 15-Week Minimum Viable Product (MVP) Roadmap
              </h3>
              <p className="text-xs text-slate-400">
                Phased execution sprints to launch Quick Service in an urban metropolitan market
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  phase: 'Phase 1: Foundation & Data Architecture (Weeks 1 - 3)',
                  deliverables: [
                    'Database provisioning (PostgreSQL + PostGIS for spatial queries)',
                    'Authentication service with Firebase Phone OTP & JWT session cookies',
                    'Cloud Object Storage (S3 / Cloud Storage) for KYC docs and voice note audio assets',
                    'Base CI/CD pipelines and deployment staging environments'
                  ]
                },
                {
                  phase: 'Phase 2: Service Catalog, Booking Flow & Payments (Weeks 4 - 6)',
                  deliverables: [
                    'Customer mobile app layout (Categorized Home Repairs, Chores & Mobility)',
                    'Dynamic bill calculator (Fixed price, Hourly, Custom quotes)',
                    'Audio note recorder component and task photo attachments',
                    'Payment gateway integration (Razorpay / Cashfree for UPI, Cards, NetBanking & COD escrow)'
                  ]
                },
                {
                  phase: 'Phase 3: Partner App, Dispatch Matcher & Live GPS (Weeks 7 - 9)',
                  deliverables: [
                    'Partner App with Online/Offline duty state switch',
                    'Geospatial dispatch matcher (Redis Geohashing & 30-second broadcast queue)',
                    'Real-time WebSocket GPS stream and animated polyline route tracking on customer map',
                    'Secure 4-digit OTP handshake verification to start and complete work'
                  ]
                },
                {
                  phase: 'Phase 4: Privacy Relay, KYC & Admin Console (Weeks 10 - 12)',
                  deliverables: [
                    'Masked phone number relay proxy integration (Exotel / Twilio Virtual PBX)',
                    'In-app bidirectional masked chat with canned response pills',
                    'Partner KYC verification workflow (Aadhaar, License, Skill certificate, Police check)',
                    'Admin Console with Dynamic Surge Multiplier slider and 24/7 SOS Emergency incident monitor'
                  ]
                },
                {
                  phase: 'Phase 5: Stress Testing, Pilot Launch & Onboarding (Weeks 13 - 15)',
                  deliverables: [
                    'Load testing (1,000 concurrent booking dispatches simulated)',
                    'Penetration testing & OWASP security audit for payment and user data',
                    'Pilot rollout in Sector 100 / Noida Express zone with 50 onboarded verified partners',
                    'App Store & Play Store compliance submission & marketing launch'
                  ]
                }
              ].map((phase, i) => (
                <div key={i} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-amber-400">
                      {phase.phase}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">Sprint {i + 1}</span>
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {phase.deliverables.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
