<?php

namespace App\Models;

use Database\Factories\MoneyRecordFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MoneyRecord extends Model
{
    /** @use HasFactory<MoneyRecordFactory> */
    use HasFactory;

    public const TYPE_SAVING = 'saving';

    public const TYPE_SPENDING = 'spending';

    protected $fillable = [
        'user_id',
        'type',
        'title',
        'category',
        'amount',
        'recorded_at',
        'notes',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'recorded_at' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return array<int, string>
     */
    public static function types(): array
    {
        return [
            self::TYPE_SAVING,
            self::TYPE_SPENDING,
        ];
    }
}
