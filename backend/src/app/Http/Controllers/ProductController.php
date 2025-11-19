<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::query()->where('is_active', true);

        if ($q = $request->query('q')) {
            $query->where('name', 'like', "%{$q}%")
                  ->orWhere('description', 'like', "%{$q}%");
        }

        // optional pagination params, default 12 per page for frontend convenience
        $perPage = (int) $request->query('per_page', 12);

        // If the client requests page-based results:
        if ($request->has('page')) {
            return response()->json($query->paginate($perPage));
        }

        // otherwise return full collection (careful on large lists)
        return response()->json($query->get());
    }

    public function show($id)
    {
        $product = Product::find($id);

        if (! $product || ! $product->is_active) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        return response()->json($product);
    }
}
