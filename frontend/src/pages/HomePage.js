import react from "react";
import axios from "axios";
import { useEffect, useState } from "react";

const HomePage = () => {
    const [data, setData] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/users')
            .then(res => setData(res.data.message))
            .catch(err => console.log(err));
    },[]);

    return(
        <div>
            <h1> Home Page </h1>
            <p> API Says: {data} </p>
        </div>
    )
};

export default HomePage;