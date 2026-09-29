import 'package:flutter/material.dart';
import '../models/checklist_item.dart';
import '../constants/app_theme.dart';

class ShoppingChecklistEditor extends StatefulWidget {
  final List<ChecklistItem> initialItems;
  final Function(List<ChecklistItem>) onChanged;
  final String categoryTag;

  const ShoppingChecklistEditor({
    Key? key,
    required this.initialItems,
    required this.onChanged,
    required this.categoryTag,
  }) : super(key: key);

  @override
  State<ShoppingChecklistEditor> createState() => _ShoppingChecklistEditorState();
}

class _ShoppingChecklistEditorState extends State<ShoppingChecklistEditor> {
  late List<ChecklistItem> _items;
  final TextEditingController _nameController = TextEditingController();
  final TextEditingController _qtyController = TextEditingController();

  final List<Map<String, String>> _sabjiQuickChips = [
    {'name': 'Aloo (Potato)', 'qty': '2 kg'},
    {'name': 'Pyaaz (Onion)', 'qty': '2 kg'},
    {'name': 'Tamatar (Tomato)', 'qty': '1 kg'},
    {'name': 'Adrak & Mirchi', 'qty': '100g each'},
    {'name': 'Dhaniya (Coriander)', 'qty': '1 bunch'},
    {'name': 'Palak (Spinach)', 'qty': '500g'},
  ];

  final List<Map<String, String>> _kiranaQuickChips = [
    {'name': 'Amul Gold Milk', 'qty': '2 pkts'},
    {'name': 'Atta (Whole Wheat)', 'qty': '5 kg'},
    {'name': 'Toor Dal', 'qty': '1 kg'},
    {'name': 'Refined Oil', 'qty': '1 L'},
    {'name': 'Tata Salt', 'qty': '1 kg'},
    {'name': 'Brown Bread', 'qty': '1 loaf'},
  ];

  @override
  void initState() {
    super.initState();
    _items = List.from(widget.initialItems);
  }

  void _addItem(String name, String qty) {
    if (name.trim().isEmpty) return;
    setState(() {
      _items.add(ChecklistItem(
        id: 'chk-${DateTime.now().millisecondsSinceEpoch}-${_items.length}',
        name: name.trim(),
        quantity: qty.trim().isEmpty ? '1 unit' : qty.trim(),
        category: widget.categoryTag,
      ));
    });
    _nameController.clear();
    _qtyController.clear();
    widget.onChanged(_items);
  }

  void _removeItem(int index) {
    setState(() {
      _items.removeAt(index);
    });
    widget.onChanged(_items);
  }

  @override
  Widget build(BuildContext context) {
    final quickChips = widget.categoryTag == 'sabji' ? _sabjiQuickChips : _kiranaQuickChips;

    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        color: AppTheme.darkSurface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: AppTheme.darkBorder),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.shopping_basket, color: AppTheme.primaryAmber, size: 18),
              const SizedBox(width: 8),
              const Expanded(
                child: Text(
                  'Itemized Shopping Checklist',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14, color: AppTheme.textLight),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                decoration: BoxDecoration(
                  color: AppTheme.primaryAmber.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${_items.length} items',
                  style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 11, fontWeight: FontWeight.bold),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          const Text(
            'Add exact items with quantities. Runner will tick each item in the market and upload the shopkeeper\'s cash memo.',
            style: TextStyle(color: AppTheme.textMuted, fontSize: 11),
          ),
          const SizedBox(height: 12),

          // Quick tap chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: quickChips.map((chip) {
                return Padding(
                  padding: const EdgeInsets.only(right: 6),
                  child: ActionChip(
                    backgroundColor: AppTheme.darkCard,
                    side: const BorderSide(color: AppTheme.darkBorder),
                    label: Text('+ ${chip['name']} (${chip['qty']})', style: const TextStyle(fontSize: 11, color: AppTheme.textLight)),
                    onPressed: () => _addItem(chip['name']!, chip['qty']!),
                  ),
                );
              }).toList(),
            ),
          ),

          const SizedBox(height: 12),

          // Add item input row
          Row(
            children: [
              Expanded(
                flex: 3,
                child: TextField(
                  controller: _nameController,
                  style: const TextStyle(fontSize: 13, color: AppTheme.textLight),
                  decoration: const InputDecoration(
                    hintText: 'Item name (e.g. Tomato)',
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                flex: 2,
                child: TextField(
                  controller: _qtyController,
                  style: const TextStyle(fontSize: 13, color: AppTheme.textLight),
                  decoration: const InputDecoration(
                    hintText: 'Qty (e.g. 2 kg)',
                    contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  ),
                ),
              ),
              const SizedBox(width: 8),
              IconButton(
                style: IconButton.styleFrom(
                  backgroundColor: AppTheme.primaryAmber,
                  foregroundColor: AppTheme.darkBg,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                icon: const Icon(Icons.add, size: 20),
                onPressed: () => _addItem(_nameController.text, _qtyController.text),
              ),
            ],
          ),

          if (_items.isNotEmpty) ...[
            const SizedBox(height: 14),
            const Divider(color: AppTheme.darkBorder, height: 1),
            const SizedBox(height: 10),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _items.length,
              itemBuilder: (context, index) {
                final item = _items[index];
                return Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppTheme.darkCard,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Row(
                      children: [
                        const Icon(Icons.circle_outlined, size: 14, color: AppTheme.primaryAmber),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(
                            item.name,
                            style: const TextStyle(color: AppTheme.textLight, fontSize: 13, fontWeight: FontWeight.w600),
                          ),
                        ),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: AppTheme.darkSurface,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: AppTheme.darkBorder),
                          ),
                          child: Text(
                            item.quantity,
                            style: const TextStyle(color: AppTheme.primaryAmber, fontSize: 11, fontWeight: FontWeight.bold),
                          ),
                        ),
                        const SizedBox(width: 4),
                        IconButton(
                          icon: const Icon(Icons.close, size: 16, color: AppTheme.textMuted),
                          onPressed: () => _removeItem(index),
                          constraints: const BoxConstraints(),
                          padding: const EdgeInsets.all(4),
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
          ],
        ],
      ),
    );
  }
}
