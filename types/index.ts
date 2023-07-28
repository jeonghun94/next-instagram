import {
  InstagramBookMark,
  InstagramFeed,
  InstagramFollows,
  InstagramLike,
  InstagramReply,
  InstagramUser,
} from "@prisma/client";

export interface ITweets {
  ok?: boolean;
  feeds: FeedWithUser[];
}

export interface MutationResponse {
  ok: boolean;
  error?: string;
}

export interface FeedWithUser extends InstagramFeed {
  user: InstagramUser;
  _count: {
    feeds?: number;
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
  isBookmarked?: boolean;
  isLiked?: boolean;
}

// 타입 정의 리팩토링

export interface FeedWithAll extends FeedWithUser {
  bookmarks: InstagramBookMark[];
  replies: ReplyWithUser[];
  likes: InstagramLike[];
  isBookmarked?: boolean;
  isLiked?: boolean;
}

export interface FeedLight extends Pick<InstagramFeed, "id" | "imageUrl"> {}

export interface FollowsWithUser extends InstagramFollows {
  following: InstagramUser;
}

export interface MutationResult {
  ok: boolean;
  error?: string;
  result?: string;
  password?: string;
}

export interface FeedDetailProps {
  feed: FeedWithAll;
}

export interface ProfileProps {
  followers: InstagramUser[];
  following: InstagramUser[];
  bookmarkFeeds: FeedLight[];
  likeFeeds: FeedLight[];
  feeds: FeedLight[];
  isFollowing: boolean;
  isMe: boolean;
  user: InstagramUser;
}

// page type
export interface HomeProps {
  feeds: FeedWithAll[];
  followingUsersInfo: FollowsWithUser[];
}

export interface SearchProps {
  feeds: FeedWithAll[];
}

interface ChatRoomProp extends InstagramFollows {
  following: InstagramUser;
}

export interface ChatRoomProps {
  followingUsers: ChatRoomProp[];
}

export interface EditProfileProps {
  user: InstagramUser;
}

// form type

export interface EditProfileFormProps {
  password: string;
  avatar: FileList;
  name: string;
}

export interface ForgotPasswordFormProps {
  email: string;
}

export interface LoginFormProps {
  password: string;
  email: string;
}

export interface SignUpFormProps {
  password: string;
  username: string;
  email: string;
  name: string;
}

export interface FormProps {
  password?: string;
  username?: string;
  avatar?: FileList;
  email?: string;
  name?: string;
}
