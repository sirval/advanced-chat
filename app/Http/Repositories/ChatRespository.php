<?php

namespace App\Http\Repositories;

use App\Models\Message;
use App\Models\User;
use App\Rules\CommaSeperatedEmailList;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class ChatRespository
{
    public function getEndToEndChats(int $sender_id, int $receiver_id)
    {
        return Message::whereIn('sender_id', [$sender_id, $receiver_id])
                ->whereIn('receiver_id', [$sender_id, $receiver_id])
                ->get();
    }

    public function getChatList(int $sender_id, int $receiver_id = null)
    {
        return User::whereNotIn('id', [$sender_id])->select(['id As user_id', 'name', 'created_at'])->limit(100)->get();
    }

    public function getRecentUsersWithMessage(int $senderId): array
    {
        DB::statement("SET SESSION sql_mode=''");
        $recentMessages = Message::where(function ($query) use ($senderId){
            $query->where('sender_id', $senderId)
                    ->orWhere('receiver_id', $senderId);    
        })->groupBy('sender_id', 'receiver_id', 'updated_at')
        ->select('sender_id', 'receiver_id', 'message')
        ->orderBy('updated_at', 'desc')
        ->limit(50)
        ->get();
        
        return $this->getFilterRecentMessages($recentMessages, $senderId);
    }

    public function sendMessage(array $data): Message
    {
        return Message::create($data);
    }

    public function getFilterRecentMessages(Collection $recentMessages, int $senderId): array
    {
        $recentUsersWithMessage = [];
        $usedUserIds = [];
        foreach ($recentMessages as $message) {
            $userId = $message->sender_id == $senderId ? $message->receiver_id : $message->sender_id;
            if (!in_array($userId, $usedUserIds)) {
                $recentUsersWithMessage[] = [
                    'user_id' => $userId,
                    'message' => $message->message
                ];
                $usedUserIds[] = $userId;
            }
        }

        foreach ($recentUsersWithMessage as $key => $userMessage) {
            $recentUsersWithMessage[$key]['name'] = User::where('id', $userMessage['user_id'])->value('name') ?? '';
        }

        return $recentUsersWithMessage;
    }

    public function receiverInfo(int $receiverId = null): User|null
    {
        return User::whereId($receiverId)->first();
    }

    private function validateEmailList($request)
    {
        return [
            'emails' => ['required', new CommaSeperatedEmailList],
        ];
    }
    public function sendInvite($request)
    {
        $validation = $this->validateEmailList($request);
        if (! $validation) {
            return false;
        }
        return true;
    }
}
