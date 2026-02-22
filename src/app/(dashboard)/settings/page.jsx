import DataExport from '@/component/Settings/ExportData';
import NotificationPreferences from '@/component/Settings/NotificationPreferences';
import ProfileSettings from '@/component/Settings/ProfileSettings';
import SecurityPrivacy from '@/component/Settings/SecurityPrivacy';
import React from 'react';

const settings = () => {
    return (
        <div>
            <ProfileSettings />
            <NotificationPreferences />
            <SecurityPrivacy />
            <DataExport />
        </div>
    );
};

export default settings;