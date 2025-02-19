import bannerVid from "../../assets/Videos/banner.mp4";

const Banner = () => {
  return (
    <div className="relative py-16 min-h-screen">
      <BackgroundVideo />
      <OverlayContent />
    </div>
  );
};

const BackgroundVideo = () => (
  <video
    className="absolute top-0 left-0 w-full h-full object-cover"
    autoPlay
    loop
    muted
  >
    <source src={bannerVid} type="video/mp4" />
    Your browser does not support the video tag.
  </video>
);

const OverlayContent = () => (
  <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
    <div className="flex flex-col items-center p-10 rounded-lg shadow-lg max-w-lg mx-4 md:mx-10">
      <Header />
      <Description />
      <SearchBar />
    </div>
  </div>
);

const Header = () => (
  <h1 className="text-3xl md:text-5xl text-white font-extrabold mb-4 drop-shadow-md text-center">
    Welcome to Our Platform
  </h1>
);

const Description = () => (
  <p className="text-base md:text-lg text-white mb-8 drop-shadow-md text-center">
    Discover amazing content and opportunities.
  </p>
);

const SearchBar = () => (
  <div className="relative">
    <input
      placeholder="Search..."
      className="input shadow-lg focus:border-2 border-gray-300 px-5 py-3 rounded-xl w-56 transition-all focus:w-64 outline-none"
      name="search"
      type="search"
    />
    <SearchIcon />
  </div>
);

const SearchIcon = () => (
  <svg
    className="size-6 absolute top-3 right-3 text-gray-500"
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
      strokeLinejoin="round"
      strokeLinecap="round"
    ></path>
  </svg>
);

export default Banner;
