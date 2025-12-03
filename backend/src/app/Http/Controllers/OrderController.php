<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class OrderController extends Controller
{
    /**
     * Display a listing of the user's orders.
     */
    public function index()
    {
        $userId = Auth::id();

        // Fetch all orders for the logged-in user
        // We load the 'items' relationship (OrderItems) and the nested 'product' relation
        // to get all the necessary details for the frontend display.
        $orders = Order::where('user_id', $userId)
                       ->with(['items.product'])
                       ->orderByDesc('created_at')
                       ->get();

        return response()->json($orders, 200);
    }
}