<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth; // Ensure Auth is used

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        // Must be logged in to checkout
        $user = Auth::user(); 
        if (!$user) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $request->validate([
            'shipping_address' => 'required|string',
            'phone' => 'required|string', // Added phone validation based on frontend
            'name' => 'required|string',   // Added name validation based on frontend
            'payment_method' => 'required|string', // Added payment method
        ]);

        // Fetch cart items linked to the user, including product details
        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        DB::beginTransaction();

        try {
            $total = 0;
            
            // 1. Pre-check: Stock and Calculate Total
            foreach ($cartItems as $item) {
                $product = $item->product;
                if (!$product) {
                    throw new \Exception("Product not found for cart item id {$item->id}");
                }
                
                // CRITICAL FIX: Use product->quantity (new column) instead of product->stock (old column)
                if ($item->quantity > $product->quantity) {
                    throw new \Exception("Not enough stock for product {$product->name}. Only {$product->quantity} available.");
                }
                
                // Price calculation (assuming discount is handled by frontend for display, 
                // but we use the base price for internal calculation simplicity if needed)
                $total += $product->price * $item->quantity; 
            }

            // 2. Create the main Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $total,
                'status' => 'processing', 
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
            ]);

            // 3. Create OrderItems and Decrement Product Stock
            foreach ($cartItems as $item) {
                $product = $item->product;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price' => $product->price, // Price at time of order
                    'size' => $item->size, 
                    'color' => $item->color, 
                ]);

                // CRITICAL FIX: Decrement the correct column name ('quantity')
                $product->decrement('quantity', $item->quantity);
            }

            // 4. Clear the Cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            // Return the new order details
            return response()->json(['message' => 'Order placed successfully', 'order' => $order->load('items.product')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed', 'error' => $e->getMessage()], 500);
        }
    }
}