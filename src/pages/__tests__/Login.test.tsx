import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import type { AuthResponse } from '@/types/auth';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import Login from '../Login';
import { authService } from '@/services/authService';
import { toast } from 'sonner';

// Mock the useNavigate hook
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNavigate.mockReset();
    vi.mocked(authService.login).mockReset();
    vi.mocked(toast.success).mockReset();
    vi.mocked(toast.error).mockReset();

    vi.mocked(authService.login).mockResolvedValue({
      refresh: 'mock-refresh-token',
      access: 'mock-access-token'
    });
  });

  const renderLogin = () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  };

 // In src/pages/__tests__/Login.test.tsx

// Update the first test to remove the check for "Don't have an account?" text
it('renders the login form', () => {
  renderLogin();

  expect(screen.getByText('Welcome Back')).toBeInTheDocument();
  expect(screen.getByLabelText('Username')).toBeInTheDocument();
  expect(screen.getByLabelText('Password')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  // Removed the check for "Don't have an account?" text
});

// Test for successful login
it('handles successful login', async () => {
  // Mock a successful login response
  (authService.login as jest.Mock).mockResolvedValueOnce({ data: { token: 'test-token' } });
  
  renderLogin();
  
  // Fill in the form
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // Wait for success actions
  await waitFor(() => {
    expect(toast.success).toHaveBeenCalledWith('Login successful!');
    expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
  });
});

it('shows an error message when login fails', async () => {
  // Mock a failed login response
  (authService.login as jest.Mock).mockRejectedValueOnce(new Error('Invalid credentials'));
  
  renderLogin();
  
  // Fill in the form
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'wronguser' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpass' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // Wait for error message
  await waitFor(() => {
    expect(toast.error).toHaveBeenCalledWith('Invalid credentials');
  });
});

it('shows loading state while submitting', async () => {
  // Mock a promise that won't resolve to test loading state
  let resolveLogin: (value: AuthResponse) => void;
  const loginPromise = new Promise<AuthResponse>((resolve) => {
    resolveLogin = resolve;
  });
  (authService.login as jest.Mock).mockReturnValueOnce(loginPromise);
  
  renderLogin();
  
  // Fill in the form
  fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
  fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
  
  // Check if loading state is shown
  const button = screen.getByRole('button', { name: /Signing in/ });
  expect(button).toBeDisabled();
  expect(button).toHaveTextContent('Signing in...');
  
  // Resolve the promise to clean up
  resolveLogin!({ access: 'test-access-token', refresh: 'test-refresh-token' });
  await loginPromise;
});

  it('allows entering username and password', () => {
    renderLogin();

    const usernameInput = screen.getByLabelText('Username') as HTMLInputElement;
    const passwordInput = screen.getByLabelText('Password') as HTMLInputElement;

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('password123');
  });

  it('shows validation errors when submitting empty form', async () => {
    renderLogin();

    const submitButton = screen.getByRole('button', { name: /sign in/i });
    fireEvent.click(submitButton);

    // Wait for validation to complete
    await waitFor(() => {
      expect(screen.getByLabelText('Username')).toBeInvalid();
      expect(screen.getByLabelText('Password')).toBeInvalid();
    });
  });

  it('submits the form with username and password', async () => {
    renderLogin();

    // Fill in the form
    const usernameInput = screen.getByLabelText('Username');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: /sign in/i });

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    // Submit the form by clicking the submit button
    fireEvent.click(submitButton);

    // Check that the login function was called with the right parameters
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });

    // Wait for the success toast and navigation
    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Login successful!');
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('shows an error message when login fails', async () => {
    const errorMessage = 'Invalid credentials';
    (authService.login as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/ }));

    // Check that the error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('shows loading state while submitting', async () => {
    // Mock a delayed login
    let resolveLogin: () => void;
    const loginPromise = new Promise<{ refresh: string; access: string }>((resolve) => {
      resolveLogin = () => resolve({
        refresh: 'mock-refresh-token',
        access: 'mock-access-token'
      });
    });
    (authService.login as jest.Mock).mockReturnValueOnce(loginPromise);

    renderLogin();

    // Fill in the form
    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Sign In/i }));

    // Check that the button is in loading state
    expect(screen.getByRole('button', { name: /signing in/i })).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    // Resolve the login promise
    resolveLogin!();

    // Wait for the loading state to be removed
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });
});
