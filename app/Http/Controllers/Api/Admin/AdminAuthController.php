<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    
public function login(Request $request): JsonResponse
{
    $validated = $request->validate([
        'email' => [
            'required',
            'email',
        ],
        'password' => [
            'required',
            'string',
        ],
    ]);

    $user = User::where(
        'email',
        $validated['email'],
    )->first();

    if (
        ! $user ||
        ! Hash::check(
            $validated['password'],
            $user->password,
        ) ||
        $user->role !== 'admin' ||
        ! $user->is_active
    ) {
        throw ValidationException::withMessages([
            'email' => [
                'The administrator credentials are incorrect.',
            ],
        ]);
    }

    $accessToken = $user
        ->createToken('admin-dashboard')
        ->accessToken;

    return response()->json([
        'message' => 'Admin login successful.',
        'token_type' => 'Bearer',
        'access_token' => $accessToken,
        'user' => [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ],
    ]);
}
      
       

    public function me(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $token = $request->user()?->token();

        if ($token) {
            $token->revoke();
        }

        return response()->json([
            'message' => 'Logged out successfully.',
        ]);
    }
}