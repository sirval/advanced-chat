<?php

namespace App\Http\Resources;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'inviter_name' => $this->name,
            'inviter_username' => $this->username,
            'contact' => $this->contacts->map(function ($contact) {
                return [
                    'contact_id' => $contact->id,
                    'invitee_id' => $contact->invitee_id,
                    'contact_name' => $contact->user->name ?? null,
                    'contact_username' => $contact->user->username ?? null,
                    'is_verified' => $contact->user->is_verified ?? 0,
                ];
            })
        ];
    }
}
