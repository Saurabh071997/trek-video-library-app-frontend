import { useWindowSize } from "../context/useWindowSize";
// import { useLibrary } from "../context/LibraryProvider";
import { ShowVideos } from "./ShowVideos";
import { ShowVideosInDesktop } from "./ShowVideosInDesktop";
// import { Loader } from "./Loader";

export const VideoDisplay = () => {
//   const {
//     state: { isLoading }
//   } = useLibrary();
  const [, width] = useWindowSize();
  return (
    <div>{width <= 600 ? <ShowVideos /> : <ShowVideosInDesktop />}</div>
  );
}
