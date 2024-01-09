<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Events\StartVideoChat;
use App\Http\Repositories\ChatRespository;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class ChatController extends Controller
{
    public function __construct(private ChatRespository $chat)
    {
        $this->chat = $chat;
    }

    //TODO:: get all message related to a user and a specified receiver else retun empty message
    public function index(Request $request, ?int $receiverId = null) 
    {
    
       
        $message = empty($receiverId) ? [] : $this->chat->getEndToEndChats($request->user()->id, $receiverId);
        return Inertia::render('Chat/Chat', [
            'messages' => $message,
            'receiverInfo' => $this->chat->receiverInfo($receiverId) ?? null,
            'recentMessages' => $this->chat->getRecentUsersWithMessage($request->user()->id),
            'chatlist' => $this->chat->getChatList($request->user()->id, $receiverId)
        ]);
       
    }

    //TODO:: create message
    public function store(Request $request) 
    {
        $request->validate([
            'message' => 'required|string'
        ]);
        if (empty($request->receiver_id)) {
            return;
        }
       
        try {
            $message = $this->chat->sendMessage([
                'sender_id' => $request->user()->id,
                'receiver_id' => $request->receiver_id,
                'message' => $request->message
            ]);

            broadcast(new MessageSent($message, $request->user()->id, $request->receiver_id));

            return Redirect::route('chat.index', $request->receiver_id);  
        } catch (\Throwable $th) {
            return Redirect::route('chat.index', $request->receiver_id); 
        }
       
    }

    public function sendInvite(Request $request)
    {
       return $this->sendInvite($request);
    }

    public function callUser(Request $request)
    {
        $data['userToCall'] = $request->user_to_call;
        $data['signalData'] = $request->signal_data;
        $data['from'] = Auth::id();
        $data['type'] = 'incomingCall';

        broadcast(new StartVideoChat($data))->toOthers();
    }
    public function acceptCall(Request $request)
    {
        $data['signal'] = $request->signal;
        $data['to'] = $request->to;
        $data['type'] = 'callAccepted';
        broadcast(new StartVideoChat($data))->toOthers();
    }
}
