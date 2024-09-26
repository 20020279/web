import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

const Navbar = ( {userInfo, onSearchLibelium, handleClearSearch} ) => {
    const isToken = localStorage.getItem("token");
    const[searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleSearch = () => {
        //Call API to search
        if(searchQuery){
            onSearchLibelium(searchQuery)
          }
    };

    const onClearSearch = () => {
        handleClearSearch()
        setSearchQuery("");
    };

    return (
        <div className=" bg-white flex items-center justify-between px-6 py-2 drop shadow">
            <h2 className=" text-xl font-medium text-black py-2">LibeliumOnline</h2>
        {isToken && (
            <>
                <SearchBar 
                    value = {searchQuery}
                    onChange={({target}) => {
                        setSearchQuery(target.value);
                    }} 
                    handleSearch={handleSearch}
                    onClearSearch={onClearSearch}
                />

                <ProfileInfo userInfo = {userInfo} onLogout={onLogout}/>
            </>
        )}
        </div>
    );
};

export default Navbar;