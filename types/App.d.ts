interface SkinShopItem extends ValorantSkin {
  price: number;
}

interface AccessoryShopItem {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  price: number;
}

interface GalleryItem extends ValorantSkin {
  onWishlist: boolean;
}

interface NightMarketItem extends SkinShopItem {
  discountedPrice: number;
  discountPercent: number;
}

interface BundleShopItem extends ValorantBundle {
  price: number;
  items: SkinShopItem[];
}

interface Balance {
  vp: number;
  rad: number;
  fag: number;
}

interface Progress {
  level: number;
  xp: number;
}
