<?php

namespace App\Http\Controllers\Api;

use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Services\RegisterService;
use App\Services\LoginTokenService;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\ErrorResource;
use App\Http\Requests\Api\LoginRequest;
use App\Http\Resources\SuccessResource;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\Api\RegisterRequest;

class AuthController extends Controller
{
    use RegisterService, LoginTokenService;

    /**
     * user register
     * @param App\Http\Requests\Api\RegisterRequest $request
     * 
     * @return json
     */
    public function register(RegisterRequest $request)
    {
        $data = $request->validated();
        $this->createUser($data);
        $response['message'] = 'Successfully Registered! Now, Login!';
        return new SuccessResource($response);
    }

    /**
     * user login
     * @param App\Http\Requests\Api\LoginRequest $request
     * 
     * @return json
     */
    public function login(LoginRequest $request)
    {
        $credentials = $request->validated();

        return $this->loginToken($credentials);
    }

    /**
     * authenticate user information
     * @param Illuminate\Http\Request $request
     * 
     * @return json
     */
    public function user(Request $request)
    {
        $response['data'] = new UserResource($request->user());
        return new SuccessResource($response);
    }

    /**
     * authenticate user logout (token delete)
     * @param Illuminate\Http\Request $request
     * 
     * @return json
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        $response['message'] = 'Successfully Logout!';
        return new SuccessResource($response);
    }

    /**
     * User Profile Update
     */
    public function profileUpdate(Request $request)
    {
        // request validation
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:180',
            'email' => 'required|email|max:180|unique:users,email,' . $request->user()->id
        ]);

        // return form validation error with json if error occured
        if ($validator->fails()) {
            return (new ErrorResource($validator->getMessageBag()))->response()->setStatusCode(422);
        }

        $data = $validator->validated();

        $user = $request->user();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->save();

        $response['message'] = 'Successfully profile updated';
        return new SuccessResource($response);
    }

    /**
     * User Profile Update
     */
    public function changePassword(Request $request)
    {
        // request validation
        $validator = Validator::make($request->all(), [
            'old_password' => ['required', 'string', function ($attribute, $value, $fail) use ($request) {
                if (!Hash::check($value, $request->user()->password)) {
                    $fail('The ' . Str::replace('_', ' ', $attribute) . ' is invalid.');
                }
            }],
            'new_password' => 'required|string|min:8|confirmed'
        ]);

        // return form validation error with json if error occured
        if ($validator->fails()) {
            return (new ErrorResource($validator->getMessageBag()))->response()->setStatusCode(422);
        }

        $data = $validator->validated();

        $user = $request->user();
        $user->password = Hash::make($data['new_password']);
        $user->save();

        $response['message'] = 'Successfully password updated';
        return new SuccessResource($response);
    }
}
