function VideoSection() {
    return (
      <div className="relative w-full h-screen">
        <video
          className="w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
        >
          <source src="/src/assets/main-video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Welcome to Our Site
          </h2>
        </div>
      </div>
    );
  }
  
  export default VideoSection;