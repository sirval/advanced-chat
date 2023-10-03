<?php

namespace App\Http\Controllers;

use App\Trait\Utils;
use Illuminate\Http\Request;
use App\Services\ContactInvite;

class ContactInviteController extends Controller
{
    use Utils;

    public $service;
    public function __construct(ContactInvite $service)
    {
        $this->service = $service;
    }

    public function invite_contacts(Request $request)
    {
        return $this->service->inviteContact($request);
    }

    public function get_contacts()
    {
        return $this->service->getContacts();
    }
}
