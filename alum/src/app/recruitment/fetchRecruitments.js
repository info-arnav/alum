"use client";

import { useEffect, useState } from "react";
import Loading from "../home/loading";
import Error from "../error";
import Link from "next/link";
import Apply from "../view/recruitment/[id]/apply";

export default function DataFetch({ email }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [data, setData] = useState("");
  const fetcher = async () => {
    const fetchedData = await fetch("/api/find-recruitments", {
      method: "POST",
      body: JSON.stringify({
        auth_email: email,
      }),
    }).then((e) => e.json());
    if (data.error) {
      setError(true);
      setLoading(false);
    } else {
      setError(false);
      setData(fetchedData.data);
      setLoading(false);
    }
  };
  useEffect(() => {
    fetcher();
  }, []);
  return (
    <>
      {loading ? (
        <Loading></Loading>
      ) : error ? (
        <Error></Error>
      ) : (
        <>
          {data.map((e) => {
            return (
              <Link key={e._id} href={`/view/recruitment/${e._id}`}>
                {e.title},{e.company}, {e.description}
                <Apply
                  recruitment={e._id}
                  user={email}
                  applicants={e.applicants}
                ></Apply>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}
