<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Define the path to your JSON file
        $jsonPath = database_path('data/product.json');
        
        if (!File::exists($jsonPath)) {
            $this->command->error("Product JSON file not found at: {$jsonPath}");
            return;
        }

        // 2. Read and decode the JSON file
        $products = json_decode(File::get($jsonPath), true);
        
        DB::table('products')->delete(); // Clear table before seeding

        foreach ($products as $productData) {
            Product::create([
                'name'        => $productData['name'],
                
                // MAP 1: Generate SLUG from name
                'slug'        => Str::slug($productData['name']), 
                
                'description' => $productData['description'],
                'price'       => $productData['price'],
                
                // MAP 2: JSON 'quantity' -> DB 'stock'
                'stock'       => $productData['quantity'], 
                
                // MAP 3: JSON 'image' -> DB 'image_url'
                'image_url'   => $productData['image'] ?? null, 
                
                // Optional: Check for discount to set active status, or just set true
                'is_active'   => true, 
                
                // NOTE: 'id', 'brand', 'category', 'sizes', and 'discount' are ignored 
                // as they do not map directly to your current simplified schema.
            ]);
        }
    }
}