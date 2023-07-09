import { InstagramFeed, InstagramUser } from "@prisma/client";

export interface ITweets {
  ok?: boolean;
  feeds: FeedWithUser[];
}
export interface FeedWithUser extends InstagramFeed {
  user: InstagramUser;
  _count: {
    replys: number;
    likes: number;
  };
}
