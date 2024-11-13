import React from 'react';

interface Props {
    errorText: string;
}

const ErrorTemplate: React.FC<Props> = ({ errorText }) => {
    return (
        <div className="no-results">
            <div className='error-column-1'>
                <strong>Hosts</strong>
                <p>Results: 0</p>
                <p>Your query returned no results.</p>
                <p>Quick tips:</p>
            </div>

            <div className='error-column-2'>
                {errorText}
            </div>
        </div>
    )
}

export default ErrorTemplate;