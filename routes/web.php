<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;

Route::view('/', 'app');

Route::view('/{path}', 'app')
    ->where('path', '.*');

require __DIR__.'/auth.php';
