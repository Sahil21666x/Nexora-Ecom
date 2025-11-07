import { useEffect, useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Star, ShoppingCart, Plus, Minus } from "lucide-react"

export default function Products() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [cart, setCart] = useState([])
    const [quantities, setQuantities] = useState({})

    useEffect(() => {
        fetch("http://localhost:5000/api/products")
            .then((res) => res.json())
            .then((data) => {
                console.log(data, 'data')
                setProducts(data.data)
                setLoading(false)

                // Initialize quantities to 1 for all products
                const initialQuantities = {}
                data.data.forEach(product => {
                    initialQuantities[product.id] = 1
                })
                setQuantities(initialQuantities)
            })
            .catch((err) => {
                console.error("Error fetching products:", err)
                setLoading(false)
            })
    }, [])


    const handleAddToCart = async (product) => {

        const quantity = quantities[product.id] || 1
        const cartItem = {
            ...product,
            quantity: quantity
        }

        const res = await fetch("http://localhost:5000/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                productId: product.id,
                name: product.title,
                price: product.price,
                quantity: quantity,
                image: product.image
            }),
        });

        const data = await res.json();
        console.log('cartData',data);
        
        alert(data.message);

        setCart([...cart, cartItem])
        alert(`${product.title} (${quantity} items) added to cart! 🛒`)

        // Reset quantity to 1 after adding to cart
        setQuantities(prev => ({
            ...prev,
            [product.id]: 1
        }))
    }

    const increaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: (prev[productId] || 1) + 1
        }))
    }

    const decreaseQuantity = (productId) => {
        setQuantities(prev => ({
            ...prev,
            [productId]: Math.max(1, (prev[productId] || 1) - 1)
        }))
    }

    if (loading) {
        // Loading skeletons
        return (
            <div className="space-y-6 p-6">
                <Skeleton className="h-8 w-64" />
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <Card key={i} className="overflow-hidden">
                            <Skeleton className="h-48 w-full" />
                            <CardContent className="p-4 space-y-2">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 p-6">
            {/* Heading */}
            <div className="text-center">
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Our Products</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Discover amazing products at great prices. Shop with confidence and enjoy fast delivery.
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <Card key={product.id} className="hover:shadow-lg transition-all flex flex-col justify-between">
                        <div>
                            <CardHeader>
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-48 object-contain rounded-md"
                                />
                            </CardHeader>
                            <CardContent>
                                <CardTitle className="text-base font-semibold line-clamp-2">{product.title}</CardTitle>
                                <CardDescription className="text-sm capitalize mt-1">
                                    {product.category}
                                </CardDescription>
                                <div className="flex items-center justify-between mt-3">
                                    <p className="text-lg font-bold text-primary">₹{product.price}</p>
                                    <div className="flex items-center text-yellow-500">
                                        <Star className="w-4 h-4 fill-yellow-400" />
                                        <span className="ml-1 text-sm text-gray-700">{product.rating.rate}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </div>

                        {/* Quantity Controls and Add to Cart Button */}
                        <div className="px-4 pb-4 space-y-3">
                            {/* Quantity Controls */}
                            <div className="flex items-center justify-between bg-gray-100 rounded-lg p-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => decreaseQuantity(product.id)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Minus className="w-3 h-3" />
                                </Button>

                                <span className="font-semibold text-lg mx-2 min-w-8 text-center">
                                    {quantities[product.id] || 1}
                                </span>

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => increaseQuantity(product.id)}
                                    className="h-8 w-8 p-0"
                                >
                                    <Plus className="w-3 h-3" />
                                </Button>
                            </div>

                            {/* Add to Cart Button */}
                            <Button
                                className="w-full flex items-center justify-center gap-2"
                                onClick={() => handleAddToCart(product)}
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    )
}