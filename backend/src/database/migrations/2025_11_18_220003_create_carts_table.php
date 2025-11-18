<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            
            // Link to the user who owns the cart
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            
            // Link to the product being held in the cart
            $table->foreignId('product_id')->constrained()->onDelete('cascade');
            
            // Quantity of the product
            $table->unsignedSmallInteger('quantity')->default(1);
            
            // Ensure a user can only have one entry (row) per product
            $table->unique(['user_id', 'product_id']);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};