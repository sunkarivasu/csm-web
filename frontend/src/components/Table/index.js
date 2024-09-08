import React, { useEffect, useState } from 'react';
import { snake2NameCase } from '../../utils/common';
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const Table = ({ data, name = "", id = true, headers = [], headerNames = [], actions = [], className, hasAddNewButton = false }) => {
    const navigate = useNavigate();
    // if (headers.length) {
    //     data = data.map((item) => {
    //         let tempItem = { ...item };
    //         Object.keys(tempItem).forEach((key) => {
    //             if (!headers.includes(key)) {
    //                 delete tempItem[key];
    //             }
    //         });
    //         return tempItem;
    //     });
    // }

    useEffect(() => {
        console.log("data", data);
    },[])

    // let header = Object.keys(data[0]);
    // if (headerNames.length) {
    //     if (headers.length) {
    //         if (headers.length !== headerNames.length) {
    //             throw new Error('Headers and Header Names length must be same');
    //         }
    //     } else {
    //         if (header.length !== headerNames.length) {
    //             throw new Error('Headers and Header Names length must be same');
    //         } else {
    //             header = headerNames;
    //         }
    //     }
    // }

    // if (!id) {
    //     var header = header.filter((item) => item.toLowerCase().replace('_', '') !== 'id');
    // }

        return <div className="card">
            <div className="table-name">{name}</div>
            {hasAddNewButton && <div className='add-btn-div'>
                <button onClick={() => {
                    navigate("add")
                }}>Add</button>
            </div>}
            <table className={className}>
                <thead>
                    <tr>
                        {headerNames.map((key) => (
                            <td key={key}>{snake2NameCase(key)}</td>
                        ))}
                        {actions.length > 0 && <td colSpan={actions.length}>Actions</td>}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => {
                        let tempItem = { ...item };
                        !id && delete tempItem.id
                        return <tr key={item.id} className={data.length %2 == 0 ? (index %2 != 0 && 'light-color-row'):(index % 2 == 0 && 'light-color-row')}>
                                    {Object.entries(tempItem).map(([key, value], index) =>
                                        headers.includes(key) && <td key={`${item.id}-${index}`} className={name+" "+key}>{value.toString()}</td>
                                    )}
                                    {actions.length > 0 && <td>
                                        {actions.map((action, index) => {
                                            return <button className="action-btns" key={`${item.id}-action-${index}`} onClick={() => action.handler(item.id)}>{action.name == "Edit"?<CiEdit/>:action.name=="Delete"?<MdDelete/>:action.name}</button>
                                        })}
                                    </td>}
                                </tr>
                    })}
                </tbody>
            </table>
        </div>
};

export default Table;