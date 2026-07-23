<?php

namespace Tests\Feature\Admin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Laravel\Passport\ClientRepository;
use Tests\TestCase;

class LoginTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();

        /*
         * RefreshDatabase clears the testing
         * database. Therefore, create the Passport
         * personal access client after the database
         * has been refreshed.
         */
        app(
            ClientRepository::class,
        )->createPersonalAccessGrantClient(
            'Testing Personal Access Client',
            'users',
        );
    }

    public function test_admin_can_login_with_valid_credentials(): void
    {
        User::factory()->create([
            'name' =>
                'Test Admin',

            'email' =>
                'admin@example.com',

            'password' =>
                Hash::make(
                    'password123',
                ),

            /*
             * Keep the admin field that your
             * current application uses.
             */
            'role' =>
                'admin',
        ]);

        $response =
            $this->postJson(
                '/api/admin/login',
                [
                    'email' =>
                        'admin@example.com',

                    'password' =>
                        'password123',
                ],
            );

        $response
            ->assertOk()
            ->assertJsonStructure([
                /*
                 * Use the fields returned by
                 * AdminAuthController.
                 */
                'access_token',
                'user',
            ]);
    }

    public function test_login_fails_with_wrong_password(): void
    {
        User::factory()->create([
            'name' =>
                'Test Admin',

            'email' =>
                'admin@example.com',

            'password' =>
                Hash::make(
                    'password123',
                ),

            'role' =>
                'admin',
        ]);

        $this
            ->postJson(
                '/api/admin/login',
                [
                    'email' =>
                        'admin@example.com',

                    'password' =>
                        'wrong-password',
                ],
            )
            ->assertStatus(422);
    }
}