import React from 'react';
import AdminLoadingState from '@/components/admin/AdminLoadingState';

export default function AdminGlobalLoading() {
  return (
    <div className="w-full min-h-[70vh] flex items-center justify-center">
      <AdminLoadingState 
        title="Loading CMS Section..."
        subtitle="Please wait while resources and settings are being loaded"
        minHeight="min-h-[500px]"
      />
    </div>
  );
}
