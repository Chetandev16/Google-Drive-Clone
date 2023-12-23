import React from "react";
import { PropagateLoader } from "react-spinners";

const Loadar = () => {
  return (
    <div className="h-screen w-screen absolute top-0 left-0 flex justify-center items-center">
      <PropagateLoader color="#9ec3f9" size={20} />
    </div>
  );
};

export default Loadar;
