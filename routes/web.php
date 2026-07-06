<?php

use App\Http\Controllers\AnalyticsController;
use App\Http\Controllers\MoneyRecordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('dashboard', [AnalyticsController::class, 'index'])->name('dashboard');
    Route::get('savings', [MoneyRecordController::class, 'index'])->defaults('type', 'saving')->name('savings');
    Route::get('spendings', [MoneyRecordController::class, 'index'])->defaults('type', 'spending')->name('spendings');
    Route::post('money/{type}/bulk-update', [MoneyRecordController::class, 'bulkUpdate'])->name('money.bulk-update');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
