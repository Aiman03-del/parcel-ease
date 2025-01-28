import bannerVid from "../../assets/Videos/banner.mp4";

const Banner = () => {
  return (
    <div className="py-16 min-h-screen">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
      >
        <source src={bannerVid} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Overlay and Content */}
      <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-60 flex items-center justify-center">
        <div className="flex flex-col items-center p-10 rounded-lg shadow-lg">
          <h1 className="text-5xl text-white font-extrabold mb-4 drop-shadow-md">
            Welcome to Our Platform
          </h1>
          <p className="text-lg text-white mb-8 drop-shadow-md">
            Discover amazing content and opportunities.
          </p>
          <div className="relative bg-gradient-to-br from-blue-400 to-blue-500 rounded-full p-3 grid place-content-center z-0 max-w-lg mx-2">
            <div className="relative w-full rounded-full bg-gradient-to-br from-blue-200 to-blue-300 p-1 flex items-center">
              <input
                className="p-3 w-full bg-gradient-to-br from-blue-200 to-blue-300 border-0 text-blue-600 text-xl rounded-full focus:outline-none focus:bg-gradient-to-br focus:from-white focus:to-blue-200"
                type="text"
                placeholder="Search here..."
              />
              <svg
                viewBox="0 0 24 24"
                className="w-12 h-12 border-l-2 border-transparent border-white rounded-full pl-3 pr-2 cursor-pointer hover:border-2 hover:border-white"
              >
                <g>
                  <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
