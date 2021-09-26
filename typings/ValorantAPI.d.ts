interface user {
  name: string;
  loading: boolean;
  accessToken: string;
  entitlementsToken: string;
  idtoken: string;
  expiresIn: number;
  region: string;
  id: string;
}

interface singleItem {
  uuid: string;
  displayName: string;
  displayIcon: string;
  streamedVideo: string;
  assetPath: string;
  price: number;
}

interface shopItems {
  singleItems: singleItem[];
}
