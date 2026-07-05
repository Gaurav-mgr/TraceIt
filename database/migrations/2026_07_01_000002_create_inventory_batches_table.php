<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inventory_batches', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inventory_item_id')->constrained()->cascadeOnDelete();
            $table->string('batch_code')->nullable();
            $table->unsignedInteger('quantity')->default(0);
            $table->date('received_at')->nullable();
            $table->date('expires_at');
            $table->timestamps();

            $table->index(['expires_at', 'quantity']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inventory_batches');
    }
};
