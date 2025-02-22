/* eslint-disable no-unused-vars */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules"; import "swiper/css"; 
import "swiper/css/navigation";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import reviewsImage from "../../assets/images/reviews.png";
import reviewPerson1 from "../../assets/images/reviewPerson1.jpg";
import reviewPerson2 from "../../assets/images/reviewPerson2.jpg";

const reviews = [
  {
    id: 1,
    message: "Parcel Ease has made my life so much easier. Highly recommend!",
    image: reviewPerson1,
    name: "John Doe",
  },
  {
    id: 2,
    message: "Excellent service and fast delivery. Very satisfied!",
    image: reviewPerson2,
    name: "Jane Smith",
  },
];

const Reviews = () => {
  return (
    <div className="reviews-container mx-auto p-8 rounded-lg shadow-lg flex flex-col md:flex-row items-center space-y-8 md:space-y-0 md:space-x-8">
      <div className="w-full md:w-1/2 mb-4 md:mb-0">
        <h2 className="text-8xl font-semibold mb-8 text-center md:text-left">
          What customers say about us
        </h2>
        
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          navigation={{ nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }}
          modules={[Navigation]}
          className="relative"
          autoplay={{ delay: 3000 }} 
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
                <img
                  className="w-20 h-20 rounded-full object-cover"
                  src={review.image}
                  alt={review.name}
                />
                <div>
                  <p className="text-lg font-medium text-center md:text-left">
                    {review.message}
                  </p>
                  <p className="text-sm mt-2 text-center md:text-left">
                    - {review.name}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center">
        <img
          src={reviewsImage}
          alt="Reviews"
          className="h-48 w-48 md:h-96 md:w-96 object-cover rounded-lg"
        />
      </div>
    </div>
  );
};

export default Reviews;