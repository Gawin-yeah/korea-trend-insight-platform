import { instagramAuthorizedAdapter } from "@/lib/sources/instagram-authorized";
import { naverAdapter } from "@/lib/sources/naver";
import { threadsAuthorizedAdapter } from "@/lib/sources/threads-authorized";
import { xApiAdapter } from "@/lib/sources/x-api";
import { youtubeAdapter } from "@/lib/sources/youtube";

export const sourceRegistry = [
  youtubeAdapter,
  instagramAuthorizedAdapter,
  threadsAuthorizedAdapter,
  xApiAdapter,
  naverAdapter
];
