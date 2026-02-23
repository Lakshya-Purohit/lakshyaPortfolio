import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AIChatbot from '../AIChatbot';

// Mock CSS modules
vi.mock('../AIChatbot.module.css', () => ({
    default: new Proxy(
        {},
        {
            get: (_target, prop) => String(prop),
        }
    ),
}));

// Helper to create mock fetch responses
function mockFetchResponse(reply: string) {
    return vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        json: () => Promise.resolve({ reply }),
    });
}

describe('AIChatbot', () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders the trigger button with "Ask AI" label', () => {
        render(<AIChatbot />);
        expect(screen.getByRole('button', { name: /open ai chatbot/i })).toBeInTheDocument();
        expect(screen.getByText('Ask AI')).toBeInTheDocument();
    });

    it('renders the initial greeting message', () => {
        render(<AIChatbot />);
        expect(screen.getByText(/AI assistant/i)).toBeInTheDocument();
    });

    it('opens the chat panel when trigger button is clicked', async () => {
        render(<AIChatbot />);
        const trigger = screen.getByRole('button', { name: /open ai chatbot/i });
        await act(async () => {
            fireEvent.click(trigger);
        });

        // The header title should be visible
        expect(screen.getByText(/Ask me anything/)).toBeInTheDocument();
    });

    it('closes the chat panel when close button is clicked', async () => {
        render(<AIChatbot />);

        // Open
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        // Close
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /close chat/i }));
        });

        // Trigger button should be visible again (no triggerHidden class)
        const trigger = screen.getByRole('button', { name: /open ai chatbot/i });
        expect(trigger.className).not.toContain('triggerHidden');
    });

    it('sends a user message and displays assistant reply', async () => {
        global.fetch = mockFetchResponse('This is a test reply from the AI.');

        render(<AIChatbot />);

        // Open chat
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        // Type message
        const input = screen.getByPlaceholderText(/ask about lakshya/i);
        await act(async () => {
            await userEvent.type(input, 'What are your skills?');
        });

        // Send
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /send message/i }));
        });

        // Wait for reply
        await waitFor(() => {
            expect(screen.getByText('This is a test reply from the AI.')).toBeInTheDocument();
        });

        // Verify fetch was called with the right endpoint
        expect(global.fetch).toHaveBeenCalledWith(
            '/api/chat',
            expect.objectContaining({
                method: 'POST',
            })
        );
    });

    it('shows the user message immediately after sending', async () => {
        global.fetch = mockFetchResponse('Reply');

        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i);
        await act(async () => {
            await userEvent.type(input, 'Hello there');
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /send message/i }));
        });

        expect(screen.getByText('Hello there')).toBeInTheDocument();
    });

    it('handles API error gracefully', async () => {
        global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i);
        await act(async () => {
            await userEvent.type(input, 'test error');
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /send message/i }));
        });

        await waitFor(() => {
            expect(screen.getByText(/oops, something went wrong/i)).toBeInTheDocument();
        });
    });

    it('blocks empty or whitespace-only messages', async () => {
        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        // Send button should be disabled when input is empty
        const sendBtn = screen.getByRole('button', { name: /send message/i });
        expect(sendBtn).toBeDisabled();
    });

    it('respects max message length attribute (500 chars)', async () => {
        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i) as HTMLInputElement;
        expect(input.maxLength).toBe(500);
    });

    it('Enter key sends message and clears input', async () => {
        global.fetch = mockFetchResponse('Enter reply');

        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i) as HTMLInputElement;
        await act(async () => {
            await userEvent.type(input, 'Enter test');
        });

        await act(async () => {
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
        });

        // Input should be cleared
        expect(input.value).toBe('');

        await waitFor(() => {
            expect(screen.getByText('Enter reply')).toBeInTheDocument();
        });
    });

    it('Shift+Enter does NOT send message', async () => {
        global.fetch = vi.fn();

        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i);
        await act(async () => {
            await userEvent.type(input, 'Shift enter test');
        });

        await act(async () => {
            fireEvent.keyDown(input, { key: 'Enter', code: 'Enter', shiftKey: true });
        });

        // fetch should NOT have been called
        expect(global.fetch).not.toHaveBeenCalled();
    });

    it('disables input while loading', async () => {
        // Make fetch hang to simulate loading state
        let resolvePromise: (value: unknown) => void;
        global.fetch = vi.fn().mockReturnValue(
            new Promise((resolve) => {
                resolvePromise = resolve;
            })
        );

        render(<AIChatbot />);

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /open ai chatbot/i }));
        });

        const input = screen.getByPlaceholderText(/ask about lakshya/i);
        await act(async () => {
            await userEvent.type(input, 'Loading test');
        });

        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /send message/i }));
        });

        // Should be disabled while loading
        expect(screen.getByPlaceholderText(/ask about lakshya/i)).toBeDisabled();

        // Resolve the pending request
        await act(async () => {
            resolvePromise!({
                ok: true,
                json: () => Promise.resolve({ reply: 'Done' }),
            });
        });

        await waitFor(() => {
            expect(screen.getByPlaceholderText(/ask about lakshya/i)).not.toBeDisabled();
        });
    });
});
