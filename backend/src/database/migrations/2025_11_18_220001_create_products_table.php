<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();

            // 2. Core Product Information (Including requested fields)
            $table->string('name');
            $table->string('slug')->unique(); // Unique, URL-friendly identifier
            $table->text('description');

            // 3. Pricing and Stock
            // DECIMAL(10, 2) is best practice for currency to avoid floating point issues.
            $table->decimal('price', 10, 2); 
            $table->unsignedInteger('stock')->default(0); // Cannot be negative

            // 4. Media and Status
            $table->string('image_url')->nullable(); // Path to the main product image
            $table->boolean('is_active')->default(true); // Toggles visibility on the frontend

            // 5. System Fields
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};