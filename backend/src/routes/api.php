<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\CheckoutController;

// Public product endpoints
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);

// Cart endpoints - prefer to protect with auth middleware.
// If you use sanctum or passport, replace 'auth:sanctum' with your guard.
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart', [CartController::class, 'store']);
    Route::put('/cart/{id}', [CartController::class, 'update']);
    Route::delete('/cart/{id}', [CartController::class, 'destroy']);

    // Checkout: convert cart -> order
    Route::post('/checkout', [CheckoutController::class, 'checkout']);
});
