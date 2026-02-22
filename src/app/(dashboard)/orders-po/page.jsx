import OrderStats from '@/component/Order/orderStat';
import RecentPurchaseOrders from '@/component/Order/RecentPurchaseOrders';
import React from 'react';

const orderPo = () => {
    return (
        <div>
            <OrderStats />
            <RecentPurchaseOrders />
        </div>
    );
};

export default orderPo;