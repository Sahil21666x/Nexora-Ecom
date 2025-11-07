import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CreditCard, Truck, MapPin } from "lucide-react";

export default function Checkout() {
    const [currentStep, setCurrentStep] = useState(1);
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        phone: "",
        firstName: "",
        lastName: "",
        address: "",
        country: "",
        apartment: "",
        zip: "",
        city: "",
        state: "",
        deliveryMethod: "standard",
        paymentMethod: "card"
    });

    // Fetch cart data from API
    useEffect(() => {
        const fetchCart = async () => {
            try {
                const res = await fetch("http://localhost:5000/api/cart");
                const data = await res.json();
                setCart(data.data);
            } catch (error) {
                console.error("Error fetching cart:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleContinue = () => {
        if (currentStep < 3) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const orderData = {
                shippingInfo: {
                    email: formData.email,
                    phone: formData.phone,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    address: formData.address,
                    country: formData.country,
                    apartment: formData.apartment,
                    zip: formData.zip,
                    city: formData.city,
                    state: formData.state,
                },
                deliveryMethod: formData.deliveryMethod,
                paymentMethod: formData.paymentMethod,
                cartItems: cart.items,
                subtotal: getSubtotal(),
                deliveryCost: getDeliveryCost(),
                taxes: getTaxes(),
                total: getTotal()
            };

            const res = await fetch("http://localhost:5000/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await res.json();

            if (data.success) {
                alert("Order placed successfully! 🎉");

                setFormData({
                    email: "",
                    phone: "",
                    firstName: "",
                    lastName: "",
                    address: "",
                    country: "",
                    apartment: "",
                    zip: "",
                    city: "",
                    state: "",
                    deliveryMethod: "standard",
                    paymentMethod: "card"
                })

                console.log("Order created:", data.data);
            } else {
                alert("Failed to place order: " + data.message);
            }
        } catch (error) {
            console.error("Error submitting order:", error);
            alert("Error placing order. Please try again.");
        } finally {
            setSubmitting(false);
        }
    };

    // Calculate totals
    const getSubtotal = () => {
        if (!cart?.items) return 0;
        return cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    };

    const getDeliveryCost = () => {
        switch (formData.deliveryMethod) {
            case "standard": return 10;
            case "express": return 20;
            case "next-day": return 25;
            default: return 0;
        }
    };

    const getTaxes = () => {
        return getSubtotal() * 0.08; // 8% tax
    };

    const getTotal = () => {
        return getSubtotal() + getDeliveryCost() + getTaxes();
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-[#f9f9f7]">
            {/* Left Section - Forms */}
            <div className="w-full md:w-2/3 p-6 md:p-10">
                {/* Progress Steps */}
                <div className="flex items-center justify-center mb-8">
                    {[1, 2, 3].map((step) => (
                        <div key={step} className="flex items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step === currentStep
                                        ? "bg-black text-white"
                                        : step < currentStep
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-300 text-gray-600"
                                    }`}
                            >
                                {step}
                            </div>
                            {step < 3 && (
                                <div
                                    className={`w-16 h-1 mx-2 ${step < currentStep ? "bg-green-500" : "bg-gray-300"
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>

                <div className="max-w-2xl mx-auto">
                    {/* Step 1: Shipping */}
                    {currentStep === 1 && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <MapPin className="w-5 h-5" />
                                <h2 className="text-2xl font-semibold">1. Shipping Address</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    placeholder="Email address"
                                    value={formData.email}
                                    onChange={(e) => handleInputChange("email", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="Phone number"
                                    value={formData.phone}
                                    onChange={(e) => handleInputChange("phone", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="First name"
                                    value={formData.firstName}
                                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="Last name"
                                    value={formData.lastName}
                                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="Street address"
                                    value={formData.address}
                                    onChange={(e) => handleInputChange("address", e.target.value)}
                                    className="md:col-span-2"
                                    required
                                />
                                <Input
                                    placeholder="Country"
                                    value={formData.country}
                                    onChange={(e) => handleInputChange("country", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="Apartment, Building, Floor"
                                    value={formData.apartment}
                                    onChange={(e) => handleInputChange("apartment", e.target.value)}
                                />
                                <Input
                                    placeholder="Zip"
                                    value={formData.zip}
                                    onChange={(e) => handleInputChange("zip", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange("city", e.target.value)}
                                    required
                                />
                                <Input
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={(e) => handleInputChange("state", e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 2: Delivery */}
                    {currentStep === 2 && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <Truck className="w-5 h-5" />
                                <h2 className="text-2xl font-semibold">2. Delivery Method</h2>
                            </div>

                            <RadioGroup
                                value={formData.deliveryMethod}
                                onValueChange={(value) => handleInputChange("deliveryMethod", value)}
                                className="space-y-4"
                            >
                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="standard" id="standard" />
                                    <Label htmlFor="standard" className="flex-1 cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Standard Delivery</p>
                                                <p className="text-sm text-muted-foreground">5-7 business days</p>
                                            </div>
                                            <p className="font-semibold">₹10</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="express" id="express" />
                                    <Label htmlFor="express" className="flex-1 cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Express Delivery</p>
                                                <p className="text-sm text-muted-foreground">2-3 business days</p>
                                            </div>
                                            <p className="font-semibold">₹20</p>
                                        </div>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="next-day" id="next-day" />
                                    <Label htmlFor="next-day" className="flex-1 cursor-pointer">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">Next Day Delivery</p>
                                                <p className="text-sm text-muted-foreground">Next business day</p>
                                            </div>
                                            <p className="font-semibold">₹25</p>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    )}

                    {/* Step 3: Payment */}
                    {currentStep === 3 && (
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <CreditCard className="w-5 h-5" />
                                <h2 className="text-2xl font-semibold">3. Payment Method</h2>
                            </div>

                            <RadioGroup
                                value={formData.paymentMethod}
                                onValueChange={(value) => handleInputChange("paymentMethod", value)}
                                className="space-y-4"
                            >
                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="card" id="card" />
                                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                                        <p className="font-medium">Credit/Debit Card</p>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="paypal" id="paypal" />
                                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                                        <p className="font-medium">PayPal</p>
                                    </Label>
                                </div>

                                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-accent/50 cursor-pointer">
                                    <RadioGroupItem value="cod" id="cod" />
                                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                                        <p className="font-medium">Cash on Delivery</p>
                                    </Label>
                                </div>
                            </RadioGroup>

                            {formData.paymentMethod === "card" && (
                                <div className="mt-6 space-y-4">
                                    <Input placeholder="Card Number" />
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input placeholder="Expiry Date" />
                                        <Input placeholder="CVV" />
                                    </div>
                                    <Input placeholder="Cardholder Name" />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex gap-4 mt-8">
                        {currentStep > 1 && (
                            <Button
                                variant="outline"
                                onClick={handleBack}
                                className="flex items-center gap-2"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        )}
                        <Button
                            onClick={currentStep === 3 ? handleSubmit : handleContinue}
                            disabled={submitting}
                            className="bg-black text-white px-8 py-2 rounded-full flex-1"
                        >
                            {submitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Processing...
                                </>
                            ) : (
                                currentStep === 3 ? "Place Order" : "Continue"
                            )}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Right Section - Order Summary */}
            <div className="w-full md:w-1/3 bg-[#f3f2ef] p-6 md:p-8">
                <h3 className="text-xl font-semibold mb-4">Order Summary</h3>

                {cart?.items?.map((item, index) => (
                    <Card key={index} className="mb-3">
                        <CardContent className="flex items-center gap-3 p-4">
                            <img
                                src={item.image || "https://via.placeholder.com/60"}
                                alt={item.name}
                                className="w-12 h-12 rounded-md object-cover"
                            />
                            <div className="flex-1 min-w-0">
                                <p className="font-medium truncate">{item.name || item.title}</p>
                                <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                            </div>
                            <p className="font-semibold">₹{(item.price * item.quantity).toFixed(2)}</p>
                        </CardContent>
                    </Card>
                ))}

                <div className="border-t border-gray-300 mt-4 pt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>₹{getSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Delivery:</span>
                        <span>₹{getDeliveryCost().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                        <span>Taxes:</span>
                        <span>₹{getTaxes().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-black text-base pt-2 border-t">
                        <span>Total:</span>
                        <span>₹{getTotal().toFixed(2)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}