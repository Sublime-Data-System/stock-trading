import Link from "next/link";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Stock Dashboard</h1>
      <Link href="/login">Login</Link> | <Link href="/register">Register</Link>{" "}
      | <Link href="/dashboard">Dashboard</Link> |{" "}
      <Link href="/statistics">Statistics</Link>
    </div>
  );
};

export default Home;
