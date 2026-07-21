<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    public function handle(
        Request $request,
        Closure $next,
    ): Response {
        $user = $request->user();

        if (! $user) {
            return new JsonResponse([
                'message' => 'Unauthenticated.',
            ], 401);
        }

        if (
            $user->role !== 'admin' ||
            ! $user->is_active
        ) {
            return new JsonResponse([
                'message' => 'Administrator access is required.',
            ], 403);
        }

        return $next($request);
    }
}