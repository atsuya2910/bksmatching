const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchEvents() {
  const response = await fetch(`${API_BASE_URL}/events`);
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  return response.json();
}

export async function fetchEventById(id: number) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch event');
  }
  return response.json();
}

export async function createEvent(eventData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error('Failed to create event');
  }
  return response.json();
}

export async function updateEvent(id: number, eventData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });
  if (!response.ok) {
    throw new Error('Failed to update event');
  }
  return response.json();
}

export async function deleteEvent(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to delete event');
  }
  return response.json();
}

export async function joinEvent(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}/join`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to join event');
  }
  return response.json();
}

export async function leaveEvent(id: number, token: string) {
  const response = await fetch(`${API_BASE_URL}/events/${id}/leave`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error('Failed to leave event');
  }
  return response.json();
}

export async function login(credentials: any) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) {
    throw new Error('Login failed');
  }
  return response.json();
}

export async function signup(userData: any) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });
  if (!response.ok) {
    throw new Error('Signup failed');
  }
  return response.json();
}
