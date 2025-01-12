import React from "react";

const DeleteIcon = () => {
  const deleteIcon = import.meta.env.VITE_APP_DELETE_ICON;
  return <img src={deleteIcon} alt="" />;
};

export default DeleteIcon;
