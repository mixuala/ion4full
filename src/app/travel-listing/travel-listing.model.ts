export class TravelItemModel {
  image: string;
  icon: string;
  name: string;
  description: string;
  category: string;
  address: string;
  rating: number;
  reviewsCount: number;
}

export class TravelListingModel {
  items: Array<TravelItemModel> = [
    new TravelItemModel(),
    new TravelItemModel(),
    new TravelItemModel(),
    new TravelItemModel()
  ];
}
