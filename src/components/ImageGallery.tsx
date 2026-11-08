import { useState } from "react"
import { ChevronLeftIcon, ChevronRightIcon } from "./icons"

const ImageGallery = ({ images, title }: { images: string[]; title: string }) => {
  const [index, setIndex] = useState(0)

  if (images.length === 0) {
    return <div className="grid h-72 place-items-center rounded-2xl bg-nest-800 text-nest-300">No photos</div>
  }

  const go = (d: number) => setIndex((i) => (i + d + images.length) % images.length)

  return (
    <div>
      <div className="relative overflow-hidden rounded-2xl bg-nest-800">
        <img
          src={images[index]}
          alt={`${title}, photo ${index + 1} of ${images.length}`}
          className="aspect-[16/10] w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-nest-950/70 text-sand-100 hover:bg-nest-950"
            >
              <ChevronLeftIcon />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-nest-950/70 text-sand-100 hover:bg-nest-950"
            >
              <ChevronRightIcon />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-nest-950/70 px-2.5 py-1 text-xs font-semibold text-sand-100">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-2 grid grid-cols-5 gap-2">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index}
              className={`overflow-hidden rounded-lg ring-2 transition ${i === index ? "ring-sand-400" : "ring-transparent opacity-70 hover:opacity-100"}`}
            >
              <img src={src} alt="" loading="lazy" className="h-16 w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ImageGallery