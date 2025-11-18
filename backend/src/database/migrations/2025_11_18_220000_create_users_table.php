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
        // Drop the table if it exists (for fresh migrations, but typically only used in rollback)
        Schema::create('users', function (Blueprint $table) {
            $table->id();

            // 1. Core Login Credentials
            $table->string('username')->unique(); // Used for login, as requested
            $table->string('password');

            // 2. Personal & Contact Information
            $table->string('name'); // Full name
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();

            // 3. E-commerce Specific Details
            $table->text('address')->nullable(); // For shipping/billing, made nullable as requested
            $table->string('phone_number')->nullable();
            
            // 4. Role/Permissions
            // '0' = Customer (default), '1' = Admin/Staff
            $table->boolean('is_admin')->default(false); 

            // 5. System Fields
            $table->rememberToken();
            $table->timestamps(); // creates 'created_at' and 'updated_at' columns
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};