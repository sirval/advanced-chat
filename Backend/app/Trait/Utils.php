<?php
namespace App\Trait;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

trait Utils
{
    protected function resp(string $response, int $status, string $message=null, mixed $data )
    {
        return response()->json([
            "response" => $response,
            "status" => $status,
            "message" => $message,
            'data' => $data
        ]);
    }

    protected function generateVerificationCode($username)
    {
        $hashedNumber = abs(crc32(Hash::make($username. microtime(true))));
        // Limit the generated number to a 4-digit range (1000 to 9999)
        $uniqueCode = $hashedNumber % 900000 + 100000;
        
        // Check if the generated number already exists in the database
        while (User::where('verification_code', $uniqueCode)->exists()) {
            $hashedNumber = abs(crc32(Hash::make($username . microtime(true))));
            $uniqueCode = $hashedNumber % 900000 + 100000;
        }
        return $uniqueCode;
    }

    protected function user_exists($username) : mixed
    {
        $user = User::where('username', $username)->first();
        return $user !== null ? $user : false;
    }

    // public function fileUpload($files, $path)
    // {
    //     $i=0;
    //     $succ = 0;
    //     $data = [];
    //     $extensions = ['jpg', 'jpeg', 'png', 'svg'];
    //     foreach ($files->file('file') as $file) {
    //         $file_name = Str::random(10).time().$i++;
    //         if (Str::lower($file->getClientOriginalExtension()) == 'mp4') {
    //             $response = Cloudinary::uploadVideo($file->getRealPath(), array("public_id" => "{$path}/{$file_name}"))->getSecurePath();
    //             $succ = 1;
    //             array_push($data, ["path" => $response]);
    //         }elseif(in_array(Str::lower($file->getClientOriginalExtension()), $extensions)){
    //             $response = Cloudinary::upload($file->getRealPath(), 
    //                 array("public_id" => "{$path}/{$file_name}", "quality"=>"auto", "width"=>150, "height"=>150, 
    //                 "flags"=>array("progressive", "progressive:semi", "progressive:steep"),  "fetch_format"=>"auto")
    //             )->getSecurePath();
    //             $succ = 1;
    //             array_push($data,["path" => $response]);
    //         }else{
    //             $succ = 0;
    //         }

    //     }
    //     if ($succ === 1) {
           
    //         return  $this->resp("Success", 200, "File uploaded successfully", $data);
    //     }
    //     return  $this->resp("Error", 500, "File upload failed", null);
        



        
    //     // if(!empty($oldImg)){
    //     //     $publicId = $oldImg;
    //     //     Cloudinary::destroyImage($publicId);
    //     //     Cloudinary::delete($publicId);
    //     // }
    // }

    // public function deleteMediaFile($url)
    // {
    //     if (empty($url)) {
    //         return  $this->resp("Error", 400, "No file sepcified", null);
    //     }
    //     // Define a regular expression pattern to match the desired part of the URL
    //     $pattern = '/\/(\w+)\.(jpg|jpeg|png|svg|mp4)$/i';
    //     // Use preg_match to extract the matched part
    //     if (preg_match($pattern, $url, $matches)) {
    //         $publicId = $matches[1];
    //         $storage_path = Storage::disk('cloudinary')->fileExists($publicId);
    //         if($storage_path){
    //             return true;
    //         }
    //         dd($publicId);
    //     } else {
    //         return  $this->resp("Error", 400, "File not found", null);
    //     }

    // }

    // protected function createOrUpdateSettings($user_id, $list_by_location, $new, $used, $settings_id = null) : mixed
    // {
    //     if ($settings_id === null) {
    //         $settings = ItemListingSetting::create(
    //             [
    //                 'user_id' => $user_id,
    //                 'by_current_location' => $list_by_location, //boolean
    //                 'by_condition_new' => $new, //boolean
    //                 'by_condition_neatly_used' => $used, //boolean
    //             ]);
    //         $settings_id = $settings->id;
    //     }else{
    //         $settings_id = ItemListingSetting::where('user_id', $user_id)->pluck('id');
    //         $settings = ItemListingSetting::where('id', $settings_id)->update([
    //             'by_current_location' => $list_by_location,
    //             'by_condition_new' => $new,
    //             'by_condition_neatly_used' => $used,
    //         ]);
    //     }
       
    //     if ($settings) {
    //         return $this->getSettings($settings_id);
    //     }
    //     return false;
    // }

    // private function getSettings($setting_id)
    // {
    //     return ItemListingSetting::find($setting_id);
    // }

   

    public function iam($id)
    {
        $iam = User::find($id);
        return  $iam !== null ? $iam : false;
    }
    

}
