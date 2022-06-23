<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PostController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\PasswordResetController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::prefix('auth')->name('api.auth.')->group(function () {
    Route::post('register', [AuthController::class, 'register'])->name('register');
    Route::post('login', [AuthController::class, 'login'])->name('login');
    Route::post('forgot-password', [PasswordResetController::class, 'forgotPassword'])->name('forgotPassword');
    Route::post('reset-password', [PasswordResetController::class, 'resetPassword'])->name('resetPassword');

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('user', [AuthController::class, 'user'])->name('user');
        Route::put('user/profile', [AuthController::class, 'profileUpdate'])->name('profileUpdate');
        Route::put('user/change-password', [AuthController::class, 'changePassword'])->name('changePassword');
        Route::delete('logout', [AuthController::class, 'logout'])->name('logout');

        Route::apiResource('categories', CategoryController::class);

        Route::apiResource('posts', PostController::class);
    });
});
