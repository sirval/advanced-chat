<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\ContactInviteController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::group(['prefix' => 'v1'], function() {
    //AUTH ROUTES
    Route::get('/fresh', function() {
        Artisan::call('migrate:fresh');
        Artisan::call('db:seed');
        return response()->json([
            'response' => true,
            'status' => 200,
            'message' => 'Database migrated and tables seeded successfully'
        ]);
    });

    Route::controller(AuthController::class)->prefix('auth')->group(function () {
        Route::post('login', 'login');
        Route::post('register', 'register');
        Route::post('resend-code/{id}', 'resend_otp');
        Route::post('verify-code', 'verify_code');
        Route::post('change-contact/{id}', 'update_contact');
        
        Route::middleware(['auth:api'])->group(function () {
            Route::post('logout', 'logout');
            Route::post('refresh', 'refresh');
            Route::post('update-me/{id}', 'update_user_info'); 
            Route::delete('delete-account/{id}', 'deleteUser'); 
            Route::delete('delete-account/{id}', 'deleteUser'); 
        });
    });

    Route::middleware(['auth:api'])->group(function () {
        //FILE UPLOADS
        Route::controller(ContactInviteController::class)->prefix('contact')->group(function() {
            Route::post('invite', 'invite_contacts');
            Route::get('my-contacts', 'get_contacts');
        });

    });
   
});

