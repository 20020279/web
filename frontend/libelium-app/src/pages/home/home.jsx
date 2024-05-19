import React, {  useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LibeliumCard from "../../components/Cards/LibeliumCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";



const Home = () => {
    

    const [allLibeliums, setAllLibeliums] = useState([])
    const [userInfo, setUserInfo] = useState(null);

    const navigate = useNavigate();

    //get user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            if (response.data && response.data.user) {
                setUserInfo(response.data.user);
            }
        } catch (error) {
            if(error.response.status === 401) {
                localStorage.clear();
                navigate("/login");
            }
        }
    };

    // get all libelium data
    const getAllLibeliums = async () => {
        try {
            const response = await axiosInstance.get("/get-all-libelium");

            if (response.data && response.data.libeliums) {
                setAllLibeliums (response.data.libeliums);
            }
        } catch (error) {
            console.log("An unexpected error has occured. Please try again.");
        }
    };

    useEffect(() => {
        getAllLibeliums()
        getUserInfo();
        return () => {};
    }, []);

    return (
        <>
            <Navbar userInfo={userInfo} />

            <div className="container mx-auto">
                <div className="grid grid-cols-3 gap-4 mt-8">

                    {allLibeliums.map((item, index) => {
                        <LibeliumCard 
                         key = {item._id}
                         sensor= {item.sensor}
                         timestamp= {item.timestamp}
                         value= {item.value}
                         isPinned={item.isPinned} 
                         onDelete={() => {}}
                         onPinNote={() => {}}
                        />
                    })}    
                </div>
            </div>   
        </>       
                 
    );
};

export default Home;