<?php

return [
    /**
     * Mode
     * live or test
     *
     */
    'mode' => 'live', // test mode has been removed, the user must buy testing credit on the platform

    /**
     * Public Key
     *
     */
    'publicKey' => env('SENDCHAMP_PUBLIC_KEY'),
    'publicUrl' => env('SENDCHAMP_PUBLIC_URL'),
];