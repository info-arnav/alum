import Empty from "../empty";
import LoggedIn from "../loggedIn";

const statusFunction = async function () {
  return LoggedIn();
};

export async function metadata() {
  const status = statusFunction();
  let description = status.LoggedIn
    ? status.data.type == "student"
      ? "Effortlessly manage your recruitment posts on Alum, the NSUT alumni portal. Create, edit, or delete job opportunities, and monitor their status to streamline your hiring process and attract top talent."
      : "Explore exciting job opportunities on Alum, the NSUT alumni portal. Browse and apply for positions posted by esteemed alumni, and kickstart your career with valuable connections in your professional network."
    : "Unlock your career potential with Alum, the NSUT alumni portal. Log in to explore job opportunities posted by alumni, apply for positions, and connect with professionals to boost your career growth and network.";
  return {
    title: "View Recruitments",
    description: description,
    openGraph: {
      title: "View Recruitments",
      description: description,
      url: `${process.env.LINK}recruitment`,
      siteName: "Alum",
      images: [
        {
          url: `${process.env.LINK}logo-background.png`,
          width: 250,
          height: 250,
          alt: "Alum - NSUT Alumni Network Logo",
        },
        {
          url: `${process.env.LINK}logo.png`,
          width: 250,
          height: 193,
          alt: "Alum - NSUT Alumni Network Logo",
        },
      ],
      locale: "en-US",
      type: "website",
    },
    twitter: {
      title: "View Recruitments",
      description: description,
      images: [
        `${process.env.LINK}logo-background.png`,
        `${process.env.LINK}logo.png`,
      ],
    },
  };
}

export default function RecruitmentPage({ children }) {
  const status = statusFunction();
  if (!status.loggedIn) {
    return (
      <>
        <Empty link="/"></Empty>
      </>
    );
  } else {
    if (status.data.type == "student" || status.data.type == "alumni") {
      return <>{children}</>;
    } else {
      return (
        <>
          <Empty link="/"></Empty>
        </>
      );
    }
  }
}