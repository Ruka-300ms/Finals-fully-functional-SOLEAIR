<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany; // <--- Added this import

class Product extends Model 
{ 
    use HasFactory; 

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'slug',         
        'description',
        'price',
        'stock',
        // 'category_id',  <-- Kept as you had it
        'image_url',    
        'is_active',    
    ];
    
    /**
     * The attributes that should be cast to native types.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock' => 'integer',
        'is_active' => 'boolean',
    ];

    // -------------------------------------------------------------------
    // E-COMMERCE RELATIONSHIPS
    // -------------------------------------------------------------------

    // Connection to Orders (Pivot table: order_items)
    public function orders(): BelongsToMany
    {
        return $this->belongsToMany(Order::class, 'order_items')
                    ->withPivot('quantity', 'price');
    }

    // NEW: Connection to Carts (One Product can be in many Users' carts)
    public function carts(): HasMany
    {
        return $this->hasMany(Cart::class);
    }
}