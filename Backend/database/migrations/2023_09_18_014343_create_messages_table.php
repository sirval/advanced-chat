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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('sender_id');
            $table->unsignedBigInteger('receiver_id');
            $table->string('userType', 15);
            $table->text('message');
            $table->boolean('isTextMessage')->default(0);
            $table->boolean('isFileMessage')->default(0);
            $table->boolean('isImageMessage')->default(0);
            $table->boolean('isVoiceMessage')->default(0);
            $table->boolean('isGroup')->default(0);
            $table->unsignedBigInteger('group_id')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
