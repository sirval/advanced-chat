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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('username')->unique();
            $table->string('verification_code', 10)->unique();
            $table->boolean('is_verified')->default(false);
            $table->string('profile_photo')->nullable();
            $table->timestamp('verification_code_expires_at');
            $table->timestamp('user_verified_at')->nullable();
            $table->string('password');
            $table->string('profile_visibility')->default('Everyone');
            $table->string('status_visibility')->default('Everyone');
            $table->string('groups_visibility')->default('Everyone');
            $table->boolean('read_receipt')->default(1);
            $table->boolean('is_active')->default(1);
            $table->boolean('security_notification')->default(0);
            $table->string('language')->default('en');
            $table->rememberToken();
            $table->timestamps();
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
