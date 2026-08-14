import { useState } from "react";

export default function Profile() {
  const [dp, setDp] = useState(localStorage.getItem("dp"));

  const upload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      localStorage.setItem("dp", reader.result);
      setDp(reader.result);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="page">
      <h2>Profile</h2>
      {dp && <img src={dp} className="dp" />}
      <input type="file" onChange={upload} />
    </div>
  );
}