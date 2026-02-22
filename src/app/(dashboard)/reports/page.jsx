import CustomerPriorityDistribution from '@/component/Report/CustomerPriorityDistribution';
import ReportsTopbar from '@/component/Report/ReportTopbar';
import RevenueTrend from '@/component/Report/RevenueTrend';
import SalesVisitsTrend from '@/component/Report/SalesVisitsTrend';
import TopPerformingSalesTeam from '@/component/Report/TopPerformingSalesTeam';
import React from 'react';

const report = () => {
    return (
        <div>
            <ReportsTopbar />
            <RevenueTrend />
            <SalesVisitsTrend />
            <CustomerPriorityDistribution />
            <div className='flex justify-between'>
            </div>
            <TopPerformingSalesTeam />
        </div>
    );
};

export default report;