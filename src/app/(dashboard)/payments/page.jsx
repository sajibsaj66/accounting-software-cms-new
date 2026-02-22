import PaymentsStat from '@/component/Payment/PaymentStat';
import PaymentTracking from '@/component/Payment/PaymentTracking';
import React from 'react';

const Payment = () => {
    return (
        <div>
            <PaymentsStat />
            <PaymentTracking />
        </div>
    );
};

export default Payment;