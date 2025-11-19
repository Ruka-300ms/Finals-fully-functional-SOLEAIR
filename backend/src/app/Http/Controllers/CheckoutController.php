<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CheckoutController extends Controller
{
    public function checkout(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'shipping_address' => 'required|string',
            // optionally: payment info / method placeholder
        ]);

        $cartItems = Cart::with('product')->where('user_id', $user->id)->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['message' => 'Cart is empty'], 422);
        }

        DB::beginTransaction();

        try {
            $total = 0;
            foreach ($cartItems as $item) {
                $product = $item->product;
                if (! $product) {
                    throw new \Exception("Product not found for cart item id {$item->id}");
                }
                if ($item->quantity > $product->stock) {
                    throw new \Exception("Not enough stock for product {$product->id}");
                }
                $total += $product->price * $item->quantity;
            }

            // Create Order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $total,
                'status' => 'pending', // or 'processing'
                'shipping_address' => $request->shipping_address,
            ]);

            // Create OrderItems and decrement product stock
            foreach ($cartItems as $item) {
                $product = Product::find($item->product_id);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item->quantity,
                    'price' => $product->price,
                ]);

                // decrement stock (simple approach)
                $product->decrement('stock', $item->quantity);
            }

            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            DB::commit();

            return response()->json(['message' => 'Order placed', 'order' => $order->load('items.product')], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Checkout failed', 'error' => $e->getMessage()], 500);
        }
    }
}
