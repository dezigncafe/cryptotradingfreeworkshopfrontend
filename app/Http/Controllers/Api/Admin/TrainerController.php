<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Trainer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class TrainerController extends Controller
{
    /**
     * Display trainers.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Trainer::query()
            ->orderBy('display_order')
            ->orderBy('name');

        if ($request->filled('search')) {
            $search = trim(
                $request->string('search')->toString(),
            );

            $query->where(
                function ($builder) use ($search): void {
                    $builder
                        ->where(
                            'name',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'role',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'bio',
                            'like',
                            "%{$search}%",
                        );
                },
            );
        }

        if ($request->filled('active')) {
            $query->where(
                'is_active',
                $request->boolean('active'),
            );
        }

        $paginator = $query->paginate(12);

        return response()->json([
            'data' => collect($paginator->items())
                ->map(
                    fn (Trainer $trainer): array =>
                        $this->transform($trainer),
                )
                ->values(),

            'meta' => [
                'current_page' =>
                    $paginator->currentPage(),

                'last_page' =>
                    $paginator->lastPage(),

                'per_page' =>
                    $paginator->perPage(),

                'total' =>
                    $paginator->total(),

                'from' =>
                    $paginator->firstItem(),

                'to' =>
                    $paginator->lastItem(),
            ],
        ]);
    }

    /**
     * Store a new trainer.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $this->validateTrainer(
            $request,
        );

        $data = collect($validated)
            ->except([
                'photo',
                'remove_photo',
            ])
            ->all();

        $data['slug'] = $this->generateUniqueSlug(
            $validated['name'],
        );

        $data['is_active'] =
            $request->boolean('is_active');

        $data['display_order'] = (int) (
            $validated['display_order'] ?? 0
        );

        if ($request->hasFile('photo')) {
            $data['photo_path'] = $request
                ->file('photo')
                ->store(
                    'trainers',
                    'public',
                );
        }

        $trainer = Trainer::create($data);

        return response()->json([
            'message' =>
                'Trainer created successfully.',

            'data' =>
                $this->transform($trainer),
        ], 201);
    }

    /**
     * Display one trainer.
     */
    public function show(
        Trainer $trainer,
    ): JsonResponse {
        return response()->json([
            'data' =>
                $this->transform($trainer),
        ]);
    }

    /**
     * Update trainer.
     */
    public function update(
        Request $request,
        Trainer $trainer,
    ): JsonResponse {
        $validated = $this->validateTrainer(
            $request,
        );

        $data = collect($validated)
            ->except([
                'photo',
                'remove_photo',
            ])
            ->all();

        if ($trainer->name !== $validated['name']) {
            $data['slug'] =
                $this->generateUniqueSlug(
                    $validated['name'],
                    $trainer->id,
                );
        }

        $data['is_active'] =
            $request->boolean('is_active');

        $data['display_order'] = (int) (
            $validated['display_order'] ?? 0
        );

        if ($request->hasFile('photo')) {
            $newPhotoPath = $request
                ->file('photo')
                ->store(
                    'trainers',
                    'public',
                );

            if ($trainer->photo_path) {
                Storage::disk('public')
                    ->delete(
                        $trainer->photo_path,
                    );
            }

            $data['photo_path'] =
                $newPhotoPath;
        } elseif (
            $request->boolean('remove_photo')
            && $trainer->photo_path
        ) {
            Storage::disk('public')->delete(
                $trainer->photo_path,
            );

            $data['photo_path'] = null;
        }

        $trainer->update($data);

        return response()->json([
            'message' =>
                'Trainer updated successfully.',

            'data' => $this->transform(
                $trainer->fresh(),
            ),
        ]);
    }

    /**
     * Soft-delete trainer.
     */
    public function destroy(
        Trainer $trainer,
    ): JsonResponse {
        /*
         * Keep the image because the trainer
         * record can be restored later.
         */
        $trainer->delete();

        return response()->json([
            'message' =>
                'Trainer moved to trash successfully.',
        ]);
    }

    /**
     * Validate trainer data.
     */
    private function validateTrainer(
        Request $request,
    ): array {
        return $request->validate([
            'name' => [
                'required',
                'string',
                'max:255',
            ],

            'role' => [
                'required',
                'string',
                'max:255',
            ],

            'bio' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'linkedin_url' => [
                'nullable',
                'url',
                'max:1000',
            ],
                'youtube_url' => [
                    'nullable',
                    'url',
                    'max:1000',
                ],

                'facebook_url' => [
                    'nullable',
                    'url',
                    'max:1000',
                ],
            'display_order' => [
                'nullable',
                'integer',
                'min:0',
                'max:65535',
            ],

            'is_active' => [
                'nullable',
                'boolean',
            ],

            'photo' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],

            'remove_photo' => [
                'nullable',
                'boolean',
            ],
        ]);
    }

    /**
     * Generate unique slug.
     */
    private function generateUniqueSlug(
        string $name,
        ?int $ignoreId = null,
    ): string {
        $baseSlug = Str::slug($name);

        if ($baseSlug === '') {
            $baseSlug = 'trainer';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (true) {
            $query = Trainer::withTrashed()
                ->where('slug', $slug);

            if ($ignoreId !== null) {
                $query->where(
                    'id',
                    '!=',
                    $ignoreId,
                );
            }

            if (! $query->exists()) {
                return $slug;
            }

            $slug =
                "{$baseSlug}-{$counter}";

            $counter++;
        }
    }

    /**
     * Format trainer API response.
     */
    private function transform(
    Trainer $trainer,
): array {
    return [
        'id' => $trainer->id,

        'name' => $trainer->name,

        'slug' => $trainer->slug,

        'role' => $trainer->role,

        'bio' => $trainer->bio,

        'linkedin_url' =>
            $trainer->linkedin_url,
            'youtube_url' =>
    $trainer->youtube_url,

'facebook_url' =>
    $trainer->facebook_url,

        'display_order' =>
            $trainer->display_order,

        'is_active' =>
            (bool) $trainer->is_active,

        'photo_path' =>
            $trainer->photo_path,

        'photo_url' =>
            $trainer->photo_path
                ? asset(
                    'storage/'.
                    ltrim(
                        $trainer->photo_path,
                        '/',
                    ),
                )
                : null,

        'created_at' =>
            $trainer->created_at
                ?->toIso8601String(),

        'updated_at' =>
            $trainer->updated_at
                ?->toIso8601String(),
    ];
}

public function __invoke(): JsonResponse
    {
        $trainers = Trainer::query()
            ->where('is_active', true)
            ->orderBy('display_order')
            ->orderBy('name')
            ->get()
            ->map(
                function (Trainer $trainer): array {
                    return [
                        'id' => $trainer->id,

                        'name' => $trainer->name,

                        'slug' => $trainer->slug,

                        'role' => $trainer->role,

                        'bio' => $trainer->bio,

                        'linkedin_url' =>
                            $trainer->linkedin_url,

                        'display_order' =>
                            $trainer->display_order,

                        'photo_path' =>
                            $trainer->photo_path,

                        'photo_url' =>
                            $trainer->photo_path
                                ? asset(
                                    'storage/'.
                                    ltrim(
                                        $trainer->photo_path,
                                        '/',
                                    ),
                                )
                                : null,
                    ];
                },
            )
            ->values();

        return response()->json([
            'data' => $trainers,
        ]);
    }
}