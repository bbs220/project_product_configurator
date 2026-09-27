import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full h-56 bg-amber-50 text-black">
      <Link href={"/terms-of-service"}>
        <button>Terms Of Service</button>
      </Link>
      <Link href={"/privacypolicy"}>
        <button>Privacy Policy</button>
      </Link>
    </footer>
  );
};
export default Footer;
