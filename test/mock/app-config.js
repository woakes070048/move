angular.module('appConfigMocks', [])
  // jshint camelcase: false
  .value('appConfigMock',  {
    'appFacility': {
        'address': null,
        'catchment_population': 174442442,
        'category': 'e276a4b5-694a-4f03-94e0-c28ca4894410',
        'code': 'Dalai Hosp.',
        'contact': null,
        'created': '2014-01-20T10:02:39.798Z',
        'created_by': 1,
        'description': 'the main store from which distribution starts',
        'facility_operators': [
            '87191ec7-3be6-4b7b-ac0f-be9ce0e80e51'
        ],
        'facility_type': '915c8681-b2d0-4a3c-866f-86f691ef64a4',
        'footer': '',
        'global_location_no': '',
        'go_down_date': null,
        'go_live_date': '2010-01-13',
        'has_electricity': true,
        'has_electronic_scc': true,
        'header': '',
        'is_active': true,
        'is_deleted': false,
        'is_online': true,
        'is_satellite': false,
        'is_sdp': false,
        'level': 0,
        'lft': 1,
        'location': 'a3806d0e-2278-4f34-9728-74d12c912cfe',
        'modified': '2014-01-20T15:06:04.001Z',
        'name': 'Dalai Hospital',
        'parent': null,
        'rght': 6,
        'supplies_others': true,
        'tree_id': 2,
        'uuid': 'a6ef2104-45bb-438c-80b8-21b4cb7d43bc',
        'virtual_facility': false
    },
    'contactPerson': {
        'name': 'Aminu Garki',
        'phoneNo': '08062514986'
    },
    'dateActivated': '2014-04-21T15:11:37.955Z',
    'facility': '{"address":null,"catchment_population":174442442,"category":"e276a4b5-694a-4f03-94e0-c28ca4894410","code":"Dalai Hosp.","contact":null,"created":"2014-01-20T10:02:39.798Z","created_by":1,"description":"the main store from which distribution starts","facility_operators":["87191ec7-3be6-4b7b-ac0f-be9ce0e80e51"],"facility_type":"915c8681-b2d0-4a3c-866f-86f691ef64a4","footer":"","global_location_no":"","go_down_date":null,"go_live_date":"2010-01-13","has_electricity":true,"has_electronic_scc":true,"header":"","is_active":true,"is_deleted":false,"is_online":true,"is_satellite":false,"is_sdp":false,"level":0,"lft":1,"location":"a3806d0e-2278-4f34-9728-74d12c912cfe","modified":"2014-01-20T15:06:04.001Z","name":"Dalai Hospital","parent":null,"rght":6,"supplies_others":true,"tree_id":2,"uuid":"a6ef2104-45bb-438c-80b8-21b4cb7d43bc","virtual_facility":false}',
    'modified': '2014-04-21T15:11:37.985Z',
    'reminderDay': 5,
    'selectedCcuProfiles': [
    ],
    'selectedProductProfiles': [
        {
            'category': '66e1bc4f-1dab-4842-80c5-49f626bde74e',
            'created': '2014-01-30T11:13:53.058Z',
            'created_by': 1,
            'description': '',
            'diluent_per_volume': 0.7,
            'formulation': 'd2a1ae75-8fb0-4c80-80f7-0b05ba445b8a',
            'is_deleted': false,
            'long_name': 'BCG-20-DPV-ID-1.2Vol-Freeze-Dried-WHO-CSV',
            'mode_of_use': 'd4957c68-d977-4ff2-a5c2-3e8538d302cd',
            'modified': '2014-01-30T11:13:53.144Z',
            'modified_by': 1,
            'name': 'BCG 20',
            'packed_volume': 1.2,
            'presentation': {
                'code': '20-DPV',
                'created': '2014-01-17T10:55:22.686Z',
                'description': '20 dose per vial',
                'is_deleted': false,
                'modified': '2014-01-17T10:55:22.713Z',
                'name': '20 Dose Per Vial',
                'uom': {
                    'created': '2014-01-15T14:20:02.098Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-15T14:23:06.756Z',
                    'name': 'Vial',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'vial',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': '82cc6fac-d0f6-43da-b0c6-07dc58669431'
                },
                'uuid': '8ee9ff30-a9f5-41f9-8054-8257920adf2d',
                'value': 20
            },
            'product': {
                'active': true,
                'base_uom': {
                    'created': '2014-01-15T14:14:48.785Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-17T08:05:24.522Z',
                    'name': 'Dose',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'dose',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': 'e5def927-b173-44b6-9112-3103a473a65c'
                },
                'code': 'BCG',
                'created': '2014-01-15T14:40:44.434Z',
                'description': 'A vaccine against tuberculosis, prepared from a strain of the attenuated live Mycobacterium bovis',
                'is_deleted': false,
                'modified': '2014-01-15T14:47:38.346Z',
                'name': 'Bacille Calmette-Guérin Vaccine',
                'uuid': 'e55e1452-b0ab-4046-9d7e-3a98f1f968d0'
            },
            'uuid': '075bd789-4b29-4033-80b6-4f834e602628',
            'volume_uom': '6e2a882b-eeeb-4caf-96e2-46167c0c1aac',
            '$$hashKey': '01M'
        },
        {
            'category': '66e1bc4f-1dab-4842-80c5-49f626bde74e',
            'created': '2014-01-30T11:15:18.338Z',
            'created_by': 1,
            'description': '',
            'diluent_per_volume': 0,
            'formulation': 'ad999cfe-a74d-4f8d-964a-98a40a705ed5',
            'is_deleted': false,
            'long_name': 'Penta-20-DPV-IM-2.5Vol-Liquid-WHO-CSV',
            'mode_of_use': 'e63bb35d-9a49-4d1d-9be9-5fada6f6d81b',
            'modified': '2014-01-30T11:15:18.384Z',
            'modified_by': 1,
            'name': 'Penta 20',
            'packed_volume': 2.5,
            'presentation': {
                'code': '20-DPV',
                'created': '2014-01-17T10:40:48.140Z',
                'description': 'vaccine product presentation ',
                'is_deleted': false,
                'modified': '2014-01-17T10:40:48.185Z',
                'name': '20 Doses per Vial',
                'uom': {
                    'created': '2014-01-15T14:20:02.098Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-15T14:23:06.756Z',
                    'name': 'Vial',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'vial',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': '82cc6fac-d0f6-43da-b0c6-07dc58669431'
                },
                'uuid': '299939e1-94d7-4e8e-bfb7-c008af1692af',
                'value': 20
            },
            'product': {
                'active': true,
                'base_uom': {
                    'created': '2014-01-15T14:14:48.785Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-17T08:05:24.522Z',
                    'name': 'Dose',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'dose',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': 'e5def927-b173-44b6-9112-3103a473a65c'
                },
                'code': 'Penta',
                'created': '2014-01-15T14:45:41.187Z',
                'description': 'Five in one combination vaccine against diseases. ',
                'is_deleted': false,
                'modified': '2014-01-15T14:47:19.121Z',
                'name': 'Penta Vaccine',
                'uuid': '1203c362-b7a8-499a-b7ba-b842bace7920'
            },
            'uuid': '756fe956-aaad-4114-93fc-43199d86e59d',
            'volume_uom': '6e2a882b-eeeb-4caf-96e2-46167c0c1aac',
            '$$hashKey': '01N'
        },
        {
            'category': '66e1bc4f-1dab-4842-80c5-49f626bde74e',
            'created': '2014-01-30T11:14:42.608Z',
            'created_by': 1,
            'description': '',
            'diluent_per_volume': 0,
            'formulation': 'ad999cfe-a74d-4f8d-964a-98a40a705ed5',
            'is_deleted': false,
            'long_name': 'Penta-10-DPV-IM-3.0Vol-Liquid-WHO-CSV',
            'mode_of_use': 'e63bb35d-9a49-4d1d-9be9-5fada6f6d81b',
            'modified': '2014-01-30T11:14:42.655Z',
            'modified_by': 1,
            'name': 'Penta 10',
            'packed_volume': 3,
            'presentation': {
                'code': '10-DPV',
                'created': '2014-01-17T10:39:47.674Z',
                'description': 'vaccine product presentation ',
                'is_deleted': false,
                'modified': '2014-01-17T10:39:47.971Z',
                'name': '10 Doses per Vial',
                'uom': {
                    'created': '2014-01-15T14:20:02.098Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-15T14:23:06.756Z',
                    'name': 'Vial',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'vial',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': '82cc6fac-d0f6-43da-b0c6-07dc58669431'
                },
                'uuid': 'c0994b0e-c607-445c-b202-4d61b8c6cff0',
                'value': 10
            },
            'product': {
                'active': true,
                'base_uom': {
                    'created': '2014-01-15T14:14:48.785Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-17T08:05:24.522Z',
                    'name': 'Dose',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'dose',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': 'e5def927-b173-44b6-9112-3103a473a65c'
                },
                'code': 'Penta',
                'created': '2014-01-15T14:45:41.187Z',
                'description': 'Five in one combination vaccine against diseases. ',
                'is_deleted': false,
                'modified': '2014-01-15T14:47:19.121Z',
                'name': 'Penta Vaccine',
                'uuid': '1203c362-b7a8-499a-b7ba-b842bace7920'
            },
            'uuid': 'f97be2aa-d5b6-4560-8f31-5a559fb80567',
            'volume_uom': '6e2a882b-eeeb-4caf-96e2-46167c0c1aac',
            '$$hashKey': '01O'
        },
        {
            'category': '66e1bc4f-1dab-4842-80c5-49f626bde74e',
            'created': '2014-01-30T11:15:29.344Z',
            'created_by': 1,
            'description': '',
            'diluent_per_volume': 0,
            'formulation': 'ad999cfe-a74d-4f8d-964a-98a40a705ed5',
            'is_deleted': false,
            'long_name': 'HepB-1-DPV-IM-18.0Vol-Liquid-WHO-CSV',
            'mode_of_use': 'e63bb35d-9a49-4d1d-9be9-5fada6f6d81b',
            'modified': '2014-01-30T11:15:29.387Z',
            'modified_by': 1,
            'name': 'HepB 1',
            'packed_volume': 18,
            'presentation': {
                'code': '1-DPV',
                'created': '2014-01-17T10:55:22.686Z',
                'description': '1 dose per vial',
                'is_deleted': false,
                'modified': '2014-01-17T10:55:22.713Z',
                'name': '1 Dose Per Vial',
                'uom': {
                    'created': '2014-01-15T14:20:02.098Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-15T14:23:06.756Z',
                    'name': 'Vial',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'vial',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': '82cc6fac-d0f6-43da-b0c6-07dc58669431'
                },
                'uuid': '8ee9ff30-a9f5-41f9-8054-8257920adf2d',
                'value': 1
            },
            'product': {
                'active': true,
                'base_uom': {
                    'created': '2014-01-15T14:14:48.785Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-17T08:05:24.522Z',
                    'name': 'Dose',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'dose',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': 'e5def927-b173-44b6-9112-3103a473a65c'
                },
                'code': 'HepB',
                'created': '2014-01-15T15:59:30.999Z',
                'description': 'it is a protection against cervical cancer.',
                'is_deleted': false,
                'modified': '2014-01-15T15:59:31.031Z',
                'name': 'Hepatitis B Vaccine',
                'uuid': '0930b906-4802-4a65-8516-057bd839db3e'
            },
            'uuid': 'abf5f2fc-056a-45cc-b7b7-553a09c927d7',
            'volume_uom': '6e2a882b-eeeb-4caf-96e2-46167c0c1aac',
            '$$hashKey': '01P'
        },
        {
            'created': '2014-01-21T13:03:29.578Z',
            'created_by': null,
            'description': '',
            'diluent_per_volume': 0,
            'formulation': 'ad999cfe-a74d-4f8d-964a-98a40a705ed5',
            'is_deleted': false,
            'long_name': 'TT-20-DPV-Liquid-IM-2.5PackedVol-0.0DilPerVol-WHO-CSV',
            'mode_of_use': 'd4957c68-d977-4ff2-a5c2-3e8538d302cd',
            'modified': '2014-01-21T13:03:29.611Z',
            'modified_by': null,
            'name': 'TT 20',
            'packed_volume': 2.5,
            'presentation': {
                'code': '20-DPV',
                'created': '2014-01-17T10:40:48.140Z',
                'description': 'vaccine product presentation ',
                'is_deleted': false,
                'modified': '2014-01-17T10:40:48.185Z',
                'name': '20 Doses per Vial',
                'uom': {
                    'created': '2014-01-15T14:20:02.098Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-15T14:23:06.756Z',
                    'name': 'Vial',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'vial',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': '82cc6fac-d0f6-43da-b0c6-07dc58669431'
                },
                'uuid': '299939e1-94d7-4e8e-bfb7-c008af1692af',
                'value': 20
            },
            'product': {
                'active': true,
                'base_uom': {
                    'created': '2014-01-15T14:14:48.785Z',
                    'factor': 0,
                    'is_deleted': false,
                    'modified': '2014-01-17T08:05:24.522Z',
                    'name': 'Dose',
                    'rate': 0,
                    'rounding_precision': 2,
                    'symbol': 'dose',
                    'uom_category': '67855ff4-6897-425b-a3e8-08ff542f2194',
                    'uuid': 'e5def927-b173-44b6-9112-3103a473a65c'
                },
                'code': 'TT',
                'created': '2014-01-16T13:21:59.115Z',
                'description': '',
                'is_deleted': false,
                'modified': '2014-01-16T13:21:59.177Z',
                'name': 'Tetanus Toxoid Vaccine',
                'uuid': '939d5e05-2aa4-4883-9246-35c60dfa06a5'
            },
            'uuid': 'dfe5b135-12b8-4da0-ad39-b54e864f5663',
            'volume_uom': '6e2a882b-eeeb-4caf-96e2-46167c0c1aac',
            '$$hashKey': '01Q'
        }
    ],
    'stockCountInterval': 7,
    'uuid': 'ab@eha.com'
});
