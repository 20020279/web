import React from "react";
import { MdOutlinePushPin } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import moment from "moment";

const LibeliumCard = ({
    sensor,
    timestamp,
    value,
    isPinned,
    onDelete,
    onPinNote,
}) => {
    return (
        <div className="border rounded p-4 bg-white hover:shadow-xl transition-all ease-in-out">
            <div className="flex items-center justify-between">
                <div>
                    <h6 className="text-sm font-medium"> {sensor} </h6>
                    <span className="text-xs text-slate-500"> {moment(timestamp).format ('DD MMM YYY')} </span>
                </div>

                <MdOutlinePushPin className={`icon-btn ${isPinned ? 'text-primary' : 'text-slate-300'}`} onClick={onPinNote} />

            </div>

            <p className="text-xs text-slate-600 mt-2"> {value?.toString().slice(0,60)} </p>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                    <MdDelete 
                    className="icon-btn hover:text-red-500" 
                    onClick={onDelete} 
                    />
                </div>
            </div>
        </div>      
    );
};

export default LibeliumCard;