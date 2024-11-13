import React, { useState } from 'react';
import axios from 'axios';
import censysLogo from '../../src/assets/censys-2022.svg';
import ErrorTemplate from './ErrorTemplate';
import { ERROR_TEXT } from '../constants';
import { API_URL, API_KEY, API_SECRET } from '../constants';

// Define types for the API response data
interface SearchResponse {
    duration: number;
    hits: { ip: string; services: Services[]; }[];  // Array of hits with IPs
    links: {
        next?: string;
        prev?: string; // Adding the prev link to the response data
    };
    query: string;
    total: number;
}

// Contract for services 
interface Services {
    service_name: string;
    extended_service_name: string;
    transport_protocol: string;
    port: number;
}

const Search: React.FC = () => {
    // Directly setting the state to reflect the response structure
    const [results, setResults] = useState<SearchResponse>({
        duration: 0,
        hits: [],
        links: {},
        query: "",
        total: 0
    });
    const [noResults, setNoResults] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [nextPage, setNextPage] = useState<string | undefined>(undefined);
    const [prevPage, setPrevPage] = useState<string | undefined>(undefined);

    // For this API, we need to use basic auth by passing in an API key & secret from creating a censys account
    const encodedAuth = btoa(`${API_KEY}:${API_SECRET}`);

    // Fetch data from censys search API
    const makeSearchRequest = async (searchText: string, cursor?: string) => {
        setLoading(true);

        try {
            const requestBody = {
                q: searchText,
                per_page: 4,
                virtual_hosts: 'EXCLUDE',
                cursor: cursor, // For pagination, use cursor from nextPage if available
                sort: 'RELEVANCE',
            };

            const response = await axios.post<{ result: SearchResponse }>(API_URL, requestBody, {
                headers: {
                    'Authorization': `Basic ${encodedAuth}`,
                    'Content-Type': 'application/json',
                },
            });

            // Access result data from response
            const resultData = response.data.result;

            if (resultData?.hits?.length === 0) {
                setNoResults(true);
            } else {
                setNoResults(false);
            }

            // Update results state
            setResults({
                duration: resultData.duration,
                hits: resultData.hits,   // Update hits directly
                query: resultData.query,
                total: resultData.total,
                links: resultData.links  // Update pagination links
            });

            // Update next and previous page links from response
            setNextPage(resultData.links?.next);
            setPrevPage(resultData.links?.prev);

        } catch (err) {
            console.error('Error fetching data: ' + err);
        } finally {
            setLoading(false);
        }
    };

    // Handle form submission for the search
    const handleSearchRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchText) {
            setResults({
                duration: 0,
                hits: [],
                query: "",
                total: 0,
                links: {}
            }); // Clear previous results when starting a new search
            makeSearchRequest(searchText);
        }
    };

    // Handle pagination for loading more results
    const handlePaginationNext = () => {
        if (nextPage) {
            makeSearchRequest(searchText, nextPage);
        }
    };

    // Handle pagination for going to the previous page
    const handlePaginationPrev = () => {
        if (prevPage) {
            makeSearchRequest(searchText, prevPage);
        }
    };

    return (
        <div className="container">
            <header>
                <img src={censysLogo} id="censys-logo" alt="Censys Logo" className="logo" />
                <h1>IPv4 Search</h1>
            </header>

            <main>
                <form onSubmit={handleSearchRequest} className="search-form">
                    {/* Visually hidden label for screen readers */}
                    <label htmlFor="search-input" className="sr-only">Search for IP addresses</label>
                    <input
                        id="search-input"
                        type="text"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="Enter search query"
                        required
                        className="search-input"
                        aria-label="Enter search query"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="search-button"
                        aria-label="Submit search"
                    >
                        Search
                    </button>
                </form>

                {/* Show loading state */}
                {loading && <p aria-live="assertive">Loading...</p>}

                {/* Display the result object */}
                {results.hits.length > 0 && (
                    <section className="hosts">
                        <h2>Hosts</h2>
                        <h3>Results: {results.total}</h3>
                        <div className="results">
                            {results.hits.map((hit, hitIndex) => (
                                <div key={hitIndex} className="host-container">
                                    <div className="ip-address">
                                        <strong>IP Address: {hit.ip}</strong>
                                    </div>

                                    <div className="port-service-list">
                                        {hit.services && hit.services.length > 0 ? (
                                            hit.services.map((service, serviceIndex) => (
                                                <div key={serviceIndex} className="port-service">
                                                    {service.port}/{service.service_name}
                                                </div>
                                            ))
                                        ) : (
                                            <p>No services available for this host.</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        <div className="pagination">
                            {prevPage && (
                                <button
                                    onClick={handlePaginationPrev}
                                    disabled={loading}
                                    className="prev-button"
                                    aria-label="Previous page"
                                >
                                    Previous
                                </button>
                            )}
                            {nextPage && (
                                <button
                                    onClick={handlePaginationNext}
                                    disabled={loading}
                                    className="load-more-button"
                                    aria-label="Next page"
                                >
                                    Next
                                </button>
                            )}
                        </div>
                    </section>
                )}

                {/* Show error message when no results are found */}
                {noResults && <ErrorTemplate errorText={ERROR_TEXT} />}
            </main>
        </div>
    );
};

export default Search;
