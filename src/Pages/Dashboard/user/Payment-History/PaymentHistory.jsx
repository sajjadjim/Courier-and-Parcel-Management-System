import React, { useContext, useState } from 'react';
import { AuthContext } from '../../../../Context/AuthContext';
import UseAxiosSecure from '../../../../Hooks/UseAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import { 
    FaFileInvoiceDollar, 
    FaCalendarAlt, 
    FaCreditCard, 
    FaCopy, 
    FaBox,
    FaSearchDollar 
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';

const PaymentHistory = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = UseAxiosSecure();

    const { data: paymentsAll = [], isLoading } = useQuery({
        queryKey: ['/payments', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    });

    // Calculate Totals
    const totalSpent = paymentsAll.reduce((sum, pay) => sum + parseFloat(pay.amount || 0), 0);

    // Copy to Clipboard Function
    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Transaction ID Copied!", { autoClose: 1000, position: "top-center", hideProgressBar: true });
    };

    if (isLoading) return (
        <div className="flex justify-center items-center h-64">
            <span className="loading loading-dots loading-lg text-blue-600"></span>
        </div>
    );

    return (
        <div className="w-full max-w-7xl mx-auto p-4 md:p-8 font-sans text-slate-800">
            <ToastContainer />

            {/* Header & Summary Section */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-800 flex items-center gap-3">
                        <FaFileInvoiceDollar className="text-blue-600" /> Payment History
                    </h2>
                    <p className="text-slate-500 mt-2 text-sm">Track all your past transactions and invoices.</p>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-5 rounded-2xl shadow-lg shadow-blue-200 min-w-[280px]">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-blue-100 text-sm font-medium">Total Spend</span>
                        <FaCreditCard className="opacity-50" />
                    </div>
                    <div className="text-3xl font-bold">
                        ${totalSpent.toFixed(2)}
                    </div>
                    <div className="text-xs text-blue-200 mt-1">
                        Across {paymentsAll.length} transactions
                    </div>
                </div>
            </div>

            {/* DESKTOP VIEW: Professional Data Table */}
            <div className="hidden md:block bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase text-gray-500 font-semibold tracking-wider">
                            <th className="p-5">Transaction ID</th>
                            <th className="p-5">Parcel Info</th>
                            <th className="p-5">Date & Time</th>
                            <th className="p-5">Method</th>
                            <th className="p-5 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {paymentsAll.map((pay) => (
                            <tr key={pay._id} className="hover:bg-blue-50/50 transition-colors group">
                                <td className="p-5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-sm text-slate-600 bg-gray-100 px-2 py-1 rounded">
                                            {pay.transactionId.slice(0, 14)}...
                                        </span>
                                        <button 
                                            onClick={() => handleCopy(pay.transactionId)}
                                            className="text-gray-400 hover:text-blue-600 transition-colors tooltip tooltip-right"
                                            data-tip="Copy ID"
                                        >
                                            <FaCopy size={14} />
                                        </button>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{pay.parcelName || "Unknown Parcel"}</p>
                                        <p className="text-xs text-gray-400">ID: {pay.parcelId?.slice(-6).toUpperCase()}</p>
                                    </div>
                                </td>
                                <td className="p-5">
                                    <div className="text-sm text-slate-600 flex items-center gap-2">
                                        <FaCalendarAlt className="text-gray-300" />
                                        {new Date(pay.paid_at).toLocaleDateString(undefined, {
                                            year: 'numeric', month: 'short', day: 'numeric'
                                        })}
                                    </div>
                                    <div className="text-xs text-gray-400 pl-6">
                                        {new Date(pay.paid_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </td>
                                <td className="p-5">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
                                        {pay.paymentMethod || "Card"}
                                    </span>
                                </td>
                                <td className="p-5 text-right">
                                    <span className="text-slate-800 font-bold text-base">
                                        ${parseFloat(pay.amount).toFixed(2)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MOBILE VIEW: Card Layout */}
            <div className="md:hidden grid gap-4">
                {paymentsAll.map((pay) => (
                    <div key={pay._id} className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm relative">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                    <FaBox />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-800">{pay.parcelName}</h3>
                                    <p className="text-xs text-gray-500">{new Date(pay.paid_at).toLocaleString()}</p>
                                </div>
                            </div>
                            <span className="font-bold text-lg text-slate-800">${pay.amount}</span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                            <div className="flex justify-between items-center">
                                <span>TxID:</span>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono text-xs">{pay.transactionId.slice(0, 10)}...</span>
                                    <FaCopy onClick={() => handleCopy(pay.transactionId)} className="cursor-pointer text-gray-400" />
                                </div>
                            </div>
                            <div className="flex justify-between">
                                <span>Method:</span>
                                <span className="capitalize font-medium text-indigo-600">{pay.paymentMethod}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {paymentsAll.length === 0 && (
                <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300 mt-6">
                    <div className="bg-white p-4 rounded-full inline-block shadow-sm mb-4">
                        <FaSearchDollar className="text-4xl text-gray-300" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900">No Payment History</h3>
                    <p className="text-gray-500 mt-1 text-sm">You haven't made any payments yet.</p>
                </div>
            )}
        </div>
    );
};

export default PaymentHistory;