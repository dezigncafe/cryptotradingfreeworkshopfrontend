<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use RuntimeException;

class AdminUserSeeder extends Seeder
{
    public function run(): void
    {
        $email = env('ADMIN_EMAIL');
        $password = env('ADMIN_PASSWORD');

        if (! $email || ! $password) {
            throw new RuntimeException(
                'ADMIN_EMAIL and ADMIN_PASSWORD must be set.',
            );
        }

        User::updateOrCreate(
            [
                'email' => $email,
            ],
            [
                'name' => env(
                    'ADMIN_NAME',
                    'Workshop Administrator',
                ),
                'password' => Hash::make($password),
                'role' => 'admin',
                'is_active' => true,
            ],
        );
    }
}