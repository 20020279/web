import React, {  useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import LibeliumCard from "../../components/Cards/LibeliumCard";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Toast from "../../components/ToastMessage/Toast";



const Home = () => {
    
    const [allLibeliums, setAllLibeliums] = useState([])
    const [isSearch, setIsSearch] = useState(false);
    const [userInfo, setUserInfo] = useState(null);
    const [showToastMsg, setShowToastMsg] = useState({
        isShown: false,
        message: "",
        type: "add",
      });

    const navigate = useNavigate();

    const showToastMessage = (message, type) => {
        setShowToastMsg({
          isShown: true,
          message: message,
          type,
        });
      };
    
      const handleCloseToast = () => {
        setShowToastMsg({
          isShown: false,
          message: "",
        });
      };

    //get user info
    const getUserInfo = async () => {
        try {
            const response = await axiosInstance.get("/get-user");
            
            if (response.data && response.data.user ) {
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
            
            if (response.data && response.data.libeliumData) {
                setAllLibeliums(response.data.libeliumData);
                console.log(response.data.libeliumData)
            }
        } catch (error) {
            console.log("An unexpected error has occured. Please try again.");
        }
    };

    //delete data
    const deleteLibelium = async (data) => {
        const libeliumId = data._id;
        try {
          const response = await axiosInstance.delete("/delete-libelium/" + libeliumId);
    
          if (response.data && !response.data.error) {
            showToastMessage("Delete Successfully", "delete");
            getAllNotes();
          }
        } catch (error) {
          console.log("An unexpected error occurred. Please try again.");
        }
      };

        // Search for a Note
    const onSearchLibelium = async (query) => {
        try {
            const response = await axiosInstance.get("/search-libelium", {
            params: { query },
        });

        if (response.data && response.data.libeliumData) {
            setIsSearch(true);
            setAllLibeliums(response.data.libeliumData);
        }
        } catch (error) {
        console.log("An unexpected error occurred. Please try again.");
        }
    };

    const updateIsPinned = async (libeliumData) => {
        const libeliumId = libeliumData._id;
    
        try {
          const response = await axiosInstance.put(
            "/update-libelium-pinned/" + libeliumId,
            {
              isPinned: !libeliumData.isPinned,
            }
          );
    
          if (response.data && response.data.libeliumData) {
            showToastMessage("Updated Successfully", "update");
            getAllLibeliums();
          }
        } catch (error) {
          console.log("An unexpected error occurred. Please try again.");
        }
      };

    const handleClearSearch = () => {
        setIsSearch(false);
        getAllLibeliums();
      };

    useEffect(() => {
        getAllLibeliums()
        getUserInfo();
        return () => {};
    }, []);

    return (
        <>
            <Navbar 
            userInfo={userInfo} 
            onSearchLibelium={onSearchLibelium}
            handleClearSearch={handleClearSearch}
            />

            {allLibeliums.length > 0 && (
                <div className="container mx-auto">
                {isSearch && (
                    <h3 className="text-lg font-medium mt-5">Search Results</h3>
                )}
                    <div className="grid grid-cols-3 gap-4 mt-8">

                        {allLibeliums.map((item) => {
                            return (
                                <LibeliumCard 
                                key={item._id}
                                sensor= {item.sensor}
                                timestamp= {item.timestamp}
                                value= {item.value}
                                isPinned={item.isPinned} 
                                onDelete={() => deleteLibelium(item)}
                                onPinNote={() => updateIsPinned(item)}
                                />
                            );
                        })}    
                    </div> 
                </div>   
            )};

            <Toast
                isShown={showToastMsg.isShown}
                message={showToastMsg.message}
                type={showToastMsg.type}
                onClose={handleCloseToast}
            />
        </>
    );
};

export default Home;