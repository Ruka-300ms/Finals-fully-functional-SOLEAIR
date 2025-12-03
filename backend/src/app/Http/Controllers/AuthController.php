<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // REGISTER
    public function register(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'username' => $validated['username'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // Create a token for the user immediately
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user // Important: Return user data so frontend can redirect
        ], 201);
    }

    // LOGIN (Updated to support Username OR Email)
    public function login(Request $request)
    {
        // Get the input (we call it 'email' from frontend, but it might be a username)
        $loginInput = $request->input('email');
        $password = $request->input('password');

        // Check if the input looks like an email. If not, treat it as a 'username'
        $field = filter_var($loginInput, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        // Attempt authentication using the dynamic field
        if (!Auth::attempt([$field => $loginInput, 'password' => $password])) {
            return response()->json([
                'message' => 'Invalid login details'
            ], 401);
        }

        // Fetch the user
        $user = User::where($field, $loginInput)->firstOrFail();

        // Delete old tokens and issue a new one
        $user->tokens()->delete();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => $user
        ]);
    }
    
    // LOGOUT
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out successfully']);
    }
}