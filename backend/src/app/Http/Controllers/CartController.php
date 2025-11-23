<?php
namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CartController extends Controller
{
    // READ: View User's Cart
    public function index()
    {
        // Assuming user is logged in. If no auth yet, replace Auth::id() with a manual user_id
        $cartItems = Cart::where('user_id', Auth::id())->with('product')->get();
        return response()->json($cartItems, 200);
    }

    // CREATE: Add to Cart
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $userId = Auth::id(); 

        // Check if item already exists in cart for this user
        $cartItem = Cart::where('user_id', $userId)
                        ->where('product_id', $request->product_id)
                        ->first();

        if ($cartItem) {
            // If exists, just increment quantity
            $cartItem->quantity += $request->quantity;
            $cartItem->save();
        } else {
            // Create new entry
            $cartItem = Cart::create([
                'user_id' => $userId,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity
            ]);
        }

        return response()->json(['message' => 'Added to cart', 'data' => $cartItem], 201);
    }

    // UPDATE: Change Quantity
    public function update(Request $request, $id)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        $cartItem = Cart::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cartItem->quantity = $request->quantity;
        $cartItem->save();

        return response()->json(['message' => 'Cart updated', 'data' => $cartItem], 200);
    }

    // DELETE: Remove Item
    public function destroy($id)
    {
        $cartItem = Cart::where('user_id', Auth::id())->where('id', $id)->first();

        if (!$cartItem) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart'], 200);
    }
}