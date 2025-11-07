import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Minus, Trash2 } from "lucide-react";

export default function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [removing, setRemoving] = useState(false);

    // 🧠 Fetch cart from backend
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/cart");
                const data = await res.json();
                console.log(data.data);
                setCart(data.data || []);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // ❌ Remove item from cart
    const handleRemove = async (productId) => {
        setRemoving(true);
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: "DELETE",
            });
            const data = await res.json();

            setCart(data.data);
        } catch (error) {
            console.error("Error removing item:", error);
        } finally {
            setRemoving(false);
        }
    };

    // 🔄 Update item quantity
    const handleUpdateQuantity = async (productId, newQuantity) => {
        if (newQuantity < 1) return; // Prevent quantity less than 1
        
        setUpdating(true);
        try {
            const res = await fetch(`http://localhost:5000/api/cart/${productId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ quantity: newQuantity }),
            });
            const data = await res.json();

            if (data.success) {
                setCart(data.data);
            } else {
                console.error("Error updating quantity:", data.message);
            }
        } catch (error) {
            console.error("Error updating quantity:", error);
        } finally {
            setUpdating(false);
        }
    };

    // ➕ Increase quantity
    const increaseQuantity = (productId, currentQuantity) => {
        handleUpdateQuantity(productId, currentQuantity + 1);
    };

    // ➖ Decrease quantity
    const decreaseQuantity = (productId, currentQuantity) => {
        if (currentQuantity > 1) {
            handleUpdateQuantity(productId, currentQuantity - 1);
        }
    };

    // 💰 Calculate total
    const getTotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
    };

    // ⏳ Loading spinner
    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    // 🛒 Empty cart
    if (!cart || !cart.items || cart.items.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center min-h-[60vh] text-center px-4">
                <h2 className="text-2xl font-semibold">Your cart is empty 🛍️</h2>
                <p className="text-muted-foreground mt-2">Add some products to see them here.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50/30 py-4 px-3 sm:px-4 lg:px-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6 sm:mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Shopping Cart</h1>
                    <p className="text-sm sm:text-base text-muted-foreground mt-2">
                        {cart.items.length} item{cart.items.length !== 1 ? 's' : ''} in your cart
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Cart Items - Takes 2/3 on desktop, full width on mobile */}
                    <div className="lg:col-span-2">
                        <Card className="w-full">
                            <CardHeader className="pb-4">
                                <CardTitle className="text-lg sm:text-xl">Cart Items</CardTitle>
                            </CardHeader>

                            <CardContent className="p-0">
                                {cart.items.map((item, index) => (
                                    <div key={index} className="border-b last:border-b-0">
                                        <div className="p-4 sm:p-6">
                                            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                                {/* Product Image */}
                                                <div className="flex-shrink-0">
                                                    <img
                                                        src={item.image || "https://via.placeholder.com/80"}
                                                        alt={item.name}
                                                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover border"
                                                    />
                                                </div>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-base sm:text-lg text-gray-900 truncate">
                                                        {item.name}
                                                    </h3>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        ₹{item.price} per item
                                                    </p>
                                                    
                                                    {/* Mobile: Quantity and Price */}
                                                    <div className="sm:hidden mt-3">
                                                        <div className="flex items-center justify-between">
                                                            {/* Quantity Controls - Mobile */}
                                                            <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-1">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                                                    disabled={updating || item.quantity <= 1}
                                                                    className="h-7 w-7 p-0 hover:bg-gray-200"
                                                                >
                                                                    <Minus className="w-3 h-3" />
                                                                </Button>
                                                                
                                                                <span className="font-semibold text-base mx-2 min-w-6 text-center">
                                                                    {updating ? (
                                                                        <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                                                                    ) : (
                                                                        item.quantity
                                                                    )}
                                                                </span>
                                                                
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() => increaseQuantity(item.productId, item.quantity)}
                                                                    disabled={updating}
                                                                    className="h-7 w-7 p-0 hover:bg-gray-200"
                                                                >
                                                                    <Plus className="w-3 h-3" />
                                                                </Button>
                                                            </div>

                                                            {/* Price - Mobile */}
                                                            <p className="font-semibold text-lg">
                                                                ₹{(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Desktop: Quantity, Price and Actions */}
                                                <div className="hidden sm:flex items-center gap-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => decreaseQuantity(item.productId, item.quantity)}
                                                            disabled={updating || item.quantity <= 1}
                                                            className="h-8 w-8 p-0 hover:bg-gray-200"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </Button>
                                                        
                                                        <span className="font-semibold text-lg mx-2 min-w-8 text-center">
                                                            {updating ? (
                                                                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                                                            ) : (
                                                                item.quantity
                                                            )}
                                                        </span>
                                                        
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => increaseQuantity(item.productId, item.quantity)}
                                                            disabled={updating}
                                                            className="h-8 w-8 p-0 hover:bg-gray-200"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </Button>
                                                    </div>

                                                    {/* Price */}
                                                    <p className="font-semibold text-lg min-w-20 text-right">
                                                        ₹{(item.price * item.quantity).toFixed(2)}
                                                    </p>

                                                    {/* Remove Button */}
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => handleRemove(item.productId)}
                                                        disabled={removing}
                                                        className="h-9 w-9 p-0 text-destructive hover:bg-destructive/10"
                                                    >
                                                        {removing ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Mobile: Remove Button */}
                                            <div className="sm:hidden mt-3 flex justify-end">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleRemove(item.productId)}
                                                    disabled={removing}
                                                    className="text-destructive hover:bg-destructive/10"
                                                >
                                                    {removing ? (
                                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                                    ) : (
                                                        <Trash2 className="w-4 h-4 mr-2" />
                                                    )}
                                                    Remove
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary - Takes 1/3 on desktop, full width on mobile */}
                    <div className="lg:col-span-1">
                        <Card className="w-full sticky top-6">
                            <CardHeader>
                                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-muted-foreground">Subtotal:</span>
                                        <span className="font-medium">₹{getTotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-muted-foreground">Shipping:</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                    <div className="flex justify-between text-sm sm:text-base">
                                        <span className="text-muted-foreground">Tax:</span>
                                        <span className="font-medium">₹0.00</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-base sm:text-lg font-semibold">
                                        <span>Total:</span>
                                        <span className="text-primary">₹{getTotal()}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex flex-col gap-3">
                                <Button 
                                    size="lg" 
                                    className="w-full py-3 text-base font-semibold"
                                    onClick={() => window.location.href = "/checkout"}
                                >
                                    Proceed to Checkout
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => window.location.href = "/"}
                                >
                                    Continue Shopping
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}