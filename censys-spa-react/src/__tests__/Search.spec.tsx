import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../components/Search';
import axios from 'axios';
import '@testing-library/jest-dom';

// Mock axios
jest.mock('axios');

const mockData = {
    duration: 1,
    hits: [
        {
            ip: '192.168.0.1',
            services: [{ port: 80, service_name: 'http' }]
        }
    ],
    links: { next: 'nextPage', prev: 'prevPage' },
    query: 'test query',
    total: 1
};

describe('Search Component', () => {

    beforeEach(() => {
        // Reset all mocks before each test to ensure no interference between tests
        jest.clearAllMocks();
    });

    test('renders search form correctly', () => {
        render(<Search />);

        // Check if the search input and button are rendered
        expect(screen.getByPlaceholderText('Enter search query')).toBeInTheDocument();
        expect(screen.getByText('Search')).toBeInTheDocument();
    });

    test('shows loading message when search is in progress', async () => {
        // Mock axios.post to simulate the loading state
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: { result: mockData } });

        render(<Search />);

        // Simulate a search form submission
        fireEvent.change(screen.getByPlaceholderText('Enter search query'), {
            target: { value: 'test query' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Check if loading message is shown
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    test('displays search results correctly', async () => {
        // Mock axios to resolve with the mockData
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: { result: mockData } });

        render(<Search />);

        // Simulate entering a query and submitting the form
        fireEvent.change(screen.getByPlaceholderText('Enter search query'), {
            target: { value: 'test query' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Wait for the results to appear
        await waitFor(() => expect(screen.getByText('Results: 1')).toBeInTheDocument());

        // Check if IP and service are displayed correctly
        expect(screen.getByText('IP Address: 192.168.0.1')).toBeInTheDocument();
        expect(screen.getByText('80/http')).toBeInTheDocument();
    });
});
