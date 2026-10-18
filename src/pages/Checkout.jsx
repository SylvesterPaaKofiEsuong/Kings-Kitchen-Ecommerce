import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShoppingBag } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useCart } from '@/lib/cart-context';
import { createOrderWithItems, DELIVERY_FEE } from '@/lib/store-data';
import CheckoutBar from '@/components/checkout/CheckoutBar';
import StepCustomer from '@/components/checkout/StepCustomer';
import StepFulfilment from '@/components/checkout/StepFulfilment';
import StepReview from '@/components/checkout/StepReview';
import StepPayment from '@/components/checkout/StepPayment';
import EmptyState from '@/components/store/EmptyState';

export default function Checkout() {
  const { user } = useAuth();
  const { items, clearCart } = useCart();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [placing, setPlacing] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  // Form states
  const [customer, setCustomer] = useState({
    name: user?.full_name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });

  const [fulfillmentType, setFulfillmentType] = useState('accra_delivery');
  const [deliveryAddress, setDeliveryAddress] = useState(
    user?.saved_addresses?.[0]?.address || ''
  );
  const [pickupLocation, setPickupLocation] = useState(
    'Osu Pickup Point — Accra Central'
  );
  const [orderNote, setOrderNote] = useState('');

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background py-16">
        <div className="container mx-auto max-w-md px-4">
          <EmptyState
            icon={<ShoppingBag className="h-10 w-10 text-muted-foreground" strokeWidth={1.5} />}
            kicker="Checkout"
            title="Your cart is empty."
            description="Add products to your order before proceeding to checkout."
            action={
              <Link to="/shop" className="btn-primary mt-6">
                Explore Catalog
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  const isDelivery = fulfillmentType === 'accra_delivery';
  const shippingFee = isDelivery ? DELIVERY_FEE : 0;
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const total = subtotal + shippingFee;

  const handlePay = async () => {
    setPlacing(true);
    setPaymentError('');

    try {
      const order = await createOrderWithItems({
        customer: {
          customer_name: customer.name,
          customer_phone: customer.phone,
          customer_email: customer.email,
          fulfillment_type: fulfillmentType,
          delivery_address: isDelivery ? deliveryAddress : '',
          pickup_location: !isDelivery ? pickupLocation : '',
          order_note: orderNote,
        },
        items: items.map((item) => ({
          product_id: item.product_id,
          name: item.name,
          brand: item.brand,
          variation: item.variation || '',
          unit_price: item.unit_price,
          quantity: item.quantity,
          image: item.image,
        })),
        shipping_fee: shippingFee,
        processing_fee: 0,
        created_by_id: user?.id,
      });

      clearCart();
      navigate(`/order-confirmation/${order.id}`);
    } catch (err) {
      setPaymentError(err?.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Checkout Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
          <Link to="/" className="font-display text-xl font-semibold tracking-[0.06em]">
            KING&apos;S KITCHEN
          </Link>
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            <ShieldCheck className="h-4 w-4 text-[#2D4B73]" strokeWidth={1.5} />
            <span>Secure Checkout</span>
          </div>
        </div>
      </header>

      {/* Main Flow Container */}
      <main className="container mx-auto max-w-3xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <CheckoutBar currentStep={currentStep} />
        </div>

        <div className="border border-border bg-card p-6 md:p-10 shadow-sm">
          <AnimatePresence mode="wait">
            {currentStep === 0 && (
              <motion.div
                key="step-0"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StepCustomer
                  customer={customer}
                  onChange={setCustomer}
                  onNext={() => setCurrentStep(1)}
                />
              </motion.div>
            )}

            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StepFulfilment
                  fulfillmentType={fulfillmentType}
                  deliveryAddress={deliveryAddress}
                  pickupLocation={pickupLocation}
                  orderNote={orderNote}
                  savedAddresses={user?.saved_addresses || []}
                  onChange={(updates) => {
                    if (updates.fulfillmentType !== undefined) setFulfillmentType(updates.fulfillmentType);
                    if (updates.deliveryAddress !== undefined) setDeliveryAddress(updates.deliveryAddress);
                    if (updates.pickupLocation !== undefined) setPickupLocation(updates.pickupLocation);
                    if (updates.orderNote !== undefined) setOrderNote(updates.orderNote);
                  }}
                  onNext={() => setCurrentStep(2)}
                  onBack={() => setCurrentStep(0)}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StepReview
                  items={items}
                  customer={customer}
                  fulfillmentType={fulfillmentType}
                  deliveryAddress={deliveryAddress}
                  pickupLocation={pickupLocation}
                  orderNote={orderNote}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                  onEditStep={(step) => setCurrentStep(step)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                <StepPayment
                  total={total}
                  onPay={handlePay}
                  placing={placing}
                  error={paymentError}
                  onBack={() => setCurrentStep(2)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
