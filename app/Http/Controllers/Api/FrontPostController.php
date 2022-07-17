<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class FrontPostController extends Controller
{
    /**
     * index
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $posts = Post::with('category')->latest('id')->paginate(intval($request->query('paginate', 10)));
        return response()->json([
            'success' => true,
            'message' => 'All posts',
            'data' => $posts,
        ]);
    }
}
