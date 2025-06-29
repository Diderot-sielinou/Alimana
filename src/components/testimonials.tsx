import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Fatima K.',
    role: 'Supermarket Owner, Douala',
    quote:
      'ALIMANA has completely changed the way we run our store. It’s fast, easy to use, and saves us hours every week!',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Jean M.',
    role: 'Pharmacy Manager, Yaoundé',
    quote:
      'We used to struggle with inventory. Now, everything is streamlined, and our team loves it!',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Brenda T.',
    role: 'Retail Shop Owner, Bafoussam',
    quote: 'I can track sales and manage products from anywhere. Highly recommend ALIMANA!',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
];

export default function TestimonialSection() {
  return (
    <section id="#testimonial" className="py-20 bg-background text-foreground">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold sm:text-4xl mb-12">
          Loved by store owners across Cameroon
        </h2>
        <div className="grid gap-10 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-card p-6 rounded-2xl border">
              <div className="mb-4 text-muted-foreground italic">“{testimonial.quote}”</div>
              <div className="flex items-center justify-center gap-3 mt-6">
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
          ))}
        </div>
      </div>
    </section>
  );
}
