import React, { useEffect, useState } from 'react';
import { snake2NameCase } from '../../utils/common';

const Table = ({ data, className, showId = true }) => {
    const [filteredData, setFilteredData] = useState(data);

    let header;
    if (data.length) {
        header = Object.keys(data[0]);
        if (!showId) {
            header = header.filter(item => item.toLowerCase().replace('_', '') !== 'id');
        }
    }

    return (
        <div className="card">
            {!data.length ? (
                <div className='text-center bg-secondary text-light test'>
                    Nothing to show
                </div>
            ) : (
                <table className={className}>
                    <thead>
                        <tr>
                            {header.map((column, index) => (
                                <td key={index}>{snake2NameCase(column)}</td>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map(item => {
                            console.log(item);
                            let tempItem = { ...item };
                            !showId && delete tempItem.id;
                            return (
                                <tr key={item.id}>
                                    {Object.values(tempItem).map((value, index) => (
                                        <td key={index}>{value.toString()}</td>
                                    ))}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Table;