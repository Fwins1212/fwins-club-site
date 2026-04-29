import { useState } from 'react'
import EventsManager from './EventsManager'
import AnnouncementsManager from './AnnouncementsManager'
import MembersList from './MembersList'

export default function AdminPanel() {
  const [activeTab, setActiveTab] = useState('events')

  const tabs = [
    { id: 'events', name: 'Events', icon: '📅' },
    { id: 'announcements', name: 'Announcements', icon: '📢' },
    { id: 'members', name: 'Members', icon: '👥' }
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6">
          <h1 className="text-3xl font-bold text-white">Admin Panel</h1>
          <p className="text-blue-100 mt-1">Manage your Fwins Club platform</p>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 font-medium text-sm border-b-2 transition ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-8">
          {activeTab === 'events' && <EventsManager />}
          {activeTab === 'announcements' && <AnnouncementsManager />}
          {activeTab === 'members' && <MembersList />}
        </div>
      </div>
    </div>
  )
}