<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryBatch extends Model
{
    /** @use HasFactory<\Database\Factories\InventoryBatchFactory> */
    use HasFactory;

    protected $fillable = [
        'inventory_item_id',
        'batch_code',
        'quantity',
        'received_at',
        'expires_at',
    ];

    protected $casts = [
        'quantity' => 'integer',
        'received_at' => 'date',
        'expires_at' => 'date',
    ];

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }

    protected function isExpired(): Attribute
    {
        return Attribute::get(fn (): bool => $this->expires_at->lt(today()));
    }
}
