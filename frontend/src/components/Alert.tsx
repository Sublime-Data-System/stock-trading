import { useState } from "react";
import { setAlert } from "../services/alertService";

const Alert = () => {
  const [index, setIndex] = useState("");
  const [threshold, setThreshold] = useState("");
  const [direction, setDirection] = useState("above");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setAlert(index, threshold, direction).then((response) => {
      console.log(response.data);
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        placeholder="Index"
      />
      <input
        type="number"
        value={threshold}
        onChange={(e) => setThreshold(e.target.value)}
        placeholder="Threshold"
      />
      <select value={direction} onChange={(e) => setDirection(e.target.value)}>
        <option value="above">Above</option>
        <option value="below">Below</option>
      </select>
      <button type="submit">Set Alert</button>
    </form>
  );
};

export default Alert;
