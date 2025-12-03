<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Get all products
    public function index()
    {
        return response()->json(Product::all(), 200);
    }

    // Get single product details
    public function show($id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);
        return response()->json($product, 200);
    }

    // CREATE (Store)
    public function store(Request $request)
    {
        // Validation: Ensure all Admin Panel fields are present
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'price' => 'required|numeric',
            'category' => 'required|string',
            'quantity' => 'required|integer',
            'image' => 'required|string', 
            'description' => 'required|string', // <--- Now required!
        ]);

        // Create the product (The Model will auto-generate the slug)
        $product = Product::create($validatedData);

        return response()->json($product, 201);
    }

    // UPDATE
    public function update(Request $request, $id)
    {
        $product = Product::find($id);

        if (!$product) {
            return response()->json(['message' => 'Product not found'], 404);
        }

        // Validation: 'sometimes' means only validate if the field is present
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'price' => 'sometimes|required|numeric',
            'category' => 'sometimes|required|string',
            'quantity' => 'sometimes|required|integer',
            'image' => 'sometimes|required|string',
            'description' => 'sometimes|required|string',
        ]);

        $product->update($validatedData);

        return response()->json($product, 200);
    }

    // DELETE
    public function destroy($id)
    {
        $product = Product::find($id);
        if (!$product) return response()->json(['message' => 'Product not found'], 404);
        
        $product->delete();
        
        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}