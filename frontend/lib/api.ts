const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export interface EventSearchOptions {
  search?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: number;
  tags?: string[];
  sortBy?: 'eventDate' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export async function fetchEvents(options?: EventSearchOptions) {
  const params = new URLSearchParams();
  
  if (options) {
    Object.entries(options).forEach(([key, value]) => {
      if (value) {
        if (key === 'tags' && Array.isArray(value)) {
          params.append(key, value.join(','));
        } else {
          params.append(key, value.toString());
        }
      }
    });
  }
  
  const url = `${API_BASE_URL}/events${params.toString() ? `?${params.toString()}` : ''}`;
  const response = await fetch(url);
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

export async function fetchCategories() {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
}

export async function createCategory(categoryData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(categoryData),
  });
  if (!response.ok) {
    throw new Error('Failed to create category');
  }
  return response.json();
}

export async function fetchTags() {
  const response = await fetch(`${API_BASE_URL}/tags`);
  if (!response.ok) {
    throw new Error('Failed to fetch tags');
  }
  return response.json();
}

export async function createTag(tagData: any, token: string) {
  const response = await fetch(`${API_BASE_URL}/tags`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(tagData),
  });
  if (!response.ok) {
    throw new Error('Failed to create tag');
  }
  return response.json();
}
