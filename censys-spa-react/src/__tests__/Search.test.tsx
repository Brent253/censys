import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Search from '../components/Search'; // Adjust the import path if necessary
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

    test('handles no results scenario', async () => {
        // Mock axios to resolve with no results
        (axios.post as jest.Mock).mockResolvedValueOnce({
            data: { result: { ...mockData, hits: [] } }
        });

        render(<Search />);

        // Simulate entering a query and submitting the form
        fireEvent.change(screen.getByPlaceholderText('Enter search query'), {
            target: { value: 'nonexistent query' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Wait for the no results to appear
        await waitFor(() => expect(screen.getByText('No results found')).toBeInTheDocument());
    });

    test('handles error case correctly', async () => {
        // Mock axios to reject with an error
        (axios.post as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

        render(<Search />);

        // Simulate entering a query and submitting the form
        fireEvent.change(screen.getByPlaceholderText('Enter search query'), {
            target: { value: 'test query' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Wait for the loading to finish and error handling
        await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

        // Check if an error message appears (you can adjust this part depending on how you handle errors in your component)
        expect(screen.getByText('Error fetching data')).toBeInTheDocument();
    });

    test('pagination works correctly', async () => {
        // Mock axios to resolve with data including pagination links
        (axios.post as jest.Mock).mockResolvedValueOnce({ data: { result: mockData } });

        render(<Search />);

        // Simulate entering a query and submitting the form
        fireEvent.change(screen.getByPlaceholderText('Enter search query'), {
            target: { value: 'test query' }
        });
        fireEvent.click(screen.getByText('Search'));

        // Wait for the pagination controls to appear
        await waitFor(() => expect(screen.getByText('Previous')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Load More')).toBeInTheDocument());

        // Simulate clicking the "Load More" button
        fireEvent.click(screen.getByText('Load More'));

        // Ensure the API call is made again (you may want to check that the pagination functionality triggers the call correctly)
        expect(axios.post).toHaveBeenCalledTimes(2);
    });
});
