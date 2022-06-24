<?php

namespace App\Http\Controllers\Api;

use App\Models\Category;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\SuccessResource;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $categories = Category::latest()->paginate(intval($request->query('paginate', 10)));

        return new SuccessResource([
            'message' => 'All Category',
            'data' => $categories
        ]);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryStoreRequest $request)
    {
        $formData = $request->validated();
        $formData['slug'] = Str::slug($formData['name']);

        Category::create($formData);

        return (new SuccessResource(['message' => 'Successfully Category Created.']))->response()->setStatusCode(201);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show(Category $category)
    {

        // $formatData['data'] = new CategoryResource($category);
        // return new SuccessResource($formatData);

        return new SuccessResource(['data' => $category]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(CategoryUpdateRequest $request, Category $category)
    {
        $formData = $request->validated();
        $formData['slug'] = Str::slug($formData['name']);

        $category->update($formData);

        $response = ['message' => 'Successfully Category updated.', 'data' => $category];
        return new SuccessResource($response);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Category $category)
    {
        $category->delete();

        return new SuccessResource(['message' => 'Successfully Category deleted.']);
    }
}
