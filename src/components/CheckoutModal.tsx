import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Truck, ArrowRight, ShieldCheck, MapPin, Phone, User, Home, Loader2, Sparkles } from 'lucide-react';
import { CartItem, CustomerDetails, Order } from '../types';
import { api } from '../services/api';
import { lookupPincode, PincodeInfo } from '../services/pincode';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onOrderSuccess
}) => {
  if (!isOpen) return null;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null);

  // Indian Customer Form
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: '',
    phone: '',
    alternatePhone: '',
    address: '',
    landmark: '',
    pinCode: '',
    city: '',
    district: '',
    postOffice: '',
    state: 'Maharashtra'
  });

  // PIN auto-fetch state
  const [isFetchingPincode, setIsFetchingPincode] = useState(false);
  const [pincodeSuccessMsg, setPincodeSuccessMsg] = useState<string | null>(null);
  const [availablePostOffices, setAvailablePostOffices] = useState<string[]>([]);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const rawSubtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi NCR', 'Jammu & Kashmir',
    'Ladakh', 'Chandigarh', 'Puducherry', 'Dadra and Nagar Haveli and Daman and Diu',
    'Andaman and Nicobar Islands', 'Lakshadweep'
  ];

  // Auto-fetch post office, district, city, and state when 6-digit PIN code is typed via India Post API
  const handlePinCodeChange = async (newPin: string) => {
    const cleaned = newPin.replace(/\D/g, '').slice(0, 6);
    setCustomer(prev => ({ ...prev, pinCode: cleaned }));

    if (cleaned.length === 6) {
      setIsFetchingPincode(true);
      setPincodeSuccessMsg(null);

      try {
        const info = await lookupPincode(cleaned);
        if (info && info.isValid) {
          // Find matching state in official states list
          const matchedState = indianStates.find(
            s => s.toLowerCase() === info.state.toLowerCase() ||
                 s.toLowerCase().includes(info.state.toLowerCase()) ||
                 info.state.toLowerCase().includes(s.toLowerCase())
          ) || info.state;

          const defaultPostOffice = info.postOffices.length > 0 ? info.postOffices[0] : '';
          const resolvedCity = info.city || defaultPostOffice || info.district || 'City';
          const resolvedDistrict = info.district || resolvedCity;

          setCustomer(prev => ({
            ...prev,
            pinCode: cleaned,
            city: resolvedCity,
            district: resolvedDistrict,
            state: matchedState || prev.state,
            postOffice: defaultPostOffice
          }));

          setAvailablePostOffices(info.postOffices);
          setPincodeSuccessMsg(`⚡ Auto-filled via ${info.source}: ${resolvedCity}, ${resolvedDistrict} (${matchedState})`);
        } else {
          setPincodeSuccessMsg(null);
        }
      } catch (err) {
        console.error('Failed to lookup PIN code via India Post API:', err);
      } finally {
        setIsFetchingPincode(false);
      }
    } else {
      setPincodeSuccessMsg(null);
      setAvailablePostOffices([]);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!customer.name.trim()) errs.name = 'Please enter your full name';
    if (!customer.phone.trim() || customer.phone.length < 10) {
      errs.phone = 'Enter valid 10-digit mobile number for delivery boy';
    }
    if (!customer.address.trim()) errs.address = 'Enter house number, building & street';
    if (!customer.pinCode.trim() || customer.pinCode.length < 6) {
      errs.pinCode = 'Enter 6-digit PIN code';
    }
    if (!customer.city.trim()) errs.city = 'Enter your city / town';
    if (!customer.district?.trim()) errs.district = 'Enter your district';
    if (!customer.landmark.trim()) errs.landmark = 'Enter landmark (e.g. Near Shiv Mandir, Opp. SBI Bank)';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePlaceCodOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const orderPayload = {
        customer: {
          ...customer,
          city: customer.city || customer.district || 'Metro'
        },
        items: cartItems.map(it => ({
          productId: it.product.id,
          title: it.product.title,
          variant: it.selectedVariants
            ? Object.entries(it.selectedVariants).map(([k, v]) => `${k}: ${v}`).join(', ')
            : 'Standard',
          quantity: it.quantity,
          unitPrice: it.product.price,
          supplierCost: it.product.supplierCost,
          supplierPlatform: it.product.supplierPlatform,
          image: it.product.images[0]
        }))
      };

      const order = await api.createOrder(orderPayload);
      setCreatedOrder(order);
      onOrderSuccess(order);
    } catch (err) {
      console.error('Order error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/65 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-[#6D28D9] to-[#5b21b6] text-white flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-purple-200 font-bold uppercase tracking-wider">
              <Truck className="w-4 h-4 text-emerald-300" />
              <span>100% Cash on Delivery (COD)</span>
            </div>
            <h2 className="text-lg sm:text-xl font-black mt-0.5">
              {createdOrder ? 'Order Confirmed!' : 'Enter Doorstep Delivery Address'}
            </h2>
          </div>
          
          <button
            onClick={onClose}
            aria-label="Close checkout"
            className="p-1.5 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7">
          
          {!createdOrder ? (
            <form onSubmit={handlePlaceCodOrder} className="space-y-4">
              
              {/* Trust Badge Bar */}
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
                <span className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Pay ₹{rawSubtotal} Cash at Delivery
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-white px-2 py-0.5 rounded shadow-xs">
                  ₹0 Advance Required
                </span>
              </div>

              {/* Items Summary Glance */}
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Ordering ({cartItems.length} items):
                </div>
                <div className="space-y-1.5">
                  {cartItems.map((it, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <div className="truncate max-w-[280px] font-medium text-slate-800">
                        {it.quantity}x {it.product.title}
                        {it.selectedVariants && Object.keys(it.selectedVariants).length > 0 && (
                          <span className="text-slate-500 text-[11px] ml-1">
                            ({Object.values(it.selectedVariants).join(', ')})
                          </span>
                        )}
                      </div>
                      <span className="font-bold text-slate-900">₹{it.product.price * it.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address Form Inputs */}
              <div className="space-y-3 text-xs">
                
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#6D28D9]" />
                    <span>Your Full Name *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Rahul Sharma"
                    value={customer.name}
                    onChange={e => setCustomer({ ...customer, name: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                  {formErrors.name && <p className="text-[11px] text-rose-600">{formErrors.name}</p>}
                </div>

                {/* Mobile Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#6D28D9]" />
                      <span>WhatsApp / Mobile Number *</span>
                    </label>
                    <div className="flex">
                      <span className="px-2.5 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg font-bold text-slate-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit mobile"
                        value={customer.phone}
                        onChange={e => setCustomer({ ...customer, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-r-lg focus:outline-none focus:border-[#6D28D9] font-mono"
                      />
                    </div>
                    {formErrors.phone && <p className="text-[11px] text-rose-600">{formErrors.phone}</p>}
                  </div>

                  {/* Alternate Phone Number */}
                  <div className="space-y-1">
                    <label className="font-bold text-slate-700 flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Alternate Mobile (Optional)</span>
                    </label>
                    <div className="flex">
                      <span className="px-2.5 py-2 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg font-bold text-slate-600">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="Backup number for courier"
                        value={customer.alternatePhone}
                        onChange={e => setCustomer({ ...customer, alternatePhone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-r-lg focus:outline-none focus:border-[#6D28D9] font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* PIN Code with Instant Auto-Fetch of Post Office, District & State */}
                <div className="p-3 bg-violet-50/60 rounded-xl border border-violet-100 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-800 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6D28D9]" />
                          <span>6-Digit PIN Code *</span>
                        </label>
                        {isFetchingPincode && (
                          <span className="flex items-center gap-1 text-[11px] text-[#6D28D9] font-semibold">
                            <Loader2 className="w-3 h-3 animate-spin" /> Detecting area...
                          </span>
                        )}
                      </div>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="e.g. 400069 or 110001"
                        value={customer.pinCode}
                        onChange={e => handlePinCodeChange(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-mono font-bold text-sm tracking-widest"
                      />
                      {formErrors.pinCode && <p className="text-[11px] text-rose-600">{formErrors.pinCode}</p>}
                    </div>

                    {/* Auto-detected post office / locality */}
                    <div className="space-y-1">
                      <label className="font-bold text-slate-700 flex items-center gap-1">
                        <span>Post Office / Delivery Locality</span>
                      </label>
                      {availablePostOffices.length > 0 ? (
                        <select
                          value={customer.postOffice}
                          onChange={e => setCustomer({ ...customer, postOffice: e.target.value })}
                          className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-semibold text-slate-800"
                        >
                          {availablePostOffices.map(po => (
                            <option key={po} value={po}>{po}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          placeholder="Auto-detected upon PIN entry"
                          value={customer.postOffice || ''}
                          onChange={e => setCustomer({ ...customer, postOffice: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                        />
                      )}
                    </div>
                  </div>

                  {/* Feedback on auto-fetch */}
                  {pincodeSuccessMsg && (
                    <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{pincodeSuccessMsg}</span>
                    </div>
                  )}
                </div>

                {/* City, District & State Auto-Populated Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* City / Town */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-xs">City / Town *</label>
                      {customer.city && pincodeSuccessMsg && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Auto-filled
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Bandra / Connaught Place"
                      value={customer.city}
                      onChange={e => setCustomer({ ...customer, city: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] text-sm"
                    />
                    {formErrors.city && <p className="text-[11px] text-rose-600">{formErrors.city}</p>}
                  </div>

                  {/* District */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-xs">District *</label>
                      {customer.district && pincodeSuccessMsg && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Auto-filled
                        </span>
                      )}
                    </div>
                    <input
                      type="text"
                      placeholder="e.g. Mumbai / Central Delhi"
                      value={customer.district || ''}
                      onChange={e => setCustomer({ ...customer, district: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] text-sm"
                    />
                    {formErrors.district && <p className="text-[11px] text-rose-600">{formErrors.district}</p>}
                  </div>

                  {/* State */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-slate-700 text-xs">State *</label>
                      {customer.state && pincodeSuccessMsg && (
                        <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                          Auto-filled
                        </span>
                      )}
                    </div>
                    <select
                      value={customer.state}
                      onChange={e => setCustomer({ ...customer, state: e.target.value })}
                      className="w-full px-2.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9] font-medium text-sm"
                    >
                      {indianStates.map(st => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* House No / Street Address */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <Home className="w-3.5 h-3.5 text-[#6D28D9]" />
                    <span>House No, Building, Street / Colony *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Flat 302, Sai Vihar, MG Road"
                    value={customer.address}
                    onChange={e => setCustomer({ ...customer, address: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                  {formErrors.address && <p className="text-[11px] text-rose-600">{formErrors.address}</p>}
                </div>

                {/* Landmark */}
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Famous Landmark (Near Temple, School, Bank, etc.) *</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Near Shiv Mandir / Opp. State Bank of India"
                    value={customer.landmark}
                    onChange={e => setCustomer({ ...customer, landmark: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#6D28D9]"
                  />
                  {formErrors.landmark && <p className="text-[11px] text-rose-600">{formErrors.landmark}</p>}
                </div>

              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#6D28D9] hover:bg-[#5b21b6] text-white font-extrabold text-sm sm:text-base rounded-xl shadow-lg shadow-[#6D28D9]/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <span>Place Cash on Delivery Order (₹{rawSubtotal})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-slate-400">
                🔒 Free doorstep delivery across India. Pay cash only after parcel arrival.
              </div>

            </form>
          ) : (
            /* ORDER SUCCESS SCREEN */
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                  COD Order Confirmed!
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Thank you, <strong className="text-slate-800">{createdOrder.customer.name}</strong>! Your order is placed and will be delivered to your doorstep.
                </p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-left space-y-2 text-xs">
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Order Number:</span>
                  <span className="font-mono font-bold text-slate-900">{createdOrder.orderNumber}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Total Cash to Pay:</span>
                  <span className="font-bold text-emerald-700 text-sm">₹{createdOrder.total}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-2">
                  <span className="text-slate-500 font-medium">Delivery Mobile:</span>
                  <span className="font-mono font-bold text-slate-900">
                    +91 {createdOrder.customer.phone}
                    {createdOrder.customer.alternatePhone && ` (Alt: ${createdOrder.customer.alternatePhone})`}
                  </span>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 font-medium">Delivery Address:</span>
                  <div className="text-slate-800 font-semibold mt-0.5 leading-relaxed">
                    {createdOrder.customer.address}, {createdOrder.customer.landmark}
                    {createdOrder.customer.postOffice ? `, ${createdOrder.customer.postOffice}` : ''}, {createdOrder.customer.city}, {createdOrder.customer.state} - {createdOrder.customer.pinCode}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="w-full py-3 bg-[#6D28D9] hover:bg-[#5b21b6] text-white font-bold text-xs sm:text-sm rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
