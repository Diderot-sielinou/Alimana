'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const testimonials = [
  {
    name: 'Fatima K.',
    role: 'Supermarket Owner, Douala',
    quote:
      'ALIMANA has completely changed the way we run our store. It’s fast, easy to use, and saves us hours every week!',
    image:
      'https://t4.ftcdn.net/jpg/03/53/59/45/360_F_353594594_7P3wleoT2d3NeGP60d1R88q18y7MyWUw.jpg',
  },
  {
    name: 'Jean M.',
    role: 'Pharmacy Manager, Yaoundé',
    quote:
      'We used to struggle with inventory. Now, everything is streamlined, and our team loves it!',
    image:
      'https://about.rogers.com/wp-content/uploads/shutterstock_680606317-scaled-e1650600302475-2048x1367.jpg',
  },
  {
    name: 'Brenda T.',
    role: 'Retail Shop Owner, Bafoussam',
    quote: 'I can track sales and manage products from anywhere. Highly recommend ALIMANA!',
    image: 'https://upload.wikimedia.org/wikipedia/commons/4/43/Nnenne_Iwuji-Eme.jpg',
  },
  {
    name: 'Alain C.',
    role: 'Mini Mart Manager, Limbe',
    quote:
      'No more manual calculations and the stress! ALIMANA helps us stay organized and professional.',
    image:
      'https://img.freepik.com/free-photo/confident-african-businesswoman-smiling-closeup-portrait-jobs-career-campaign_53876-143280.jpg?semt=ais_hybrid',
  },
  {
    name: 'Claudine A.',
    role: 'Beauty Store Owner, Bamenda',
    quote:
      'It feels like I have a full team behind me. The support is top-notch and the tools are amazing.',
    image:
      'https://campusdata.uark.edu/resources/images/articles/2022-02-15_11-14-36-AMChulyndriaLayeDeansSpotlightheadshot.jpg',
  },
  {
    name: 'Eric D.',
    role: 'Grocery Store Owner, Ngaoundéré',
    quote: 'From stock tracking to sales reports, ALIMANA has everything I need in one place.',
    image: 'https://randomuser.me/api/portraits/men/53.jpg',
  },
];

export default function TestimonialSection() {
  return (
    <section id="testimonial" className="py-20 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-12">
          Loved by store owners across Cameroon
        </h2>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true }}
          navigation
          className="pb-10"
        >
          {testimonials.map((testimonial, index) => (
            <SwiperSlide key={index}>
              <div className="bg-card p-6 rounded-2xl border h-full flex flex-col justify-between">
                <p className="mb-6 text-muted-foreground italic">“{testimonial.quote}”</p>
                <div className="flex items-center gap-3 mt-auto">
                  <Avatar>
                    <AvatarImage src={testimonial.image} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
