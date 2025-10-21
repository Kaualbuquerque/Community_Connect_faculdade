import { Favorite } from "src/modules/favorites/favorite.entity";
import { History } from "src/modules/history/history.entity";
import { User } from "src/modules/users/user.entity";

export interface ServiceWithImageUrls {
    id: number;
    name: string;
    description: string;
    price: number;
    state: string;
    city: string;
    category: string;
    provider: User;
    images: string[]; // URLs
    favorites?: Favorite[];
    history?: History[];
  }
  