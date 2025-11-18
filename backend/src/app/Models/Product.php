<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

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
        // 'category_id',  <-- REMOVED
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

    public function orders(): BelongsToMany
    {
        // This remains correct, linking Products to Orders via the OrderItem pivot table.
        return $this->belongsToMany(Order::class, 'order_items')
                    ->withPivot('quantity', 'price');
    }
}