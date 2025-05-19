<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['http://localhost:3000', 'http://localhost:5173'],

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN'
    ],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];