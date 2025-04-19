"use client";
{/*import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const [eventImages, setEventImages] = useState<{ id: number; src: string; alt: string }[]>([]);
  
  const galleryImages = [
    {
      id: 1,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.46_e11e5784.jpg-8P2vayVfHFC99cDhW3XJCklC7vKJsu.jpeg",
      alt: "Indo-African Scholarship Event",
      caption: "Officials and dignitaries at an Indo-African Scholarship event",
    },
    {
      id: 2,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.45_e60008c4.jpg-Cn5796BocsVk62Fn5N5Jf1rQzyfgdD.jpeg",
      alt: "Collaborative meeting between Indian and African officials",
      caption: "Representatives from India and Africa discussing scholarship opportunities",
    },
    {
      id: 3,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.44_d7b1d390.jpg-VC2PlTDLbjWutAVGhEgfveE74nHvVF.jpeg",
      alt: "GSUA Summit and World Press Conference",
      caption: "GSUA '25 Summit Awards & Expo announcement in London",
    },
    {
      id: 4,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.45_2539793f.jpg-sQhwS3D8MJn7vqkksyk6QdA7WCo9BJ.jpeg",
      alt: "Indian Open Polo Championship",
      caption: "Partnership meeting at the Indian Open Polo Championship",
    },
    {
      id: 5,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.44_4b37db4f.jpg-ScDqqphzS3uImUhoHk81xnzhd3X7rE.jpeg",
      alt: "10,000 India-Africa Scholarship Awards",
      caption: "Official promotional banner for the 10,000 India-Africa Scholarship Awards",
    },
    {
      id: 6,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.46_c65174d9.jpg-7hh8WDF8UboehDJEc6GO8lfPhtfXXx.jpeg",
      alt: "Delegates at Indo-African event",
      caption: "International delegates at an India-Africa collaboration event",
    },
    {
      id: 7,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.46_40aabe5d.jpg-GgJ5Dspa0NQm6nYK8YKGvMiHMjmuq3.jpeg",
      alt: "Officials at formal gathering",
      caption: "Representatives from African and Indian educational institutions",
    },
    {
      id: 8,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.45_ccf44aea.jpg-RPx16RoPZ7s8YFwadYVAXBdb74uxyQ.jpeg",
      alt: "Collaborative meeting",
      caption: "Cross-cultural exchange at the scholarship program launch",
    },
    {
      id: 9,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.45_a3f76d09.jpg-A2qtoFy0NnxBPBrzUMwKOZf8yz52Rc.jpeg",
      alt: "Evening reception for scholarship program",
      caption: "Evening networking event for the scholarship initiative",
    },
    {
      id: 10,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.46_8100385c.jpg-5GIps9uebAxdPuL8a3eKXrulvGCzS6.jpeg",
      alt: "Partnership at sporting event",
      caption: "Building educational ties at the Indian Open Polo Championship",
    },
    {
      id: 1,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.46_e11e5784.jpg-8P2vayVfHFC99cDhW3XJCklC7vKJsu.jpeg",
      alt: "Indo-African Scholarship Event",
      caption: "Officials and dignitaries at an Indo-African Scholarship event",
    },
    {
      id: 2,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.45_e60008c4.jpg-Cn5796BocsVk62Fn5N5Jf1rQzyfgdD.jpeg",
      alt: "Collaborative meeting between Indian and African officials",
      caption: "Representatives from India and Africa discussing scholarship opportunities",
    },
    {
      id: 3,
      src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202025-03-24%20at%2022.17.44_d7b1d390.jpg-VC2PlTDLbjWutAVGhEgfveE74nHvVF.jpeg",
      alt: "GSUA Summit and World Press Conference",
      caption: "GSUA '25 Summit Awards & Expo announcement in London",
    },
  ];
  
  // Manually loop through each of the 182 images using your file naming pattern.
  const eventImagesManual: { id: number; src: string; alt: string }[] = [];
  for (let i = 1; i <= 179; i++) {
    eventImagesManual.push({
      id: i,
      src: encodeURI(`/gallery/1 (${i}).JPG`),
      alt: `Scholarship Event Image ${i}`,
    });
  }
  
  // Set manual images to state (if needed for further manipulation)
  useEffect(() => {
    setEventImages(eventImagesManual);
  }, []);
  
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4">
        {/* 
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">Gallery</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Explore images from our events, partnerships, and initiatives fostering educational collaboration between
            India and African nations.
          </p>
        </div>
  
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryImages.map((image, index) => (
            <div key={`gallery-${index}`} className="group relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700 hover:border-brand-orange transition-all duration-300">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover gallery-image" />
              </div>
              <div className="p-4 bg-gray-800/90 backdrop-blur-sm">
                <p className="text-gray-200 text-sm">{image.caption}</p>
              </div>
            </div>
          ))}
        </div>
  
        <div className="mt-16 text-center">
          <p className="text-gray-300 mb-6">
            These images capture the spirit of collaboration and educational diplomacy that drives the Indo-African Scholarship initiative.
          </p>
          <Button asChild className="bg-brand-orange hover:bg-orange-600 text-white">
            <Link href="/about-us">Learn More About Our Initiative</Link>
          </Button>
        </div>
        */}
        {/* New Section for INDIA-AFRICA SCHOLARSHIP AWARDS */}
        {/*<div className="mt-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">India-Africa Scholarship Awards 2025</h2>
          <p className="text-lg text-gray-300 mb-8">
            A special event showcasing the achievements and partnerships in education.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {eventImages.map((image, index) => (
              <div key={`event-${index}`} className="group relative overflow-hidden rounded-xl bg-gray-800/50 border border-gray-700 hover:border-brand-orange transition-all duration-300">
                <div className="aspect-[4/3] relative overflow-hidden">
                  <Image src={image.src || "/placeholder.svg"} alt={image.alt} fill className="object-cover gallery-image" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
*/}



import { motion } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { Card } from "@/components/ui/card";

type GalleryItem = {
  id: number;
  title: string | null;
  description: string | null;
  image?: string;
  video?: string;
};

export default function GalleryPage() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Dynamically generate images using a loop
  const eventImagesManual: GalleryItem[] = [];
  for (let i = 1; i <= 179; i++) {
    eventImagesManual.push({
      id: i,
      title: null,
      description: null,
      image: encodeURI(`/gallery/1 (${i}).JPG`),
    });
  }

  // Array for videos
  const videoItems: GalleryItem[] = [
    { id: 180, title: null, description: null, video: "/gallery/v1.mp4" },
    { id: 181, title: null, description: null, video: "/gallery/v2.mp4" },
    { id: 182, title: null, description: null, video: "/gallery/v3.mp4" },
  ];

  const handleItemClick = (item: GalleryItem) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-3xl mx-auto text-center mb-16"
        >
          <h3 className="text-purple-400 font-bold mb-4">
            Business Press India x AASGON Presents
          </h3>
          <h1 className="text-5xl font-extrabold mb-4">
            Indo-African Scholarships Launch Event
          </h1>
          <p className="text-gray-400 text-lg">
            Explore the highlights of our event through images and videos.
          </p>

          {/* Hero Image */}
          <div className="relative w-full h-64 md:h-96 mb-8">
            <Image
              src="/gallery/1.jpg"
              alt="Indo-African Scholarships Launch Event"
              fill
              className="object-cover rounded-lg shadow-lg"
            />
          </div>
        </motion.div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Render Videos */}
          {videoItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: (index + eventImagesManual.length) * 0.1 }}
              className="cursor-pointer group"
              onClick={() => handleItemClick(item)}
            >
              <Card className="overflow-hidden bg-gray-900/50 border-gray-800 group-hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  {item.video && (
                    <video
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300"
                    >
                      <source src={item.video} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
          {/* Render Images */}
          {eventImagesManual.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="cursor-pointer group"
              onClick={() => handleItemClick(item)}
            >
              <Card className="overflow-hidden bg-gray-900/50 border-gray-800 group-hover:shadow-lg transition-shadow duration-300">
                <div className="relative h-64">
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.title || `Gallery Item ${item.id}`}
                      fill
                      className="object-cover transition-transform group-hover:scale-105 duration-300"
                    />
                  )}
                </div>
              </Card>
            </motion.div>
          ))}

        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={closeModal}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-4xl w-full bg-gray-900 rounded-lg shadow-lg overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/20 text-white hover:bg-black/40 transition-colors"
              onClick={closeModal}
            >
              ✕
            </button>
            <div className="relative h-[500px]">
              {selectedItem.video && (
                <video
                  src={selectedItem.video}
                  controls
                  className="min-w-full min-h-full object-cover"
                />
              )}
              {selectedItem.image && (
                <Image
                  src={selectedItem.image}
                  alt={selectedItem.title || `Gallery Item ${selectedItem.id}`}
                  fill
                  className="object-cover"
                />
              )}
            </div>
            <div className="p-6">
              <h3 className="text-2xl font-bold mb-2">
                {selectedItem.title || null}
              </h3>
              {selectedItem.description && (
                <p className="text-gray-400">{selectedItem.description || null}</p>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}