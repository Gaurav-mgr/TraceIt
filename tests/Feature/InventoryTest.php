<?php

use App\Models\InventoryBatch;
use App\Models\InventoryItem;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('users can bulk create inventory items and batches', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('inventory.bulk-update'), [
            'rows' => [
                [
                    'name' => 'Milk cartons',
                    'category' => 'Dairy',
                    'unit' => 'cartons',
                    'low_stock_threshold' => 10,
                    'batch_code' => 'MILK-01',
                    'quantity' => 7,
                    'received_at' => '2026-07-01',
                    'expires_at' => '2026-07-05',
                ],
            ],
        ])
        ->assertRedirect();

    $item = InventoryItem::whereBelongsTo($user)->first();

    expect($item)
        ->not->toBeNull()
        ->name->toBe('Milk cartons')
        ->low_stock_threshold->toBe(10);

    expect($item->batches()->first())
        ->batch_code->toBe('MILK-01')
        ->quantity->toBe(7);
});

test('dashboard exposes low stock and expiry status rows', function () {
    $user = User::factory()->create();
    $item = InventoryItem::create([
        'user_id' => $user->id,
        'name' => 'Coffee beans',
        'category' => 'Pantry',
        'unit' => 'bags',
        'low_stock_threshold' => 5,
    ]);

    InventoryBatch::create([
        'inventory_item_id' => $item->id,
        'batch_code' => 'BEAN-44',
        'quantity' => 3,
        'received_at' => now()->toDateString(),
        'expires_at' => now()->addDays(7)->toDateString(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('summary.lowStock', 1)
            ->where('summary.expiringSoon', 1)
            ->where('inventoryRows.0.is_low_stock', true)
            ->where('inventoryRows.0.expiry_status', 'soon')
        );
});

test('users cannot update another users inventory batch', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();
    $item = InventoryItem::create([
        'user_id' => $owner->id,
        'name' => 'Rice bag',
        'unit' => 'bags',
        'low_stock_threshold' => 2,
    ]);
    $batch = InventoryBatch::create([
        'inventory_item_id' => $item->id,
        'quantity' => 12,
        'expires_at' => now()->addMonth()->toDateString(),
    ]);

    $this->actingAs($otherUser)
        ->post(route('inventory.bulk-update'), [
            'rows' => [
                [
                    'item_id' => $item->id,
                    'batch_id' => $batch->id,
                    'name' => 'Rice bag',
                    'unit' => 'bags',
                    'low_stock_threshold' => 2,
                    'quantity' => 1,
                    'expires_at' => now()->addMonth()->toDateString(),
                ],
            ],
        ])
        ->assertSessionHasErrors('rows');

    expect($batch->refresh()->quantity)->toBe(12);
});
