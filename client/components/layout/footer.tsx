import Link from "next/link";

export function Footer() {
  return (
    <footer className="container my-2">
      copy rights 2024{" "}
      <Link
        className="underline underline-offset-4"
        href="https://github.com/leelhn2345"
        target="_blank"
      >
        @leelhn2345
      </Link>
    </footer>
  );
}
