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

export interface ReplyWithUser extends InstagramReply {
  user: InstagramUser;
}

export interface FeedWithBookmarks extends FeedWithUser {
  bookmarks: InstagramBookMark[];
}

export interface Feeds extends FeedWithUser {
  bookmarks: InstagramBookMark[];
  replies: ReplyWithUser[];
  likes: InstagramLike[];
  isLiked?: boolean;
  isBookmarked?: boolean;
}
