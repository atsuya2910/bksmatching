"use client";

import { useState, useEffect } from 'react';
import { fetchEvents, createEvent, login, signup, fetchEventById, updateEvent, deleteEvent, joinEvent, leaveEvent, EventSearchOptions } from '../lib/api';

interface User {
  id: number;
  email: string;
  name: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
  color: string;
  icon?: string;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  eventDate: string;
  organizerId: number;
  categoryId?: number;
  participants: User[];
  organizer?: User;
  category?: Category;
  tags?: Tag[];
}

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null); // New state for current user ID
  const [message, setMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editEventDate, setEditEventDate] = useState('');

  // 検索・フィルタリング用のstate
  const [searchText, setSearchText] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [sortBy, setSortBy] = useState<'eventDate' | 'createdAt' | 'title'>('eventDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      // Decode token to get user ID (assuming JWT structure with 'sub' as user ID)
      try {
        const decodedToken = JSON.parse(atob(storedToken.split('.')[1]));
        setCurrentUserId(decodedToken.sub);
      } catch (error) {
        console.error("Failed to decode token:", error);
        setToken(null);
        localStorage.removeItem('token');
      }
    }
    loadEvents();
  }, []);

  useEffect(() => {
    if (selectedEvent) {
      setEditTitle(selectedEvent.title);
      setEditDescription(selectedEvent.description);
      setEditLocation(selectedEvent.location);
      setEditEventDate(selectedEvent.eventDate.substring(0, 16)); // Format for datetime-local input
    }
  }, [selectedEvent]);

  const loadEvents = async (searchOptions?: EventSearchOptions) => {
    try {
      const data = await fetchEvents(searchOptions);
      setEvents(data);
    } catch (error: any) {
      setMessage(`Error loading events: ${error.message}`);
    }
  };

  const handleSearch = () => {
    const searchOptions: EventSearchOptions = {
      search: searchText || undefined,
      location: searchLocation || undefined,
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
      sortBy,
      sortOrder,
    };
    loadEvents(searchOptions);
  };

  const handleClearFilters = () => {
    setSearchText('');
    setSearchLocation('');
    setDateFrom('');
    setDateTo('');
    setSortBy('eventDate');
    setSortOrder('asc');
    loadEvents();
  };

  const handleEventClick = async (id: number) => {
    try {
      const event = await fetchEventById(id);
      setSelectedEvent(event);
      setIsEditing(false); // Always show details first
    } catch (error: any) {
      setMessage(`Error loading event details: ${error.message}`);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !location || !eventDate) {
      setMessage('全ての項目を入力してください');
      return;
    }
    if (!token) {
      setMessage('Please log in to create an event.');
      return;
    }
    try {
      await createEvent({ title, description, location, eventDate }, token);
      setMessage('Event created successfully!');
      setTitle('');
      setDescription('');
      setLocation('');
      setEventDate('');
      loadEvents();
    } catch (error: any) {
      setMessage(`Error creating event: ${error.message}`);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !selectedEvent) {
      setMessage('Please log in and select an event to update.');
      return;
    }
    try {
      await updateEvent(
        selectedEvent.id,
        {
          title: editTitle,
          description: editDescription,
          location: editLocation,
          eventDate: editEventDate,
        },
        token,
      );
      setMessage('Event updated successfully!');
      setSelectedEvent(null); // Close modal
      setIsEditing(false);
      loadEvents(); // Reload events to show updated data
    } catch (error: any) {
      setMessage(`Error updating event: ${error.message}`);
    }
  };

  const handleDeleteEvent = async () => {
    if (!token || !selectedEvent) {
      setMessage('Please log in and select an event to delete.');
      return;
    }
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    try {
      await deleteEvent(selectedEvent.id, token);
      setMessage('Event deleted successfully!');
      setSelectedEvent(null); // Close modal
      loadEvents(); // Reload events to show updated data
    } catch (error: any) {
      setMessage(`Error deleting event: ${error.message}`);
    }
  };

  const handleJoinEvent = async () => {
    if (!token || !selectedEvent || currentUserId === null) {
      setMessage('Please log in to join an event.');
      return;
    }
    try {
      await joinEvent(selectedEvent.id, token);
      setMessage('Joined event successfully!');
      // Reload selected event to update participant list
      const updatedEvent = await fetchEventById(selectedEvent.id);
      setSelectedEvent(updatedEvent);
      loadEvents(); // Also reload main list
    } catch (error: any) {
      setMessage(`Error joining event: ${error.message}`);
    }
  };

  const handleLeaveEvent = async () => {
    if (!token || !selectedEvent || currentUserId === null) {
      setMessage('Please log in to leave an event.');
      return;
    }
    try {
      await leaveEvent(selectedEvent.id, token);
      setMessage('Left event successfully!');
      // Reload selected event to update participant list
      const updatedEvent = await fetchEventById(selectedEvent.id);
      setSelectedEvent(updatedEvent);
      loadEvents(); // Also reload main list
    } catch (error: any) {
      setMessage(`Error leaving event: ${error.message}`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login({ email, password });
      setToken(data.access_token);
      localStorage.setItem('token', data.access_token);
      // Decode token to get user ID
      try {
        const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));
        setCurrentUserId(decodedToken.sub);
      } catch (error) {
        console.error("Failed to decode token after login:", error);
      }
      setMessage('Logged in successfully!');
      setEmail('');
      setPassword('');
    } catch (error: any) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup({ email, password, name });
      setMessage('Signed up successfully! Please log in.');
      setEmail('');
      setPassword('');
      setName('');
    } catch (error: any) {
      setMessage(`Signup failed: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setCurrentUserId(null); // Clear user ID on logout
    localStorage.removeItem('token');
    setMessage('Logged out.');
  };

  const isParticipant = selectedEvent?.participants.some(p => p.id === currentUserId);
  const isOrganizer = selectedEvent?.organizerId === currentUserId;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">ミートアップマッチングサービス</h1>

      {message && <p className="text-red-500 mb-4">{message}</p>}

      {!token ? (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">ログイン</h2>
          <form onSubmit={handleLogin} className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">ログイン</button>
          </form>

          <h2 className="text-xl font-semibold mt-4 mb-2">Sign Up</h2>
          <form onSubmit={handleSignup} className="space-y-2">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-green-500 text-white p-2 rounded">Sign Up</button>
          </form>
        </div>
      ) : (
        <div className="mb-8">
          <p className="mb-2">You are logged in. <button onClick={handleLogout} className="text-blue-500">Logout</button></p>
          <h2 className="text-xl font-semibold mb-2">Create New Event</h2>
          <form onSubmit={handleCreateEvent} className="space-y-2">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border p-2 w-full"
            />
            <textarea
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border p-2 w-full"
            ></textarea>
            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border p-2 w-full"
            />
            <input
              type="datetime-local"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="border p-2 w-full"
            />
            <button type="submit" className="bg-blue-500 text-white p-2 rounded">Create Event</button>
          </form>
        </div>
      )}

      {/* 検索・フィルタリングセクション */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg">
        <div className="flex flex-col sm:flex-row gap-2 mb-3">
          <input
            type="text"
            placeholder="イベントを検索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text"
            placeholder="場所で検索..."
            value={searchLocation}
            onChange={(e) => setSearchLocation(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            検索
          </button>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            {showFilters ? '詳細フィルタを隠す' : '詳細フィルタ'}
          </button>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 p-3 bg-white rounded border">
            <div>
              <label className="block text-sm font-medium mb-1">開始日</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">終了日</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border p-2 rounded w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">並び順</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'eventDate' | 'createdAt' | 'title')}
                className="border p-2 rounded w-full"
              >
                <option value="eventDate">イベント日時</option>
                <option value="createdAt">作成日時</option>
                <option value="title">タイトル</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">順序</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                className="border p-2 rounded w-full"
              >
                <option value="asc">昇順</option>
                <option value="desc">降順</option>
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-4 flex gap-2 mt-2">
              <button
                onClick={handleSearch}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                フィルタを適用
              </button>
              <button
                onClick={handleClearFilters}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                フィルタをクリア
              </button>
            </div>
          </div>
        )}
      </div>

      <h2 className="text-xl font-semibold mb-2">Events</h2>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <div key={event.id} className="border p-4 rounded shadow cursor-pointer hover:shadow-lg transition-shadow" onClick={() => handleEventClick(event.id)}>
              <h3 className="text-lg font-bold">{event.title}</h3>
              <p className="text-gray-700 text-sm mb-2">{event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description}</p>
              <p className="text-gray-600 text-sm">📍 {event.location}</p>
              <p className="text-gray-600 text-sm">📅 {new Date(event.eventDate).toLocaleString()}</p>
              <p className="text-gray-600 text-sm">👥 参加者: {event.participants?.length || 0}人</p>
              {event.organizer && (
                <p className="text-gray-600 text-xs mt-1">主催者: {event.organizer.name}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedEvent && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
            {!isEditing ? (
              <>
                <h2 className="text-2xl font-bold mb-4">Event Details</h2>
                <h3 className="text-xl font-semibold mb-2">{selectedEvent.title}</h3>
                <p className="text-gray-700 mb-2">{selectedEvent.description}</p>
                <p className="text-gray-600 text-sm mb-2">Location: {selectedEvent.location}</p>
                <p className="text-gray-600 text-sm mb-4">Date: {new Date(selectedEvent.eventDate).toLocaleString()}</p>
                <p className="text-gray-600 text-sm mb-4">Participants: {selectedEvent.participants?.length || 0}</p>

                {token && !isOrganizer && !isParticipant && (
                  <button
                    onClick={handleJoinEvent}
                    className="bg-green-500 text-white p-2 rounded mr-2"
                  >
                    Join Event
                  </button>
                )}
                {token && !isOrganizer && isParticipant && (
                  <button
                    onClick={handleLeaveEvent}
                    className="bg-orange-500 text-white p-2 rounded mr-2"
                  >
                    Leave Event
                  </button>
                )}

                {token && isOrganizer && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-yellow-500 text-white p-2 rounded mr-2"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-blue-500 text-white p-2 rounded"
                >
                  Close
                </button>
                {token && isOrganizer && (
                  <button
                    onClick={handleDeleteEvent}
                    className="bg-red-500 text-white p-2 rounded ml-2"
                  >
                    Delete
                  </button>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Edit Event</h2>
                <form onSubmit={handleUpdateEvent} className="space-y-2">
                  <input
                    type="text"
                    placeholder="Title"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <textarea
                    placeholder="Description"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="border p-2 w-full"
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Location"
                    value={editLocation}
                    onChange={(e) => setEditLocation(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <input
                    type="datetime-local"
                    value={editEventDate}
                    onChange={(e) => setEditEventDate(e.target.value)}
                    className="border p-2 w-full"
                  />
                  <button type="submit" className="bg-green-500 text-white p-2 rounded mr-2">Save</button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="bg-gray-500 text-white p-2 rounded"
                  >
                    Cancel
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </main>
  );
}