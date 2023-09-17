import React from 'react';
import useLocalStorageAuth from '../../hooks/useLocalStorageAuth';

const Home = () => {
    const role = useLocalStorageAuth();
    return (
        role ? <div>Logged in as {role}</div> : <div>Not logged in</div>
    );
};

export default Home;