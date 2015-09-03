angular.module('db', [])

.constant('collections', {
 ADDRESS: 'address',
 APP_FACILITY_PROFILE: 'app_facility_profile',
 BUNDLE: 'bundle',
 BUNDLE_LINES: 'bundle_lines',
 BUNDLE_RECEIPT_LINES: 'bundle_receipt_lines',
 BUNDLE_RECEIPTS: 'bundle_receipts',
 CCEI: 'ccei',
 CCU: 'ccu',
 CCU_PROBLEMS: 'ccu_problems',
 CCU_TEMP_LOG: 'ccu_temp_log',
 CCU_TYPE: 'ccu_type',
 FACILITY: 'facility',
 FACILITY_TYPE: 'facility_type',
 INVENTORY: 'inventory',
 LOCATIONS: 'locations',
 MODE_OF_ADMINISTRATION: 'mode_of_administration',
 PRODUCT_CATEGORY: 'product_category',
 PRODUCT_FORMULATIONS: 'product_formulations',
 PRODUCT_PRESENTATION: 'product_presentation',
 PRODUCT_PROFILES: 'product_profiles',
 PRODUCT_TYPES: 'product_types',
 PROGRAM_PRODUCTS: 'program_products',
 PROGRAMS: 'programs',
 STOCK_OUT: 'stock_out',
 UOM: 'uom',
 UOM_CATEGORY: 'uom_category',
 USER_RELATED_FACILITIES: 'user_related_facilities',
})

;