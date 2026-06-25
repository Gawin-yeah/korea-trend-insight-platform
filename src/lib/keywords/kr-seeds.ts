import type { Category, Platform } from "@/types/trend";

export interface KeywordSeed {
  keyword: string;
  category: Category;
  intent: string;
  tags: string[];
}

export const keywordSeedCatalog: Record<Category, KeywordSeed[]> = {
  beauty: [
    { keyword: "글로우 쿠션", category: "beauty", intent: "底妆趋势", tags: ["cushion", "glow", "base"] },
    { keyword: "유리알 피부", category: "beauty", intent: "水光肌表达", tags: ["glass-skin", "skin"] },
    { keyword: "톤업크림", category: "beauty", intent: "肤色修饰", tags: ["tone-up", "skincare"] },
    { keyword: "올영추천", category: "beauty", intent: "Olive Young 热门推荐", tags: ["olive-young", "retail"] },
    { keyword: "세미매트", category: "beauty", intent: "半哑光妆感", tags: ["semi-matte", "makeup"] }
  ],
  photography: [
    { keyword: "인생네컷 포즈", category: "photography", intent: "人生四格姿势", tags: ["life4cuts", "pose"] },
    { keyword: "셀카 각도", category: "photography", intent: "自拍角度", tags: ["selfie", "angle"] },
    { keyword: "사진맛집", category: "photography", intent: "出片场景", tags: ["photogenic", "place"] },
    { keyword: "감성사진", category: "photography", intent: "氛围感照片", tags: ["mood", "aesthetic"] },
    { keyword: "커플포즈", category: "photography", intent: "情侣姿势", tags: ["couple", "pose"] }
  ],
  retouching: [
    { keyword: "쿨톤 보정", category: "retouching", intent: "冷调修图", tags: ["cool-tone", "preset"] },
    { keyword: "필터 추천", category: "retouching", intent: "滤镜推荐", tags: ["filter", "preset"] },
    { keyword: "얼굴 보정", category: "retouching", intent: "脸型修饰", tags: ["face-retouch", "beauty-edit"] },
    { keyword: "색감 보정", category: "retouching", intent: "色调校正", tags: ["color-grade", "edit"] },
    { keyword: "보정 템플릿", category: "retouching", intent: "修图模板", tags: ["template", "preset"] }
  ],
  ai_play: [
    { keyword: "AI 증명사진", category: "ai_play", intent: "AI 证件照", tags: ["ai-photo", "id-photo"] },
    { keyword: "AI 프로필", category: "ai_play", intent: "AI 头像", tags: ["ai-profile", "portrait"] },
    { keyword: "AI 필터", category: "ai_play", intent: "AI 滤镜", tags: ["ai-filter", "effect"] },
    { keyword: "AI 화보", category: "ai_play", intent: "AI 写真", tags: ["ai-editorial", "portrait"] },
    { keyword: "생성형 놀이", category: "ai_play", intent: "生成式玩法", tags: ["genai", "social"] }
  ],
  fashion: [
    { keyword: "발레코어", category: "fashion", intent: "芭蕾风", tags: ["balletcore", "style"] },
    { keyword: "출근룩", category: "fashion", intent: "通勤穿搭", tags: ["office-look", "daily"] },
    { keyword: "캠퍼스룩", category: "fashion", intent: "校园穿搭", tags: ["campus", "style"] },
    { keyword: "모노톤 코디", category: "fashion", intent: "单色搭配", tags: ["mono-tone", "coordi"] },
    { keyword: "뮤신사 추천", category: "fashion", intent: "Musinsa 热门风格", tags: ["musinsa", "retail"] }
  ],
  other: [
    { keyword: "밈", category: "other", intent: "泛韩语梗", tags: ["meme"] }
  ]
};

export function getAllKeywordSeeds(limitPerCategory = 5): KeywordSeed[] {
  return (Object.values(keywordSeedCatalog) as KeywordSeed[][]).flatMap((items) =>
    items.slice(0, limitPerCategory)
  );
}

export function getPlatformKeywordSeeds(platform: Platform): KeywordSeed[] {
  const all = getAllKeywordSeeds();

  if (platform === "threads_authorized") {
    return all.filter((seed) =>
      ["photography", "retouching", "ai_play", "beauty"].includes(seed.category)
    );
  }

  if (platform === "instagram_authorized") {
    return all.filter((seed) =>
      ["beauty", "photography", "retouching", "fashion", "ai_play"].includes(
        seed.category
      )
    );
  }

  return all;
}

