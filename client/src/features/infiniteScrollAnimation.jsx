
import { Img_Logo, Img_Logo_BIG } from "../components/Global/logo";
import { useEffect,useRef } from "react";

export function InfiniteScrollAnimation() {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const firstBatchRef = useRef(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    const container =  containerRef.current;
    const content =  contentRef.current;
    const firstBatch = firstBatchRef.current;

    if (!container || !content || !firstBatch) return;

    let scrollAmount = 0;
    let animationFrame;
    const speed = 1;

    const scroll = () => {
      if (!isPausedRef.current) {
        scrollAmount += speed;

        const resetPoint = firstBatch.offsetWidth;

        if (scrollAmount >= resetPoint) {
          scrollAmount -= resetPoint;
        }

        content.style.transform = `translateX(-${scrollAmount}px)`;
      }

      animationFrame = requestAnimationFrame(scroll);
    };

    animationFrame = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative flex items-center justify-center w-full h-full overflow-hidden rounded-[10px] 
      col-start-1 col-end-4 row-start-2 row-end-2">

      <div
        ref={contentRef}
        className="flex items-center justify-center gap-8 min-w-max ">

        {/* Batch items */}
        {[...Array(10)].map((_, i) => (
          <div
            key={i}
            ref={i === 0 ? firstBatchRef : null}
            className="flex items-center justify-center text-[16.08rem]  w-auto h-auto rounded-[10px] shrink-0">
                <Img_Logo_BIG/>
          </div>
        ))}
      </div>
    </div>
  );


}
