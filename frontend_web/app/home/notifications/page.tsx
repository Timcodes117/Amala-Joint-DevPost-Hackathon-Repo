"use client"
import React from 'react'

function NotificationsPage() {
  // Dummy notification data
  const notifications = [
    {
      id: 1,
      title: "Store Verification Approved",
      message: "Your verification for &lsquo;The Amala Joint&rsquo; has been approved. Thank you for contributing!",
      timestamp: "2 hours ago",
      read: false
    },
    {
      id: 2, 
      title: "New Store Near You",
      message: "A new store &lsquo;Lagos Kitchen&rsquo; has been added in your area. Check it out!",
      timestamp: "Yesterday",
      read: true
    },
    {
      id: 3,
      title: "Verification Request",
      message: "Can you help verify &lsquo;Mama Put Corner&rsquo;? It&apos;s just 2km from your location.",
      timestamp: "2 days ago",
      read: true
    },
    {
      id: 4,
      title: "Community Achievement",
      message: "You&apos;ve helped verify 5 stores! Keep up the great work.",
      timestamp: "1 week ago",
      read: true
    }
  ]

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <p className="text-sm text-gray-500">Stay updated with what&apos;s happening around you</p>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notification) => (
          <div 
            key={notification.id}
            className={`p-4 rounded-lg border ${
              notification.read ? 'border-gray-700 bg-gray-900' : 'border-primary bg-gray-800'
            }`}
          >
            <div className="flex flex-col gap-2">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{notification.title}</h3>
                <span className="text-xs text-gray-500">{notification.timestamp}</span>
              </div>
              <p className="text-sm text-gray-300">{notification.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsPage
