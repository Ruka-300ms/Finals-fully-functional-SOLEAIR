<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model 
{
    use HasFactory;
    
    // Defines columns that can be mass assigned
    protected $fillable = ['user_id', 'product_id', 'quantity'];

    /**
     * A cart item belongs to one User.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * A cart item belongs to one Product.
     */
    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}