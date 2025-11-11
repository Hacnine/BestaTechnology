import React from "react";
import { useParams } from "react-router-dom";
import TrimsAndAccessoriesForm from "./TrimsAndAccessoriesForm";

const TrimsEditPage: React.FC = () => {
  const { id } = useParams();
  const numericId = id ? Number(id) : null;
  return <TrimsAndAccessoriesForm id={numericId} />;
};

export default TrimsEditPage;
