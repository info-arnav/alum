"use client";

import Loading from "@/app/home/loading";
import { useEffect, useState } from "react";

export default function Applicants({ email, id }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [error, setError] = useState(false);
  const [subLoading, setSubLoading] = useState(false);
  let recruitsArray = [];
  let otherArray = [];
  const onSubmit = async () => {
    setError(false);
    setSubLoading(true);
    let name, position;
    const res = await fetch(`/api/get-post-meta-data`, {
      method: "POST",
      body: JSON.stringify({
        id: id,
      }),
      cache: "no-cache",
    }).then((e) => e.json());
    position = res.data.title;
    name = res.data.company;
    await fetch(`/api/recruitment-close`, {
      method: "POST",
      body: JSON.stringify({
        _id: id,
        auth_email: email,
        emails: otherArray,
        recruited: recruitsArray,
        company: name,
        position: position,
      }),
      cache: "no-cache",
    })
      .then((e) => e.json())
      .then((e) => {
        if (e.error) {
          setError(true);
          setSubLoading(false);
        } else {
          location.replace("/recruitment");
          setError(false);
          setSubLoading(false);
        }
      });
  };
  const fetcher = async () => {
    const tempData = await fetch(`/api/get-recruitment-status`, {
      method: "POST",
      body: JSON.stringify({
        _id: id,
        auth_email: email,
      }),
      cache: "no-cache",
    }).then((e) => e.json());
    let updatedData = tempData.data.data.recruitments[0].applicants;
    otherArray = updatedData;
    setData(updatedData);
    setLoading(false);
  };
  useEffect(() => {
    fetcher();
  }, []);
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : (
        <>
          <form>
            {data ? (
              data.map((e) => {
                return (
                  <>
                    <input
                      type="checkbox"
                      onChange={(f) => {
                        if (f.target.checked) {
                          recruitsArray.push(e);
                          otherArray.splice(recruitsArray.indexOf(e), 1);
                        } else {
                          recruitsArray.splice(recruitsArray.indexOf(e), 1);
                          otherArray.push(e);
                        }
                      }}
                    />
                    <div key={e}>{e}</div>
                  </>
                );
              })
            ) : (
              <div>No Applicants</div>
            )}
          </form>
          {error && "Some error occured"}
          <button onClick={onSubmit} disabled={subLoading}>
            {subLoading ? "Processing..." : "Recruit"}
          </button>
        </>
      )}
    </>
  );
}
