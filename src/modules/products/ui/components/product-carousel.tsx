import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

export const ProductCarousel = () => {
  const images = Array.from({ length: 5 });

  return (
    <div>
      <Carousel className="w-full">
        <CarouselContent>
          {images.map((_, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square p-1">
                <Image
                  src={"/placeholder.png"}
                  alt={"Product Image"}
                  className="rounded-md object-cover"
                  fill
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-5" />
        <CarouselNext className="right-5" />
      </Carousel>
      <div className="no-scrollbar overflow-x-auto">
        <div className="mt-3 flex w-max gap-3">
          {images.map((_, index) => (
            <div key={index} className="relative aspect-square w-20">
              <Image
                src={"/placeholder.png"}
                alt={"Product Image"}
                className="rounded-md object-cover"
                fill
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
