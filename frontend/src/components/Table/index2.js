import React, { useState } from 'react';
import { snake2NameCase } from '../../utils/common';

const Table = ({ data, id = true, headers = [], headerNames = [], actions = [], className }) => {
    if (!data || !data.length) {
        return <h3>Nothing to show</h3>;
    }
    const [filteredData, setFilteredData] = useState(data);
    if (headers.length) {
        data = data.map((item) => {
            let tempItem = { ...item };
            Object.keys(tempItem).forEach((key) => {
                if (!headers.includes(key)) {
                    delete tempItem[key];
                }
            });
            return tempItem;
        });
    }

    let header = Object.keys(data[0]);
    if (headerNames.length) {
        if (headers.length) {
            if (headers.length !== headerNames.length) {
                throw new Error('Headers and Header Names length must be same');
            }
        } else {
            if (header.length !== headerNames.length) {
                throw new Error('Headers and Header Names length must be same');
            } else {
                header = headerNames;
            }
        }
    }
    if (!id) {
        header = header.filter((item) => item.toLowerCase().replace('_', '') !== 'id');
    }

    return !data.length ? (
        <h3>Nothing to show</h3>
    ) : (
        <div className="card">
            <table className={className}>
                <thead>
                    <tr>
                        {header.map((key, index) => (
                            <td key={index}>{snake2NameCase(key)}</td>
                        ))}
                        {actions.length > 0 && <td colSpan={actions.length}>Actions</td>}
                    </tr>
                </thead>
                <tbody>
                    {filteredData.map((item) => {
                        let tempItem = { ...item };
                        !id && delete tempItem.id
                        return (<tr key={item.id}>
                            {Object.values(tempItem).map((value, index) => (
                                <td key={index}>{value.toString()}</td>
                            ))}
                            {actions.length > 0 && <td>
                                {actions.map((action, index) => {
                                    return <button key={index} onClick={() => action.handler(item.id)}>{action.name}</button>
                                })}
                            </td>}
                        </tr>)
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default Table;