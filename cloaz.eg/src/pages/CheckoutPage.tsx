import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { Info, ShoppingBag, ChevronRight, ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { ref, push, set } from "firebase/database";
import { db, rtdb } from "../lib/firebase";
import { useTheme } from "../context/ThemeContext";

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function CheckoutPage() {
  const { theme } = useTheme();
  const { cartItems, total, subtotal, totalDiscount, clearCart } = useCart();
  const navigate = useNavigate();
  
  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [walletInfo, setWalletInfo] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online');
  
  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!firstName || !lastName || !address || !phone) {
      setError("يرجى إكمال جميع البيانات المطلوبة");
      return;
    }

    if (cartItems.length === 0) {
      setError("سلة مشترياتك فارغة");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const orderData = {
      customerName: `${firstName} ${lastName}`,
      address,
      phoneNumber: phone,
      walletInfo: paymentMethod === 'online' ? walletInfo : 'COD',
      paymentMethod: paymentMethod === 'online' ? 'Vodafone Cash / InstaPay' : 'Cash',
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        size: item.size,
        color: item.color || "None",
        price: item.price
      })),
      totalPrice: total,
      createdAt: new Date().toISOString(), // Standard ISO string for RTDB
      status: 'pending'
    };

    try {
      // 1. Save to Firebase Realtime Database (Requested)
      const ordersRef = ref(rtdb, 'orders');
      const newOrderRef = push(ordersRef);
      await set(newOrderRef, orderData);

      // 2. Send Telegram Notification (Requested)
      const telegramToken = "8699999343:AAG5cifGGiZ7MFjKFj8A7A3mdDe5y9ok4mc";
      const chatId = "1283788352";
      
      const itemsList = cartItems.map(item => {
        const itemTotal = item.price * item.quantity;
        const itemOriginalTotal = (item.oldPrice || item.price) * item.quantity;
        const hasDiscount = item.oldPrice && item.oldPrice > item.price;
        return `• <b>${item.name}</b> (x${item.quantity}) - Size: ${item.size}${item.color ? ` - Color: ${item.color}` : ''} - <b>LE ${itemTotal}</b>${hasDiscount ? ` <s>(LE ${itemOriginalTotal})</s>` : ''}`;
      }).join('\n');

      const telegramMessage = `
🛍 <b>طلب جديد من CLOAZ!</b>
--------------------------
👤 <b>الاسم:</b> ${firstName} ${lastName}
📱 <b>الهاتف:</b> ${phone}
📍 <b>العنوان:</b> ${address}
💳 <b>الدفع:</b> ${orderData.paymentMethod}
💸 <b>بيانات التحويل:</b> ${orderData.walletInfo}

📦 <b>المنتجات:</b>
${itemsList}

💰 <b>المجموع الفرعي:</b> LE ${subtotal}.00
🏷 <b>OUR SALE:</b> - LE ${totalDiscount}.00
💵 <b>الإجمالي النهائي:</b> LE ${total}.00
--------------------------
      `;

      try {
        await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: telegramMessage,
            parse_mode: 'HTML'
          })
        });
      } catch (tgErr) {
        console.error("Telegram notification failed:", tgErr);
        // We don't block the UI if telegram fails but RTDB succeeded
      }
      
      // 3. (Removed Firestore backup as it causes unavailable errors if not enabled)

      // Show Success
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, "orders");
      setError("حدث خطأ أثناء تأكيد الطلب، يرجى المحاولة مرة أخرى");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className={`min-h-screen flex items-center justify-center p-6 transition-colors duration-500`} dir="rtl">
        <div className="max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in duration-500 bg-background-white/80 p-8 rounded-3xl backdrop-blur-sm border border-black/5 dark:border-white/5 shadow-2xl">
           <div className="flex justify-center">
              <div className={`w-24 h-24 rounded-full flex items-center justify-center ${theme === 'dark' ? 'bg-green-500/10 text-green-400' : 'bg-green-50 text-green-500'}`}>
                <CheckCircle2 size={64} strokeWidth={1.5} />
              </div>
           </div>
           
           <div className="space-y-3">
              <h1 className="text-3xl font-black text-[var(--text-dark-blue)] tracking-tighter">تم استلام طلبك بنجاح!</h1>
              <p className="text-gray-500 font-bold leading-relaxed">
                شكراً لثقتك بنا. سيقوم فريقنا بمراجعة طلبك والتواصل معك عبر واتساب لتأكيد الشحن في أقرب وقت.
              </p>
           </div>

           <div className="pt-4 space-y-4">
              <Link 
                to="/" 
                className="block w-full bg-[#0069A8] text-white py-5 rounded-[20px] font-black text-lg uppercase tracking-widest hover:bg-[#00558a] transition-all shadow-xl shadow-[#0069A8]/20"
              >
                العودة للرئيسية
              </Link>
              <button 
                onClick={() => navigate('/store')}
                className="block w-full text-[#0069A8] font-black text-sm uppercase tracking-widest hover:opacity-70 transition-all"
              >
                تصفح المزيد من المنتجات
              </button>
           </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans selection:bg-[#0069A8]/10 selection:text-[#0069A8] transition-colors duration-500 ${theme === 'dark' ? 'text-white/90' : 'text-[#1a1a1a]'}`} dir="rtl">
      <div className="max-w-[1250px] mx-auto flex flex-col lg:flex-row min-h-screen">
        
        {/* Main Content Area */}
        <div className={`flex-1 p-6 sm:p-10 lg:p-16 lg:border-l transition-colors duration-500 bg-background-white/80 backdrop-blur-sm ${theme === 'dark' ? 'border-white/10' : 'border-gray-100'}`}>
          <header className="mb-10 lg:mb-16 flex justify-between items-center bg-transparent backdrop-blur-sm sticky top-0 z-50 py-2 sm:py-0">
             <Link to="/" className="inline-block group transition-transform active:scale-95">
               <img src="/assets/images/icons/CLOAZ.svg" alt="CLOAZ Logo" className={`h-7 md:h-10 w-auto brightness-0 transition-all duration-500 ${theme === 'dark' ? 'invert' : ''}`} referrerPolicy="no-referrer" />
             </Link>
             <button 
               onClick={() => navigate(-1)}
               className={`flex items-center gap-2 font-black text-[11px] sm:text-xs uppercase tracking-widest hover:opacity-70 transition-all border px-3 py-1.5 rounded-full ${theme === 'dark' ? 'text-[#0069A8] border-[#0069A8]/20' : 'text-[#0069A8] border-[#0069A8]/20'}`}
             >
               <span>رجوع للمتجر</span>
               <ArrowLeft size={14} className="rotate-180" />
             </button>
          </header>

          <form onSubmit={handleSubmit} className="max-w-[580px] mx-auto lg:mr-0 lg:ml-auto">
            <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-dark-blue)] mb-10 tracking-tighter transition-colors">إتمام الشراء</h1>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-100 text-red-500 rounded-xl text-xs font-bold uppercase tracking-wide flex items-center gap-3">
                <Info size={16} />
                {error}
              </div>
            )}

            {/* Order Summary for Mobile/Tablet - Refined Box */}
            <div className={`lg:hidden mb-12 rounded-2xl p-6 sm:p-8 border transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.03] border-white/10' : 'bg-gray-50 border-gray-100'}`}>
               <div className="flex items-center justify-between mb-8">
                  <div className={`flex items-center gap-3 ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>
                    <ShoppingBag size={20} />
                    <h2 className="text-sm font-black uppercase tracking-widest">ملخص مشترياتك</h2>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded ${theme === 'dark' ? 'bg-[#0069A8]/20 text-[#0069A8]' : 'bg-[#0069A8]/10 text-[#0069A8]'}`}>قيد المراجعة</span>
               </div>
               
               <div className="space-y-5">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.size}-${item.color || 'none'}`} className={`flex items-center gap-4 p-3 rounded-xl border shadow-sm transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.05] border-white/10 text-white' : 'bg-white border-gray-100 shadow-sm'}`}>
                      <div className="relative shrink-0">
                        <div className="w-14 h-14 flex items-center justify-center overflow-hidden">
                           <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <span className={`absolute -top-2 -right-2 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}>
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-[12px] font-black uppercase truncate">{item.name}</h3>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest font-mono">{item.size}</p>
                          {item.color && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300" />
                              <div 
                                className="w-3 h-3 rounded-[2px] border border-gray-200 shadow-sm" 
                                style={{ backgroundColor: item.color }}
                                title={item.color}
                              />
                            </>
                          )}
                          {item.oldPrice && item.oldPrice > item.price && (
                            <span className="text-[8px] bg-[#0069A8] text-white px-1.5 py-0.5 rounded font-black uppercase tracking-tighter">Sale</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-col items-end whitespace-nowrap">
                        <span className="text-sm font-black">LE {item.price * item.quantity}</span>
                        {item.oldPrice && item.oldPrice > item.price && (
                          <span className="text-[9px] line-through opacity-30 font-bold italic">LE {item.oldPrice * item.quantity}</span>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  <div className={`pt-6 border-t space-y-3 transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-gray-200'}`}>
                    <div className="flex justify-between items-center opacity-60">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[9px]">المجموع الفرعي</span>
                      <span className="text-sm font-black italic">LE {subtotal}.00</span>
                    </div>
                    {totalDiscount > 0 && (
                      <div className="flex justify-between items-center text-[#0069A8]">
                        <span className="text-gray-400 font-black uppercase tracking-widest text-[9px]">OUR SALE</span>
                        <span className="text-sm font-black">- LE {totalDiscount}.00</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">المبلغ الكلي</span>
                      <span className={`text-2xl font-black tracking-tighter ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>LE {total}.00</span>
                    </div>
                  </div>
               </div>
            </div>

            <section className="mb-14">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-[#0069A8] rounded-full flex items-center justify-center text-white font-black">1</div>
                <h2 className="text-xl font-black text-[var(--text-dark-blue)] tracking-tight transition-colors">بيانات العميل</h2>
              </div>
              
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                      <label className={`text-[11px] font-black uppercase tracking-widest pr-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>الاسم الأول</label>
                      <input 
                        type="text" 
                        required
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="مثال: أحمد"
                        className={`w-full border-2 rounded-[12px] p-4.5 outline-none text-sm transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-[#0069A8] placeholder:text-gray-300' : 'bg-white border-gray-300 text-black focus:border-[#0069A8] placeholder:text-gray-400'}`}
                      />
                  </div>
                  <div className="space-y-2">
                      <label className={`text-[11px] font-black uppercase tracking-widest pr-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>اسم العائلة</label>
                      <input 
                        type="text" 
                        required
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="مثال: محمد"
                        className={`w-full border-2 rounded-[12px] p-4.5 outline-none text-sm transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-[#0069A8] placeholder:text-gray-300' : 'bg-white border-gray-300 text-black focus:border-[#0069A8] placeholder:text-gray-400'}`}
                      />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className={`text-[11px] font-black uppercase tracking-widest pr-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>عنوان الشحن (بالتفصيل)</label>
                  <input 
                    type="text" 
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="رقم المنزل، الشارع، المدينة"
                    className={`w-full border-2 rounded-[12px] p-4.5 outline-none text-sm transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-white/5 focus:bg-white/[0.05] focus:border-[#0069A8] placeholder:text-gray-300' : 'bg-white border-gray-300 text-black focus:border-[#0069A8] placeholder:text-gray-400'}`}
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className={`text-[12px] font-black uppercase tracking-widest pr-1 transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>رقم هاتف مفعّل (لاستلام الطلب)</label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="أدخل رقم الهاتف الشخصي"
                    className={`w-full border-2 rounded-[12px] p-5 outline-none text-lg font-black transition-all ${theme === 'dark' ? 'bg-white/[0.03] border-[#0069A8]/20 text-[#0069A8] focus:bg-white/[0.05] focus:border-[#0069A8] placeholder:text-[#0069A8]/30' : 'bg-[#F9F9FB] border-[#0069A8]/20 text-[#0069A8] focus:bg-white focus:border-[#0069A8] placeholder:text-[#0069A8]/30'}`}
                  />
                </div>

                {paymentMethod === 'online' && (
                  <div className="pt-8 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <label className={`text-[13px] font-black uppercase tracking-widest pr-1 flex items-center gap-2 transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`} />
                        رقم المحفظة الإلكترونية أو اسم المحول
                      </label>
                      <input 
                        type="text" 
                        required={paymentMethod === 'online'}
                        value={walletInfo}
                        onChange={(e) => setWalletInfo(e.target.value)}
                        placeholder="أدخل اسمك أو رقمك المستخدم في التحويل"
                        className={`w-full border-[3px] rounded-[15px] p-6 outline-none text-xl font-black transition-all shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-[#010520] border-[#0069A8] text-white placeholder:text-white/10 shadow-[#0069A8]/10' : 'bg-white border-[#0069A8] text-[#010520] placeholder:text-gray-200 shadow-[#0069A8]/10'}`}
                      />
                    </div>
                    <p className="text-[11px] text-gray-400 mt-4 font-bold leading-relaxed pr-2">
                      * نستخدم هذه البيانات لمطابقة عملية التحويل (Vodafone Cash / InstaPay) وتأكيد طلبك بسرعة.
                    </p>
                  </div>
                )}
              </div>
            </section>

            <section className="mb-12">
               <div className="flex items-center gap-3 mb-8">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-black ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`}>2</div>
                  <h2 className="text-xl font-black text-[var(--text-dark-blue)] tracking-tight transition-colors">طريقة الدفع</h2>
               </div>

               <div className="flex flex-col gap-4 mb-8">
                 <button 
                   type="button"
                   onClick={() => setPaymentMethod('online')}
                   className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-right transition-all duration-500 ${paymentMethod === 'online' ? (theme === 'dark' ? 'border-[#0069A8] bg-[#0069A8]/10' : 'border-[#0069A8] bg-[#0069A8]/5') : (theme === 'dark' ? 'border-white/5 bg-white/[0.02] hover:border-white/10' : 'border-gray-100 bg-white hover:border-gray-200')}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'online' ? (theme === 'dark' ? 'border-[#0069A8]' : 'border-[#0069A8]') : 'border-gray-300'}`}>
                       {paymentMethod === 'online' && <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`} />}
                     </div>
                     <div>
                       <p className="font-black text-[var(--text-dark-blue)] text-sm uppercase transition-colors">تحويل بنكي / إنستا باي</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">VODAFONE CASH / INSTAPAY</p>
                     </div>
                   </div>
                 </button>

                 <button 
                   type="button"
                   onClick={() => setPaymentMethod('cod')}
                   className={`flex items-center justify-between p-6 rounded-2xl border-2 transition-all text-right transition-all duration-500 ${paymentMethod === 'cod' ? (theme === 'dark' ? 'border-[#0069A8] bg-[#0069A8]/10' : 'border-[#0069A8] bg-[#0069A8]/5') : (theme === 'dark' ? 'border-white/5 bg-white/[0.02] hover:border-white/10' : 'border-gray-100 bg-white hover:border-gray-200')}`}
                 >
                   <div className="flex items-center gap-4">
                     <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? (theme === 'dark' ? 'border-[#0069A8]' : 'border-[#0069A8]') : 'border-gray-300'}`}>
                       {paymentMethod === 'cod' && <div className={`w-3 h-3 rounded-full ${theme === 'dark' ? 'bg-[#0069A8]' : 'bg-[#0069A8]'}`} />}
                     </div>
                     <div>
                       <p className="font-black text-[var(--text-dark-blue)] text-sm uppercase transition-colors">دفع عند الاستلام</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">CASH ON DELIVERY</p>
                     </div>
                   </div>
                 </button>
               </div>
               
               {paymentMethod === 'online' ? (
                 <div className={`p-8 rounded-[24px] text-white shadow-2xl relative overflow-hidden text-right transition-all duration-500 ${theme === 'dark' ? 'bg-[#0069A8] shadow-[#0069A8]/20' : 'bg-[#0069A8] shadow-[#0069A8]/40'}`}>
                    <div className="absolute top-0 left-0 -translate-y-1/3 -translate-x-1/4 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-0 translate-y-1/2 translate-x-1/4 w-32 h-32 bg-black/10 rounded-full blur-2xl" />
                    
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 font-sans">OFFICIAL PAYMENT GATEWAY</span>
                      </div>
                      
                      <p className="text-sm sm:text-base font-bold leading-relaxed opacity-95 max-w-[400px]">
                        يرجى تحويل مبلغ الطلب <span className="text-2xl sm:text-3xl font-black underline underline-offset-8 decoration-white/40 tracking-tighter">LE {total}.00</span> بالكامل إلى الرقم التالي:
                      </p>

                      <button 
                         type="button"
                         onClick={() => {
                             const num = '01033424667';
                            navigator.clipboard.writeText(num);
                         }}
                         className="w-full bg-white/10 p-5 rounded-2xl flex items-center justify-between group cursor-pointer hover:bg-white/20 transition-all text-left border border-white/20 active:scale-[0.98]" dir="ltr"
                      >
                         <span className="text-3xl sm:text-4xl font-black tracking-tighter">010 3342 4667</span>
                         <span className={`text-[10px] font-black uppercase tracking-widest bg-white px-4 py-2 rounded-xl transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>Copy</span>
                      </button>
                      
                      <div className="grid grid-cols-2 gap-4 pt-4 pr-1">
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-red-400 rounded-full" />
                               <span className="text-[11px] font-black uppercase tracking-widest">فودافون كاش</span>
                            </div>
                            <p className="text-[9px] text-white/50 font-bold uppercase pr-4">Vodafone Cash</p>
                         </div>
                         <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 bg-green-400 rounded-full" />
                               <span className="text-[11px] font-black uppercase tracking-widest">إنستا باي</span>
                            </div>
                            <p className="text-[9px] text-white/50 font-bold uppercase pr-4">InstaPay</p>
                         </div>
                      </div>

                      <div className="space-y-3 bg-black/10 p-5 rounded-2xl border border-white/5 font-bold text-[10px] sm:text-[11px] leading-relaxed backdrop-blur-md">
                         <p className="flex items-start gap-2">• <span>احتفظ بصورة أو تفاصيل التحويل (الاسم والرقم) لتأكيد طلبك.</span></p>
                         <p className="flex items-start gap-2">• <span>سيتم طلب هذه البيانات منك عبر واتساب بعد الضغط على زر إتمام الطلب بالأسفل.</span></p>
                      </div>
                    </div>
                 </div>
               ) : (
                 <div className="p-8 bg-gray-50 rounded-[24px] border border-gray-200 text-right">
                    <div className="flex items-center gap-4 mb-6">
                       <div className="w-12 h-12 bg-[#0069A8]/10 rounded-2xl flex items-center justify-center text-[#0069A8]">
                          <ShoppingBag size={24} />
                       </div>
                       <div>
                          <h3 className="text-lg font-black text-[#010520] tracking-tight">الدفع عند الاستلام</h3>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">CASH ON DELIVERY ENABLED</p>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <p className="text-sm font-bold text-gray-600 leading-relaxed">
                          لقد اخترت الدفع نقدًا عند استلام طلبك. يرجى التأكد من صحة رقم الهاتف المسجل ليتواصل معك المندوب عند وصول الشحنة.
                       </p>
                       <div className="p-4 bg-white rounded-xl border border-gray-100 flex items-center gap-3">
                          <Info size={16} className="text-[#0069A8]" />
                          <p className="text-[11px] font-bold text-[#0069A8] uppercase tracking-wide">قد يتم إضافة رسوم شحن إضافية بسيطة لخدمة الدفع عند الاستلام.</p>
                       </div>
                    </div>
                 </div>
               )}
            </section>

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full text-white py-6 rounded-[20px] font-black text-xl uppercase tracking-widest transition-all active:scale-[0.98] mb-16 flex items-center justify-center gap-4 group disabled:opacity-70 disabled:cursor-not-allowed shadow-md ${theme === 'dark' ? 'bg-[#0069A8] hover:bg-[#00558a] shadow-[#0069A8]/5' : 'bg-[#0069A8] hover:bg-[#00558a] shadow-[#0069A8]/5'}`}
            >
              {isSubmitting ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>تأكيد وإتمام الطلب</span>
                  <ChevronRight className="group-hover:-translate-x-2 transition-transform rotate-180" />
                </>
              )}
            </button>
          </form>
        </div>

               {/* Desktop Sidebar (Sticky) */}
        <div className={`hidden lg:block w-full lg:w-[480px] p-10 sm:p-12 lg:p-16 border-r transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.02] border-white/5' : 'bg-[#F9F9FB] border-gray-100'}`}>
          <div className="lg:sticky lg:top-12">
            <h2 className={`text-xl font-black uppercase tracking-tighter mb-10 pb-4 border-b transition-colors ${theme === 'dark' ? 'text-white border-white/10' : 'text-[#010520] border-[#0069A8]/10'}`}>ملخص الطلب</h2>
            
            {/* Cart Items List */}
            <div className="space-y-8 mb-12">
              {cartItems.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color || 'none'}`} className="flex items-center gap-6">
                  <div className="relative">
                    <div className={`w-24 h-24 border rounded-[15px] flex items-center justify-center p-4 group overflow-hidden transition-all duration-500 ${theme === 'dark' ? 'bg-white/[0.05] border-white/10' : 'bg-white border-gray-200'}`}>
                       <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <span className={`absolute -top-3 -right-3 text-white text-[12px] w-7 h-7 flex items-center justify-center rounded-full font-black shadow-xl z-10 border-2 transition-all ${theme === 'dark' ? 'bg-[#0069A8] border-[var(--background-white)]' : 'bg-[#0069A8] border-[var(--background-white)]'}`}>
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-black uppercase tracking-tight text-[var(--text-dark-blue)] leading-tight mb-1 transition-colors">{item.name}</h3>
                    <div className="flex items-center gap-3 flex-wrap">
                      <p className="text-[12px] text-gray-400 font-bold uppercase tracking-widest font-mono">{item.size}</p>
                      {item.color && (
                        <>
                          <span className="w-1 h-1 rounded-full bg-gray-300" />
                          <div 
                            className="w-3.5 h-3.5 rounded-[2px] border border-gray-200 shadow-sm" 
                            style={{ backgroundColor: item.color }}
                            title={item.color}
                          />
                        </>
                      )}
                      {item.oldPrice && item.oldPrice > item.price && (
                        <span className="text-[9px] bg-[#0069A8] text-white px-2 py-0.5 rounded font-black uppercase tracking-tighter">Save LE {item.oldPrice - item.price}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-lg font-black text-[var(--text-dark-blue)] transition-colors">LE {item.price * item.quantity}</span>
                    {item.oldPrice && item.oldPrice > item.price && (
                      <span className="text-xs line-through opacity-30 font-bold text-[var(--text-dark-blue)]">LE {item.oldPrice * item.quantity}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations */}
            <div className={`space-y-4 pt-8 border-t transition-colors ${theme === 'dark' ? 'border-white/10' : 'border-[#0069A8]/10'}`}>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[11px]">المجمع · {cartItems.reduce((acc, item) => acc + item.quantity, 0)} قطع</span>
                <span className="font-black text-[var(--text-dark-blue)] transition-colors">LE {subtotal}.00</span>
              </div>
              
              {totalDiscount > 0 && (
                <div className="flex justify-between items-center text-sm text-[#0069A8]">
                  <span className="font-black uppercase tracking-widest text-[11px]">OUR SALE</span>
                  <span className="font-black">- LE {totalDiscount}.00</span>
                </div>
              )}

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-400 font-bold flex items-center gap-1 uppercase tracking-widest text-[11px]">الشحن <Info size={14} className="opacity-30" /></span>
                <span className={`font-black text-[12px] uppercase tracking-widest transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>شحن مجاني</span>
              </div>
              
              <div className="flex justify-between items-end pt-8">
                <div className="flex flex-col">
                  <span className="text-[11px] text-gray-400 font-black uppercase tracking-[0.2em] mb-1">المبلغ المطلوب</span>
                  <span className="text-4xl font-black uppercase tracking-tighter text-[var(--text-dark-blue)] leading-none transition-colors">الإجمالي</span>
                </div>
                <div className="text-right">
                  <span className="text-[12px] text-gray-400 font-black mr-2 tracking-widest mb-1 block">EGP</span>
                  <span className={`text-5xl font-black leading-none tracking-tighter transition-colors ${theme === 'dark' ? 'text-[#0069A8]' : 'text-[#0069A8]'}`}>LE {total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
