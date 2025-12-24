// Payment Step 3 - Insert this code after line 317 in Booking.jsx
// Right after the closing of currentStep === 2 block

{
    currentStep === 3 && (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                    Select Payment Method
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-6">
                    Amount to pay: <span className="font-bold text-primary-500">₹{total.toFixed(2)}</span>
                </p>

                <div className="space-y-4">
                    {/* UPI Link */}
                    <button
                        onClick={() => setPaymentMethod('upi_link')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'upi_link'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <Smartphone className={`mt-1 ${paymentMethod === 'upi_link' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    Pay with UPI Link
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                    Click the link below to open your UPI app and pay
                                </p>
                                {paymentMethod === 'upi_link' && (
                                    <a
                                        href={generateUPILink()}
                                        className="inline-block px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm font-medium"
                                    >
                                        Pay ₹{total.toFixed(2)} with UPI
                                    </a>
                                )}
                            </div>
                            {paymentMethod === 'upi_link' && (
                                <Check className="text-primary-500" size={24} />
                            )}
                        </div>
                    </button>

                    {/* UPI ID */}
                    <button
                        onClick={() => setPaymentMethod('upi_id')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'upi_id'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <Wallet className={`mt-1 ${paymentMethod === 'upi_id' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    Pay to UPI ID
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                    Enter this UPI ID in your UPI app to complete payment
                                </p>
                                {paymentMethod === 'upi_id' && (
                                    <div className="bg-neutral-100 dark:bg-neutral-800 p-3 rounded-lg">
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">UPI ID:</p>
                                        <p className="font-mono font-bold text-neutral-900 dark:text-neutral-100">{UPI_ID}</p>
                                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">Amount: ₹{total.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                            {paymentMethod === 'upi_id' && (
                                <Check className="text-primary-500" size={24} />
                            )}
                        </div>
                    </button>

                    {/* QR Code */}
                    <button
                        onClick={() => setPaymentMethod('qr_code')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'qr_code'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <QrCode className={`mt-1 ${paymentMethod === 'qr_code' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    Scan QR Code
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-3">
                                    Scan this QR code with any UPI app to pay
                                </p>
                                {paymentMethod === 'qr_code' && (
                                    <div className="bg-white p-4 rounded-lg inline-block">
                                        <QRCodeSVG value={generateUPILink()} size={200} />
                                        <p className="text-xs text-center text-neutral-500 mt-2">Amount: ₹{total.toFixed(2)}</p>
                                    </div>
                                )}
                            </div>
                            {paymentMethod === 'qr_code' && (
                                <Check className="text-primary-500" size={24} />
                            )}
                        </div>
                    </button>

                    {/* Pay on Site */}
                    <button
                        onClick={() => setPaymentMethod('pay_on_site')}
                        className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-300 ${paymentMethod === 'pay_on_site'
                                ? 'border-primary-500 bg-primary-50 dark:bg-primary-950'
                                : 'border-neutral-200 dark:border-neutral-700 hover:border-primary-300'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            <CreditCard className={`mt-1 ${paymentMethod === 'pay_on_site' ? 'text-primary-500' : 'text-neutral-400'}`} size={24} />
                            <div className="flex-1">
                                <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
                                    Pay on Site
                                </h4>
                                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                                    Pay ₹{total.toFixed(2)} when you arrive at the hotel
                                </p>
                            </div>
                            {paymentMethod === 'pay_on_site' && (
                                <Check className="text-primary-500" size={24} />
                            )}
                        </div>
                    </button>
                </div>
            </div>
        </div>
    )
}
