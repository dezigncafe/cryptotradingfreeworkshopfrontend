<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    /**
     * Log in an administrator.
     */
    public function login(Request $request,): JsonResponse {
        $validated = $request->validate(['email' => ['required','string','email','max:255',],
                                        'password' => ['required','string',]]);
        /*
         * Remove spaces and make the
         * submitted email lowercase.
         */
        $email = Str::lower(trim($validated['email'],),);

        /*
         * Find the account without
         * depending on email case.
         */
        $user = User::query()->whereRaw('LOWER(email) = ?',[$email],)->first();

        /*
         * Check account and password.
         */
        if (! $user || ! Hash::check($validated['password'], $user->password,)
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'The administrator email or password is incorrect.',
                ],
            ]);
        }

        /*
         * Only admin users can log in.
         */
        if ((string) $user->role !=='admin'
        ) {
            throw ValidationException::withMessages([
                'email' => [
                    'This user does not have administrator access.',
                ],
            ]);
        }

        /*
         * Prevent inactive administrators
         * from logging in.
         */
        if (! (bool) $user->is_active) {
            throw ValidationException::withMessages([
                'email' => [
                    'This administrator account is inactive.',
                ],
            ]);
        }

        /*
         * Create a Laravel Passport
         * personal access token.
         */
        $accessToken = $user->createToken('admin-dashboard',)->accessToken;

        return response()->json(['message' => 'Admin login successful.',
                                'token_type' => 'Bearer',
                                'access_token' => $accessToken,
                                'user' => [
                                    'id' => $user->id,
                                    'name' => $user->name,
                                    'email' => $user->email,
                                    'role' => $user->role,
                                    'is_active' => (bool) $user->is_active,
                                    ],
                            ]);
        }

        /**
         * Return the authenticated admin.
         */
        public function me(Request $request,): JsonResponse {
            return response()->json(['user' =>$request->user(),]);
        }

        /**
         * Log out and revoke the current token.
         */
        public function logout(Request $request,): JsonResponse {
            $token = $request->user()?->token();

            if ($token) {$token->revoke();}

            return response()->json([
                'message' =>
                    'Logged out successfully.',
            ]);
        }
}