import React, { useState, useContext } from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { useQuery } from '@tanstack/react-query';
import { useParams, useNavigate } from 'react-router'; 
import Swal from 'sweetalert2';

import UseAxiosSecure from '../../../Hooks/UseAxiosSecure';
import { AuthContext } from '../../../Context/AuthContext';
import useTrackingLogger from '../../../Hooks/useTrackingLogger';

const PaymentForm = () => {
    const { user } = useContext(AuthContext);
    const { logTracking } = useTrackingLogger();
    const navigate = useNavigate();
    const axiosSecure = UseAxiosSecure();

    const stripe = useStripe();
    const elements = useElements();

    const { parcelId } = useParams();
    const [error, setError] = useState(""); 
    const [processing, setProcessing] = useState(false); 

    // 1. Fetch Parcel Data
    const { data: parcelPaymentInfo, isLoading } = useQuery({
        queryKey: ['parcel', parcelId],
        queryFn: async () => {
            const res = await axiosSecure.get(`/parcels/${parcelId}`);
            return res.data;
        }
    });

    // Safely get amount
    const rawAmount = parcelPaymentInfo?.deliveryCharge?.amount;
    const amount = rawAmount ? parseFloat(rawAmount) : 0; // Ensure it's a number

    // 2. Handle Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 🛑 CRITICAL SAFETY CHECK
        if (!stripe || !elements) return;
        
        if (!amount || amount <= 0) {
            setError("Invalid payment amount. Cannot process 0 or empty fee.");
            return;
        }

        const card = elements.getElement(CardElement);
        if (!card) return;

        setProcessing(true); 
        setError('');

        // 🛑 DEBUG: Check exactly what we are sending
        console.log("🚀 Sending Payment Request. Price:", amount, "Type:", typeof amount);

        // Step A: Create Payment Method (Stripe)
        const { error: paymentMethodError } = await stripe.createPaymentMethod({
            type: 'card',
            card,
        });

        if (paymentMethodError) {
            setError(paymentMethodError.message);
            setProcessing(false);
            return;
        }

        try {
            // Step B: Get Client Secret from Backend
            // ✅ FIX: Ensure price is a clean number
            const res = await axiosSecure.post('/payments/create-payment-intent', {
                price: Number(amount) 
            });

            console.log("✅ Client Secret Received");
            const clientSecret = res.data.clientSecret;

            // Step C: Confirm Payment
            const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: user?.displayName || 'Anonymous',
                        email: user?.email || 'unknown@example.com'
                    },
                },
            });

            if (confirmError) {
                setError(confirmError.message);
                setProcessing(false);
            } else {
                if (paymentIntent.status === 'succeeded') {
                    console.log('✅ Payment Succeeded:', paymentIntent.id);

                    // Step D: Save Info to Database
                    const paymentData = {
                        parcelId,
                        parcelName: parcelPaymentInfo?.parcelName,
                        email: user.email,
                        amount: amount,
                        transactionId: paymentIntent.id,
                        date: new Date(), 
                        status: 'success',
                        paymentMethod: 'card',
                    };

                    const paymentRes = await axiosSecure.post('/payments', paymentData);

                    if (paymentRes.data.insertedId || paymentRes.data.paymentResult?.insertedId) {
                        
                        // Update Status
                        await axiosSecure.patch(`/parcels/${parcelId}/payment-status`, { 
                             payment_status: 'paid' 
                        });

                        // Log Tracking
                        await logTracking({
                            trackingId: parcelPaymentInfo.trackingId,
                            status: "paid", 
                            details: `Payment successful. ID: ${paymentIntent.id}`,
                            updated_by: user.email,
                        });

                        Swal.fire({
                            icon: 'success',
                            title: 'Payment Successful!',
                            text: `Transaction ID: ${paymentIntent.id}`,
                            showConfirmButton: false, 
                            timer: 2000 
                        });

                        setTimeout(() => {
                            navigate('/dashboard/myParcels');
                        }, 2000);
                    }
                }
            }
        } catch (err) {
            console.error("❌ Payment Error:", err.response?.data || err.message);
            setError(err.response?.data?.error || "An error occurred during payment.");
            setProcessing(false);
        }
    };

    if (isLoading || !parcelPaymentInfo) {
        return (
            <div className="flex justify-center items-center h-screen">
                <span className="loading loading-spinner loading-lg text-blue-600"></span>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto p-6 mt-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6 bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                
                <div className="text-center mb-2">
                    <h2 className="text-2xl font-extrabold text-slate-800">Secure Payment</h2>
                    <p className="text-sm text-gray-500 mt-1">Complete your transaction securely</p>
                </div>

                <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                    <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Total Amount</p>
                    <p className="text-3xl font-extrabold text-slate-800 mt-1">৳{amount}</p>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 ml-1">Card Details</label>
                    <div className="rounded-xl border border-gray-300 bg-gray-50 px-4 py-3.5 transition-all focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 focus-within:bg-white">
                        <CardElement
                            options={{
                                style: {
                                    base: {
                                        fontSize: "16px",
                                        color: "#1e293b",
                                        "::placeholder": { color: "#94a3b8" },
                                        fontFamily: "inherit",
                                    },
                                    invalid: { color: "#ef4444" }
                                },
                                hidePostalCode: true,
                            }}
                            onChange={e => setError(e.error ? e.error.message : "")}
                        />
                    </div>
                    {error && <p className="text-red-500 text-xs font-semibold ml-1">{error}</p>}
                </div>

                <button
                    type='submit'
                    disabled={!stripe || !amount || processing}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex justify-center items-center gap-2
                        ${!stripe || processing || !amount
                            ? "bg-gray-400 cursor-not-allowed" 
                            : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-200"
                        }`}
                >
                    {processing ? (
                        <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                        `Pay ৳${amount}`
                    )}
                </button>

                <div className="flex justify-center items-center gap-4 opacity-50 mt-2 grayscale hover:grayscale-0 transition-all">
                    <img src="https://img.icons8.com/color/48/visa.png" alt="Visa" className="h-6" />
                    <img src="https://img.icons8.com/color/48/mastercard.png" alt="Mastercard" className="h-6" />
                    <img src="https://img.icons8.com/color/48/amex.png" alt="Amex" className="h-6" />
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;