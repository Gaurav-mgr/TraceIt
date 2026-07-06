<?php

use App\Models\MoneyRecord;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

test('users can bulk create spending records', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post(route('money.bulk-update', ['type' => 'spending']), [
            'rows' => [
                [
                    'title' => 'Grocery run',
                    'category' => 'Grocery',
                    'amount' => 47.25,
                    'recorded_at' => '2026-07-05',
                    'notes' => 'Weekly vegetables',
                ],
            ],
        ])
        ->assertRedirect();

    expect(MoneyRecord::whereBelongsTo($user)->first())
        ->not->toBeNull()
        ->type->toBe('spending')
        ->title->toBe('Grocery run')
        ->category->toBe('Grocery')
        ->amount->toBe('47.25');
});

test('dashboard exposes savings and spending analytics', function () {
    $user = User::factory()->create();

    MoneyRecord::create([
        'user_id' => $user->id,
        'type' => MoneyRecord::TYPE_SAVING,
        'title' => 'Salary reserve',
        'category' => 'Salary',
        'amount' => 500,
        'recorded_at' => now()->toDateString(),
    ]);

    MoneyRecord::create([
        'user_id' => $user->id,
        'type' => MoneyRecord::TYPE_SPENDING,
        'title' => 'Notebook',
        'category' => 'Stationery',
        'amount' => 30,
        'recorded_at' => now()->toDateString(),
    ]);

    $this->actingAs($user)
        ->get(route('dashboard'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('dashboard')
            ->where('summary.savings', 500)
            ->where('summary.spendings', 30)
            ->where('summary.balance', 470)
            ->has('chartData.day.line')
            ->has('chartData.month.pie')
        );
});

test('users cannot update another users money record', function () {
    $owner = User::factory()->create();
    $otherUser = User::factory()->create();

    $record = MoneyRecord::create([
        'user_id' => $owner->id,
        'type' => MoneyRecord::TYPE_SAVING,
        'title' => 'Emergency fund',
        'amount' => 100,
        'recorded_at' => now()->toDateString(),
    ]);

    $this->actingAs($otherUser)
        ->post(route('money.bulk-update', ['type' => 'saving']), [
            'rows' => [
                [
                    'id' => $record->id,
                    'title' => 'Changed fund',
                    'amount' => 1,
                    'recorded_at' => now()->toDateString(),
                ],
            ],
        ])
        ->assertSessionHasErrors('rows');

    expect($record->refresh()->amount)->toBe('100.00');
});
