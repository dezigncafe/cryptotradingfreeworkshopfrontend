<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| React SPA Routes
|--------------------------------------------------------------------------
|
| Laravel serves the same Blade view for the homepage and every React
| Router URL. React Router decides which component to display.
|
*/

Route::view('/', 'app');

Route::view('/{path}', 'app')
    ->where('path', '.*');