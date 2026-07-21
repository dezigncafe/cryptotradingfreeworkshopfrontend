<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Workshop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class WorkshopController extends Controller
{
    private const STATUSES = [
        'draft',
        'registration_open',
        'full',
        'registration_closed',
        'completed',
        'cancelled',
        'archived',
    ];

    /**
     * Display a listing of workshops.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Workshop::query()
            ->latest('workshop_date');

        if ($request->filled('search')) {
            $search = trim(
                $request->string('search')->toString(),
            );

            $query->where(
                function ($builder) use ($search): void {
                    $builder
                        ->where(
                            'title',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'city',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'district',
                            'like',
                            "%{$search}%",
                        )
                        ->orWhere(
                            'venue',
                            'like',
                            "%{$search}%",
                        );
                },
            );
        }

        if ($request->filled('status')) {
            $query->where(
                'status',
                $request
                    ->string('status')
                    ->toString(),
            );
        }

        $paginator = $query->paginate(10);

        return response()->json([
            'data' => collect($paginator->items())
                ->map(
                    fn (Workshop $workshop): array =>
                        $this->transform($workshop),
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
            ],
        ]);
    }

    /**
     * Store a new workshop.
     */
    public function store(Request $request): JsonResponse
    {
        $validated =
            $this->validateWorkshop($request);

        $data = collect($validated)
            ->except('banner')
            ->all();

        $data['slug'] =
            $this->generateUniqueSlug(
                $validated['title'],
            );

        $data['is_featured'] =
            $request->boolean('is_featured');

        if ($request->hasFile('banner')) {
            $data['banner_path'] = $request
                ->file('banner')
                ->store(
                    'workshops',
                    'public',
                );
        }

        if ($data['is_featured']) {
            Workshop::query()->update([
                'is_featured' => false,
            ]);
        }

        $workshop = Workshop::create($data);

        return response()->json([
            'message' =>
                'Workshop created successfully.',

            'data' =>
                $this->transform($workshop),
        ], 201);
    }

    /**
     * Display a workshop.
     */
    public function show(
        Workshop $workshop,
    ): JsonResponse {
        return response()->json([
            'data' =>
                $this->transform($workshop),
        ]);
    }

    /**
     * Update a workshop.
     */
    public function update(
        Request $request,
        Workshop $workshop,
    ): JsonResponse {
        $validated =
            $this->validateWorkshop($request);

        $data = collect($validated)
            ->except('banner')
            ->all();

        if (
            $workshop->title !==
            $validated['title']
        ) {
            $data['slug'] =
                $this->generateUniqueSlug(
                    $validated['title'],
                    $workshop->id,
                );
        }

        $data['is_featured'] =
            $request->boolean('is_featured');

        if ($request->hasFile('banner')) {
            $newBannerPath = $request
                ->file('banner')
                ->store(
                    'workshops',
                    'public',
                );

            if ($workshop->banner_path) {
                Storage::disk('public')
                    ->delete(
                        $workshop->banner_path,
                    );
            }

            $data['banner_path'] =
                $newBannerPath;
        }

        if ($data['is_featured']) {
            Workshop::query()
                ->where(
                    'id',
                    '!=',
                    $workshop->id,
                )
                ->update([
                    'is_featured' => false,
                ]);
        }

        $workshop->update($data);

        return response()->json([
            'message' =>
                'Workshop updated successfully.',

            'data' => $this->transform(
                $workshop->fresh(),
            ),
        ]);
    }

    /**
     * Soft-delete a workshop.
     */
    public function destroy(
        Workshop $workshop,
    ): JsonResponse {
        /*
         * Do not delete the banner here because the
         * workshop may be restored later.
         */
        $workshop->delete();

        return response()->json([
            'message' =>
                'Workshop moved to trash successfully.',
        ]);
    }

    /**
     * Duplicate a workshop.
     */
    public function duplicate(
        Workshop $workshop,
    ): JsonResponse {
        $copy = $workshop->replicate();

        $copy->title =
            "{$workshop->title} Copy";

        $copy->slug =
            $this->generateUniqueSlug(
                $copy->title,
            );

        $copy->status = 'draft';
        $copy->is_featured = false;
        $copy->banner_path = null;

        $copy->save();

        return response()->json([
            'message' =>
                'Workshop duplicated successfully.',

            'data' =>
                $this->transform($copy),
        ], 201);
    }

    /**
     * Archive a workshop.
     */
    public function archive(
        Workshop $workshop,
    ): JsonResponse {
        $workshop->update([
            'status' => 'archived',
            'is_featured' => false,
        ]);

        return response()->json([
            'message' =>
                'Workshop archived successfully.',

            'data' => $this->transform(
                $workshop->fresh(),
            ),
        ]);
    }

    /**
     * Validate workshop form data.
     */
    private function validateWorkshop(
        Request $request,
    ): array {
        return $request->validate([
            'title' => [
                'required',
                'string',
                'max:255',
            ],

            'presenter' => [
                'required',
                'string',
                'max:255',
            ],

            'description' => [
                'nullable',
                'string',
            ],

            'district' => [
                'required',
                'string',
                'max:100',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'venue' => [
                'required',
                'string',
                'max:255',
            ],

            'map_url' => [
                'nullable',
                'url',
                'max:1000',
            ],

            'workshop_date' => [
                'required',
                'date',
            ],

            'start_time' => [
                'required',
                'date_format:H:i',
            ],

            'end_time' => [
                'required',
                'date_format:H:i',
                'after:start_time',
            ],

            'arrival_time' => [
                'nullable',
                'date_format:H:i',
            ],

            'capacity' => [
                'required',
                'integer',
                'min:1',
                'max:10000',
            ],

            'registration_open_at' => [
                'nullable',
                'date',
            ],

            'registration_close_at' => [
                'nullable',
                'date',
                'after_or_equal:registration_open_at',
            ],

            'status' => [
                'required',
                Rule::in(self::STATUSES),
            ],

            'whatsapp_group_url' => [
                'nullable',
                'url',
                'max:1000',
            ],

            'is_featured' => [
                'nullable',
                'boolean',
            ],

            'banner' => [
                'nullable',
                'image',
                'mimes:jpg,jpeg,png,webp',
                'max:5120',
            ],
        ]);
    }

    /**
     * Generate a unique workshop slug.
     */
    private function generateUniqueSlug(
        string $title,
        ?int $ignoreId = null,
    ): string {
        $baseSlug = Str::slug($title);

        if ($baseSlug === '') {
            $baseSlug = 'workshop';
        }

        $slug = $baseSlug;
        $counter = 2;

        while (true) {
            $query = Workshop::withTrashed()
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
     * Format workshop API response.
     */
  private function transform(
    Workshop $workshop,
): array {
    return [
        'id' => $workshop->id,
        'title' => $workshop->title,
        'slug' => $workshop->slug,
        'presenter' => $workshop->presenter,
        'description' => $workshop->description,
        'district' => $workshop->district,
        'city' => $workshop->city,
        'venue' => $workshop->venue,
        'map_url' => $workshop->map_url,

        'workshop_date' =>
            $workshop->workshop_date
                ?->format('Y-m-d'),

        'start_time' =>
            $this->formatTime(
                $workshop->start_time,
            ),

        'end_time' =>
            $this->formatTime(
                $workshop->end_time,
            ),

        'arrival_time' =>
            $this->formatTime(
                $workshop->arrival_time,
            ),

        'capacity' =>
            $workshop->capacity,

        'status' =>
            $workshop->status,

        'registration_open_at' =>
            $workshop->registration_open_at
                ?->format('Y-m-d\TH:i'),

        'registration_close_at' =>
            $workshop->registration_close_at
                ?->format('Y-m-d\TH:i'),

        'whatsapp_group_url' =>
            $workshop->whatsapp_group_url,

        'is_featured' =>
            (bool) $workshop->is_featured,

        'banner_path' =>
            $workshop->banner_path,

        'banner_url' =>
            $workshop->banner_path
                ? asset(
                    'storage/'.
                    ltrim(
                        $workshop->banner_path,
                        '/',
                    ),
                )
                : null,

        'created_at' =>
            $workshop->created_at
                ?->toIso8601String(),
    ];
}

    /**
     * Convert database time to HH:MM.
     */
    private function formatTime(
        ?string $time,
    ): ?string {
        if (! $time) {
            return null;
        }

        return substr($time, 0, 5);
    }
}