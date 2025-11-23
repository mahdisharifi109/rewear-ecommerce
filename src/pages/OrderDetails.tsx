import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '../features/auth/store';
import { Package, CheckCircle, Truck, CreditCard, Star } from 'lucide-react';

const API_URL = 'http://localhost:3001';

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [showReviewModal, setShowReviewModal] = useState(false);

  // Fetch Order
  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch order');
      return res.json();
    },
    enabled: !!id && !!token,
  });

  // Ship Mutation
  const shipMutation = useMutation({
    mutationFn: async (trackingCode: string) => {
      const res = await fetch(`${API_URL}/api/orders/${id}/ship`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ trackingCode }),
      });
      if (!res.ok) throw new Error('Failed to ship order');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order', id] }),
  });

  // Complete Mutation
  const completeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${API_URL}/api/orders/${id}/complete`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to complete order');
      return res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['order', id] }),
  });

  // Review Mutation
  const reviewMutation = useMutation({
    mutationFn: async (data: { rating: number; comment: string }) => {
      const res = await fetch(`${API_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ orderId: id, ...data }),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return res.json();
    },
    onSuccess: () => {
      setShowReviewModal(false);
      alert('Review submitted!');
    },
  });

  const { register: registerShip, handleSubmit: handleSubmitShip } = useForm<{ trackingCode: string }>();
  const { register: registerReview, handleSubmit: handleSubmitReview } = useForm<{ rating: number; comment: string }>();

  if (isLoading) return <div className="p-8 text-center">Loading order details...</div>;
  if (!order) return <div className="p-8 text-center">Order not found</div>;

  const isSeller = user?.id === order.seller_id;
  const isBuyer = user?.id === order.buyer_id;

  const steps = [
    { status: 'pending', label: 'Pending', icon: CreditCard },
    { status: 'paid', label: 'Paid', icon: CheckCircle },
    { status: 'shipped', label: 'Shipped', icon: Truck },
    { status: 'completed', label: 'Completed', icon: Star },
  ];

  const currentStepIndex = steps.findIndex((s) => s.status === order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Order #{order.id.slice(0, 8)}</h1>

      {/* Timeline */}
      <div className="mb-8">
        <div className="flex justify-between items-center relative">
          <div className="absolute left-0 top-1/2 w-full h-1 bg-gray-200 -z-10" />
          <div 
            className="absolute left-0 top-1/2 h-1 bg-green-500 -z-10 transition-all duration-500"
            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
          />
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index <= currentStepIndex;
            return (
              <div key={step.status} className="flex flex-col items-center bg-white px-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${isActive ? 'border-green-500 bg-green-50 text-green-600' : 'border-gray-300 text-gray-400'}`}>
                  <Icon size={20} />
                </div>
                <span className={`text-xs mt-2 font-medium ${isActive ? 'text-green-600' : 'text-gray-500'}`}>{step.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Order Info */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">Item Details</h2>
            <div className="flex gap-4">
              <img src={order.product_images?.[0] || 'https://via.placeholder.com/100'} alt={order.product_name} className="w-24 h-24 object-cover rounded-md" />
              <div>
                <h3 className="font-medium text-lg">{order.product_name}</h3>
                <p className="text-gray-500">Sold by {order.seller_name}</p>
                <p className="font-bold mt-2">€{order.total_amount}</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">Actions</h2>
            
            {isSeller && order.status === 'paid' && (
              <form onSubmit={handleSubmitShip((data) => shipMutation.mutate(data.trackingCode))} className="space-y-4">
                <p className="text-sm text-gray-600">Please provide a tracking code to mark as shipped.</p>
                <input 
                  {...registerShip('trackingCode', { required: true })}
                  placeholder="Tracking Code (e.g., CTT123456)"
                  className="w-full p-2 border rounded-md"
                />
                <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700">
                  Mark as Shipped
                </button>
              </form>
            )}

            {isBuyer && order.status === 'shipped' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-600">Tracking Code: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{order.tracking_code}</span></p>
                <p className="text-sm text-gray-600">Only click this after you have received and inspected the item.</p>
                <button 
                  onClick={() => completeMutation.mutate()}
                  className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700"
                >
                  Confirm Receipt & Release Funds
                </button>
              </div>
            )}

            {isBuyer && order.status === 'completed' && (
              <button 
                onClick={() => setShowReviewModal(true)}
                className="w-full border border-yellow-500 text-yellow-600 py-2 rounded-md hover:bg-yellow-50"
              >
                Leave a Review
              </button>
            )}

            {['pending', 'cancelled'].includes(order.status) && (
              <p className="text-gray-500 italic">No actions available for this status.</p>
            )}
             {isSeller && order.status === 'shipped' && (
              <p className="text-gray-500 italic">Waiting for buyer to confirm receipt.</p>
            )}
             {isSeller && order.status === 'completed' && (
              <p className="text-green-600 font-medium">Funds have been released to your wallet!</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">Shipping Address</h2>
            <p className="text-gray-600 text-sm">
              {order.buyer_name}<br />
              123 Main St (Mock Address)<br />
              Lisbon, 1000-001<br />
              Portugal
            </p>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Rate your experience</h3>
            <form onSubmit={handleSubmitReview((data) => reviewMutation.mutate(data))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating (1-5)</label>
                <select {...registerReview('rating', { required: true, valueAsNumber: true })} className="w-full p-2 border rounded-md">
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Average</option>
                  <option value="2">2 - Poor</option>
                  <option value="1">1 - Terrible</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Comment</label>
                <textarea 
                  {...registerReview('comment')}
                  rows={4}
                  className="w-full p-2 border rounded-md"
                  placeholder="How was the item?"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Submit Review</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
