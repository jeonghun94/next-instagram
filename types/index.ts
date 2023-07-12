import {
  InstagramBookMark,
  InstagramFeed,
  InstagramLike,
  InstagramReply,
  InstagramUser,
} from "@prisma/client";

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

export interface FeedWithBookmarks extends FeedWithUser {
  bookmarks: InstagramBookMark[];
}

export interface Feeds extends FeedWithUser {
  bookmarks: InstagramBookMark[];
  replys: InstagramReply[];
  likes: InstagramLike[];
}
