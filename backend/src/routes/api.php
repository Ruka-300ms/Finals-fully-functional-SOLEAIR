<?php

use Illuminate\Support\Facades\Route; // <-- ADDED: Necessary facade import
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| These routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group.
|
*/

// Correct syntax for defining a GET route that maps to a Controller method:
Route::get('/test-products', [ProductController::class, 'index']);

// Optional: You might also have a test route for the currently authenticated user
// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });