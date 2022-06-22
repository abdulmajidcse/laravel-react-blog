<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\ErrorResource;
use App\Http\Resources\SuccessResource;
use App\Models\User;
use App\Notifications\PasswordResetNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Validator;

class PasswordResetController extends Controller
{
    /**
     * Forgot Password Reset Link Send in Email
     */
    public function forgotPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email|exists:users',
            'reset_url' => 'nullable|url'
        ]);

        // return form validation error with json if error occured
        if ($validator->fails()) {
            return (new ErrorResource($validator->getMessageBag()))->response()->setStatusCode(422);
        }

        $data = $validator->validated();

        // delete old tokens
        DB::table('password_resets')->where('email', $data['email'])->delete();

        // insert a new token
        $data['token'] = rand(100000, 999999);
        $data['created_at'] = now();
        DB::table('password_resets')->insert($data);

        // send a password reset notification via mail
        $resetUrl = url('auth/reset-password');
        $data['reset_url'] = array_key_exists('reset_url', $data) && !is_null($data['reset_url']) ? $data['reset_url'] : $resetUrl;
        Notification::route('mail', $data['email'])->notify(new PasswordResetNotification($data));

        $response['message'] = __('passwords.sent');
        return new SuccessResource($response);
    }

    /**
     * Reset Password with verify link which is send in email
     */
    public function resetPassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'email' => 'required|email',
            'password' => 'required|min:8|confirmed',
        ], [], ['token' => 'code']);

        // return form validation error with json if error occured
        if ($validator->fails()) {
            return (new ErrorResource($validator->getMessageBag()))->response()->setStatusCode(422);
        }

        $data = $validator->validated();

        $tokenValidity = DB::table('password_resets')->where('email', $data['email'])->where('token', $data['token'])->first();

        if (!$tokenValidity || ($tokenValidity && now()->subMinutes(30) > $tokenValidity->created_at)) {
            $errors['token'][] = 'The code is invalid.';
            return (new ErrorResource($errors))->response()->setStatusCode(422);
        }

        // delete old tokens
        DB::table('password_resets')->where('email', $data['email'])->delete();

        $user = User::where('email', $data['email'])->first();
        if ($user) {
            $user->forceFill([
                'password' => Hash::make($data['password'])
            ])->setRememberToken(Str::random(60));

            $user->save();

            $response['message'] = __('passwords.reset');
            return new SuccessResource($response);
        }

        $errors['email'][] = 'The email is invalid.';
        return (new ErrorResource($errors))->response()->setStatusCode(422);
    }
}
