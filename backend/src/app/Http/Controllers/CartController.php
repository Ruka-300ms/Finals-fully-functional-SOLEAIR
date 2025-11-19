<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    // GET /cart
    public function index(Request $request)
    {
        $userId = $request->user()->id; // auth middleware ensures user exists
        $items = Cart::with('product')
                     ->where('user_id', $userId)
                     ->get();

        return response()->json($items, 200);
    }

    // POST /cart
    public function store(Request $request)
    {
        $userId = $request->user()->id;

        $data = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::find($data['product_id']);

        // Check stock
        if ($product->stock < $data['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available',
                'available_stock' => $product->stock
            ], 422);
        }

        // If cart entry exists, increment but don't exceed stock
        $cartItem = Cart::where('user_id', $userId)
                        ->where('product_id', $data['product_id'])
                        ->first();

        if ($cartItem) {
            $newQuantity = $cartItem->quantity + $data['quantity'];
            if ($newQuantity > $product->stock) {
                return response()->json([
                    'message' => 'Cannot add more than available stock',
                    'available_stock' => $product->stock
                ], 422);
            }
            $cartItem->quantity = $newQuantity;
            $cartItem->save();
        } else {
            $cartItem = Cart::create([
                'user_id' => $userId,
                'product_id' => $data['product_id'],
                'quantity' => $data['quantity'],
            ]);
        }

        return response()->json(['message' => 'Item added to cart', 'data' => $cartItem->load('product')], 201);
    }

    // PUT /cart/{id}
    public function update(Request $request, $id)
    {
        $userId = $request->user()->id;

        $data = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('id', $id)->where('user_id', $userId)->first();

        if (! $cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $product = $cartItem->product;

        if ($data['quantity'] > $product->stock) {
            return response()->json(['message' => 'Quantity exceeds available stock', 'available_stock' => $product->stock], 422);
        }

        $cartItem->quantity = $data['quantity'];
        $cartItem->save();

        return response()->json(['message' => 'Cart updated', 'data' => $cartItem->load('product')], 200);
    }

    // DELETE /cart/{id}
    public function destroy(Request $request, $id)
    {
        $userId = $request->user()->id;

        $cartItem = Cart::where('id', $id)->where('user_id', $userId)->first();

        if (! $cartItem) {
            return response()->json(['message' => 'Cart item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Cart item removed'], 200);
    }
}
