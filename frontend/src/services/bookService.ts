import api from './api';

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  status: 'To Read' | 'Reading' | 'Read';
  coverImage?: string;
  description?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  googleBooksId?: string;
  readingProgress?: {
    currentPage: number;
    totalPages: number;
    progressPercentage: number;
    lastUpdated: string;
  };
  review?: {
    rating: number;
    comment: string;
    dateAdded: string;
  };
  tags?: string[];
  notes?: Array<{
    content: string;
    page?: number;
    dateAdded: string;
  }>;
  dateAdded: string;
  dateStarted?: string;
  dateFinished?: string;
  favorite: boolean;
  priority: 'Low' | 'Medium' | 'High';
  createdAt: string;
  updatedAt: string;
}

export interface BookFormData {
  title: string;
  author: string;
  isbn?: string;
  genre: string;
  status?: 'To Read' | 'Reading' | 'Read';
  description?: string;
  publishedDate?: string;
  publisher?: string;
  pageCount?: number;
  language?: string;
  googleBooksId?: string;
  coverImage?: string;
  tags?: string[];
  favorite?: boolean;
  priority?: 'Low' | 'Medium' | 'High';
}

export interface BooksResponse {
  books: Book[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalBooks: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface BookStats {
  statusStats: {
    'To Read': number;
    'Reading': number;
    'Read': number;
  };
  genreStats: Array<{
    _id: string;
    count: number;
  }>;
  monthlyReading: Array<{
    _id: {
      year: number;
      month: number;
    };
    count: number;
  }>;
  totalBooks: number;
}

export interface GoogleBook {
  googleBooksId: string;
  title: string;
  author: string;
  description: string;
  publishedDate: string;
  publisher: string;
  pageCount: number;
  genre: string;
  coverImage: string;
  isbn: string;
  language: string;
}

class BookService {
  async getBooks(params?: {
    page?: number;
    limit?: number;
    status?: string;
    genre?: string;
    search?: string;
  }): Promise<BooksResponse> {
    const response = await api.get('/books', { params });
    return response.data;
  }

  async getBook(id: string): Promise<{ book: Book }> {
    const response = await api.get(`/books/${id}`);
    return response.data;
  }

  async createBook(bookData: BookFormData): Promise<{ book: Book; message: string }> {
    const response = await api.post('/books', bookData);
    return response.data;
  }

  async updateBook(id: string, bookData: Partial<BookFormData>): Promise<{ book: Book; message: string }> {
    const response = await api.put(`/books/${id}`, bookData);
    return response.data;
  }

  async updateBookStatus(id: string, status: 'To Read' | 'Reading' | 'Read'): Promise<{ book: Book; message: string }> {
    const response = await api.put(`/books/${id}`, { status });
    return response.data;
  }

  async deleteBook(id: string): Promise<{ message: string }> {
    const response = await api.delete(`/books/${id}`);
    return response.data;
  }

  async uploadCover(id: string, file: File): Promise<{ coverImage: string; message: string }> {
    const formData = new FormData();
    formData.append('cover', file);
    
    const response = await api.post(`/books/${id}/cover`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async updateProgress(id: string, currentPage: number): Promise<{ progress: any; message: string }> {
    const response = await api.put(`/books/${id}/progress`, { currentPage });
    return response.data;
  }

  async addReview(id: string, rating: number, comment?: string): Promise<{ review: any; message: string }> {
    const response = await api.post(`/books/${id}/review`, { rating, comment });
    return response.data;
  }

  async getStats(): Promise<BookStats> {
    const response = await api.get('/books/stats');
    return response.data;
  }

  async searchGoogleBooks(query: string, maxResults?: number): Promise<{ books: GoogleBook[] }> {
    const response = await api.get('/books/search/google', {
      params: { q: query, maxResults }
    });
    return response.data;
  }
}

export const bookService = new BookService();
export default bookService;
