import React from "react";
import { useParams } from "react-router-dom";
import TrimsAndAccessoriesShow from "./TrimsAndAccessoriesShow";

const TrimsShowPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : 0;
  return <TrimsAndAccessoriesShow id={numericId} />;
};

export default TrimsShowPage;
