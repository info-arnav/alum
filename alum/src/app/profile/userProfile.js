"use client";

import { useEffect, useState } from "react";
import Profile from "./components/profile";
import EditProfile from "./components/editProfile";
import Error from "../error";
import Loading from "../home/loading";
import Portfolio from "./components/portfolio";

export default function UserProfile({ data, link }) {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(true);
  const [error, setError] = useState(false);
  const [show, setShow] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    const getDoc = async () => {
      const res = await fetch(`/api/get-user-info`, {
        method: "POST",
        body: JSON.stringify({
          auth_email: data.data.email,
          email: data.data.email,
        }),
        cache: "no-cache",
      }).then((e) => e.json());
      if (res.error) {
        setError(true);
        setLoading(false);
      } else {
        [
          [res.data.education, "education"],
          [res.data.occupation, "occupation"],
          [res.data.projects, "projects"],
          [res.data.honors, "honors"],
          [res.data.applications, "applications"],
        ].forEach((e) => {
          try {
            res.data[e[1]] = JSON.parse(e[0]);
          } catch {
            res.data[e[1]] = [];
          }
        });
        setError(false);
        setUserData(res.data);
        setLoading(false);
      }
    };
    getDoc();
  }, [refresh]);
  useEffect(() => {}, [show, userData]);
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Error></Error>
      ) : (
        <div className="profile-page">
          <div className="profile-block">
            <Profile
              data={userData}
              link={link}
              email={data.data.email}
            ></Profile>
            <button onClick={() => setShow(true)}>Edit Profile</button>
          </div>
          {show && (
            <EditProfile
              data={userData}
              link={link}
              email={data.data.email}
              setShow={setShow}
              setRefresh={setRefresh}
              refresh={refresh}
              setData={setUserData}
            ></EditProfile>
          )}
          <Portfolio
            data={userData}
            email={data.data.email}
            setRefresh={setRefresh}
            refresh={refresh}
            setData={setUserData}
          ></Portfolio>
        </div>
      )}
    </>
  );
}
