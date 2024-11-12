import React from 'react';
// Hosts
// Results: 0 Time: 0.02s
// Your query returned no results.
// Quick tips:


// When searching the name field, make sure Virtual Hosts are included in results.
// Try searching using a key:value pair. The Data Definitions page provides a list of keys.
// Don't know the value? Use a wildcard (*) instead to return hosts that have any value for the field.
// Use Reports to see what values commonly look like for a field.
// Put search criteria inside the same_service() function if it all needs to be true of a single service.
// Use the exact operator = to restrict results to exact matches.
// Read the Search Language introduction for information on writing queries.
// Or use the new CensysGPT Beta tool to translate a question into a Censys Search Language query.

interface Props {
    name: string;
}

const ErrorTemplate: React.FC<Props> = ({ name }) => {
    return (
        <div>test</div>
    )
}

export default ErrorTemplate;