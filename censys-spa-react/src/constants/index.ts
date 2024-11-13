export const ERROR_TEXT = `When searching the name field, make sure Virtual Hosts are included in results.
                Try searching using a key:value pair. The Data Definitions page provides a list of keys.
                Don't know the value? Use a wildcard (*) instead to return hosts that have any value for the field.
                Use Reports to see what values commonly look like for a field.
                Put search criteria inside the same_service() function if it all needs to be true of a single service.
                Use the exact operator = to restrict results to exact matches.
                Read the Search Language introduction for information on writing queries.
                Or use the new CensysGPT Beta tool to translate a question into a Censys Search Language query.`;

// Access credentials from environment variables
export const API_URL = import.meta.env.VITE_API_URL;
export const API_KEY = import.meta.env.VITE_API_KEY;
export const API_SECRET = import.meta.env.VITE_API_SECRET;