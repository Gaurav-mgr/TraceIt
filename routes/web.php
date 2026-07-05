<?php

use App\Http\Controllers\InventoryController;
use App\Http\Controllers\AnalyticsController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [AnalyticsController::class, 'index'])->name('dashboard');
    Route::get('inventory', [InventoryController::class, 'index'])->name('inventory');
    Route::post('inventory/bulk-update', [InventoryController::class, 'bulkUpdate'])->name('inventory.bulk-update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
