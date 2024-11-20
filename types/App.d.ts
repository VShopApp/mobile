interface ISkin {
  uuid: string;
  displayName: string;
  themeUuid: string;
  contentTierUuid?: string;
  displayIcon?: string;
  wallpaper?: string;
  assetPath: string;
  chromas: ISkinChroma[];
  levels: ISkinLevel[];
}

interface IAccessoryBuddy {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon?: string;
  assetPath: string;
  levels: IAccessoryBuddyLevel[];
}

interface IAccessoryTitle {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  titleText: string;
  assetPath: string;
}

interface IAccessoryCard {
  uuid: string;
  displayName: string;
  isHiddenIfNotOwned: boolean;
  themeUuid: string;
  displayIcon: string;
  smallArt: string;
  wideArt: string;
  largeArt: string;
  assetPath: string;
}

interface IAccessorySpray {
  uuid: string;
  displayName: string;
  category: string;
  themeUuid: string;
  isNullSpray: boolean;
  hideIfNotOwned: boolean;
  displayIcon: string;
  fullIcon: string;
  fullTransparentIcon: string;
  animationPng: string;
  animationGif: string;
  assetPath: string;
  levels: IAccessorySprayLevel[];
}

interface IAccessoryBuddyLevel {
  uuid: string;
  charmLevel: number;
  hideIfNotOwned: boolean;
  displayName: string;
  displayIcon: string;
  assetPath: string;
}

interface IAccessorySprayLevel {
    uuid: string;
    sprayLevel: number;
    displayName: string;
    displayIcon: string;
    assetPath: string;
}

interface IBundle {
  uuid: string;
  displayName: string;
  displayNameSubText?: string;
  description: string;
  extraDescription?: string;
  promoDescription?: string;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage?: string;
  assetPath: string;
}

interface ISkinChroma {
  uuid: string;
  displayName: string;
  displayIcon?: string;
  fullRender: string;
  swatch?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface ISkinLevel {
  uuid: string;
  displayName: string;
  levelItem?: string;
  displayIcon?: string;
  streamedVideo?: string;
  assetPath: string;
}

interface IShopItem extends ISkin {
  price: number;
}

interface IShopItem2 extends IAccessoryTitle {
  price: number;
}

interface IGalleryItem extends ISkin {
  onWishlist: boolean;
}

interface INightMarketItem extends IShopItem {
  discountedPrice: number;
  discountPercent: number;
}

interface IBundleItem extends IShopItem {
  discountedPrice: number;
}

interface IBundle {
  uuid: string;
  displayName: string;
  description: string;
  extraDescription: any;
  promoDescription: any;
  useAdditionalContext: boolean;
  displayIcon: string;
  displayIcon2: string;
  verticalPromoImage: string;
  assetPath: string;
  price: number;
  items: IBundleItem[];
}

interface IBalance {
  vp: number;
  rad: number;
  fag: number;
}

interface IProgress {
  level: number;
  xp: number;
}
