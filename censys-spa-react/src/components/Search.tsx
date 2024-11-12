import React, { useState, useEffect } from 'react';
import axios from 'axios';
import censysLogo from '../../src/assets/censys-2022.svg';

interface Props {
    name: string;
}

// Define types for the API response data
interface CensysResponse {
    duration: number;
    hits: { ip: string; services: Services[]; }[];  // Array of hits with IPs
    links: {
        next?: string;
    };
    query: string;
    total: number;
}

interface Services {
    service_name: string;
    extended_service_name: string;
    transport_protocol: string;
}

const Search: React.FC<Props> = ({ name }) => {
    // Directly setting the state to reflect the response structure
    const [results, setResults] = useState<CensysResponse>({
        duration: 0,
        hits: [],
        links: {},
        query: "",
        total: 0
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [searchText, setSearchText] = useState<string>('');
    const [nextPage, setNextPage] = useState<string | undefined>(undefined);

    const API_URL = 'https://search.censys.io/api/v2/hosts/search';
    const API_KEY = '6bc4c33a-6526-404c-a583-1b74f0cbf423';
    const API_SECRET = 'Ez4Hqu8PLJ5AEcfMgeCi4XChtaeRN8xX'; // Replace with your actual API Secret
    const encodedAuth = btoa(`${API_KEY}:${API_SECRET}`);

    // Fetch data from censys search API
    const makeSearchRequest = async (searchText: string, cursor?: string) => {
        setLoading(true);

        try {
            const requestBody = {
                q: searchText,
                per_page: 50,
                virtual_hosts: 'EXCLUDE',
                cursor: cursor, // For pagination, use cursor from nextPage if available
                sort: 'RELEVANCE',
            };

            const response = await axios.post<{ result: CensysResponse }>(API_URL, requestBody, {
                headers: {
                    'Authorization': `Basic ${encodedAuth}`,
                    'Content-Type': 'application/json',
                },
            });

            // Access result data from response
            const resultData = response.data.result;

            // Update results state
            setResults({
                duration: resultData.duration,
                hits: resultData.hits,   // Update hits directly
                query: resultData.query,
                total: resultData.total,
                links: resultData.links  // Update pagination links
            });

            // Update next page link from response
            setNextPage(resultData.links?.next);

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
    const handlePagination = () => {
        if (nextPage) {
            makeSearchRequest(searchText, nextPage);
        }
    };

    return (
        <div className="container">
            <img src={censysLogo} id="censys-logo" alt="Censys Logo" className="logo" />
            <h1>Censys IPv4 Search</h1>

            <form onSubmit={handleSearchRequest} className="search-form">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Enter search query"
                    required
                    className="search-input"
                />
                <button type="submit" disabled={loading} className="search-button">
                    Search
                </button>
            </form>

            {loading && <p>Loading...</p>}

            {/* Display the result object */}
            {results.hits.length > 0 && (
                <div className="results">
                    <h2>Results</h2>
                    <div className="hosts">
                        <h3>Hosts:</h3>
                        {results.hits.map((hit, hitIndex) => (
                            <div key={hitIndex} className="host-card">
                                <div className="card-content">
                                    <strong>{hit.ip}</strong> - IP Address
                                    <h4>Protocols:</h4>

                                    {/* Check if there are services */}
                                    {hit.services && hit.services.length > 0 ? (
                                        <div className="services">
                                            {hit.services.map((service, serviceIndex) => (
                                                <div key={serviceIndex} className="service">
                                                    <p><strong>Service Name:</strong> {service.service_name}</p>
                                                    <p><strong>Transport Protocol:</strong> {service.transport_protocol}</p>
                                                    <p><strong>Extended Service Name:</strong> {service.extended_service_name}</p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>No services available for this host.</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Load More Button */}
                    {nextPage && (
                        <button onClick={handlePagination} disabled={loading} className="load-more-button">
                            Load More
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
