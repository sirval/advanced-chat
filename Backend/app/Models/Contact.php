<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
       'inviter_id',
       'invitee_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'invitee_id');
    }
}
