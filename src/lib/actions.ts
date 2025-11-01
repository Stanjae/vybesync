"use server";
import { client } from "@/sanity/client";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  addCommentType,
  CommentType,
  CreateVideoType,
  replyType,
  VideoType,
} from "../types/definitions.types";
import { nanoid } from "nanoid";
import { pusher } from "./pusher";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getAuthSession = async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
};

//----------------------------------------------------NOTIFICATION SYSTEM --------------------------------

export async function createNotification(
  type: "like" | "comment" | "follow",
  senderId: string,
  receiverId: string,
  videoId?: string
) {
  try {
    const notification = {
      _type: "notification",
      type,
      sender: { _type: "reference", _ref: senderId },
      receiver: { _type: "reference", _ref: receiverId },
      videoId: videoId ? { _type: "reference", _ref: videoId } : null,
      read: false,
    };
    const result = await client.create(notification);
    const senderInfo = await client.fetch(
      `*[_type == "user" && _id == "${senderId}"][0]{name, image}`
    );

    // Send notification to the receiver via Pusher
    await pusher.trigger(`notifications-${receiverId}`, "new-notification", {
      type,
      senderId,
      receiverId,
      name: senderInfo?.name,
      image: senderInfo?.image,
      videoId,
      createdAt: new Date().toISOString(),
    });
    return result;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
}

export async function fetchNotifications(userId: string) {
  try {
    const notifications = await client.fetch(
      `*[_type == "notification" && receiver._ref == $userId] | order(_createdAt desc) 
      {read, type, _id, videoId, receiver, _createdAt, "sender":sender -> {_id, name, image}}`,
      { userId }
    );
    return notifications;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationsRead(notificationId: string) {
  try {
    await client
      .patch(notificationId)
      .set({ read: true }) // Update all to read
      .commit();
    return true;
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return false;
  }
}

//-------------------------------------CRUD OPERATIONS --------------------------------

export const getVideos = async (): Promise<VideoType[]> => {
  const query = `*[_type == "video" && visibility == "everyone"] | order(_createdAt desc) {..., "likes":count(likes), "author":author-> {name, image, profile_image, _id, fullname}}`;
  const options = { next: { revalidate: 10, tags: ["videos"] } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const getProfile = async (slug: string) => {
  console.log(slug);
  const query = `*[_type == "user" && name match ["${slug}*", "*${slug}",]][0] {
    profile_image, image, phoneNumber, _createdAt, name, _id, fullname, _updatedAt, bio, email}`;
  const options = { next: { revalidate: 30, tags: ["profile"] } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const getUserVideos = async (userId: string, sort = "desc") => {
  const newSort = sort == "views" ? `views desc` : `_createdAt ${sort}`;
  const query = `*[_type == "video" && author._ref == "${userId}"] | order(${newSort}) {..., "likes":count(likes), "author":author-> {name, image, profile_image, _id, fullname}}`;
  const options = { next: { revalidate: 10, tags: ["userVideos"] } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const getVideoDetail = async (videoId: string) => {
  const query = `*[_type == "video" && _id == "${videoId}"][0] {..., "likes":count(likes), "author":author-> {name, profile_image, image, _id, fullname},
  "comment_count":count(*[_type == "comment" && videoId._ref == "${videoId}"] )}`;
  const options = { next: { revalidate: 30, tags: ["videoDetail"] } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const updateViewCount = async (vidId: string) => {
  await client.patch(vidId).inc({ views: 1 }).commit();
  revalidateTag("userVideos");
};

export const getExploreVideos = async (text?: string) => {
  const isText = text
    ? `_type == "video" && category match "${text}"`
    : `_type == "video"`;
  const query = `*[${isText}] | order(_createdAt desc) {..., "likes":count(likes), "author":author-> {name, image, _id, fullname}}`;
  const options = { next: { revalidate: 30 } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const searchQueries = async (queryo: string) => {
  const query = queryo.trim();

  const filters = [`_type == "video"`];
  const users = [`_type == "user"`];

  if (query) {
    filters.push(
      `(title match "${query}" || description match "${query}" || category match ["${query}*", "*${query}"] || references(*[_type == "hashtag" && title match "${query}"]._id) || category match "${query}")`
    );

    users.push(
      `(name match "${query}" || bio match "${query}" || fullname match "${query}")`
    );
  }

  const query1 = client.fetch(
    `*[${filters.join(" && ")}]` +
      ` | order(views desc) {..., "author":author-> {name, profile_image, _id, fullname}}`
  );
  const query2 = client.fetch(
    `*[${users.join(" && ")}]` +
      ` | order(count(followers) desc) {..., "followers":count(followers)}`
  );

  const [videosQuery, usersQuery] = await Promise.all([query1, query2]);

  return { videosQuery, usersQuery };
};

export const updateSearches = async (query: string) => {
  const doc = { _type: "searchterm", title: query };
  await client.create(doc);
  revalidateTag("searches");
  revalidateTag("allSearches");
};

export const fetchSearches = async (query: string) => {
  const doc = `*[_type == "searchterm" && title match ["${query}*", "*${query}"]] | order(_createdAt desc) [0...10]`;
  const options = { next: { revalidate: 10, tags: ["searches"] } };
  const response = await client.fetch(doc, {}, options);
  return response;
};

export const fetchAllSearches = async () => {
  const doc = `*[_type == "searchterm"] {title}`;
  const options = { next: { revalidate: 10, tags: ["allSearches"] } };
  const results = await client.fetch(doc, {}, options);

  // Create a frequency map
  const searchCount: Record<string, number> = results.reduce(
    (acc: Record<string, number>, { title }: { title: string }) => {
      acc[title] = (acc[title] || 0) + 1;
      return acc;
    },
    {}
  );

  // Convert to an array and sort by frequency
  const sortedSearches = Object.entries(searchCount)
    .sort(([, countA], [, countB]) => countB - countA) // Sort by highest frequency
    .slice(0, 10); // Get top 10
  return sortedSearches;
};

export const getInitialLikeArray = async (id: string) => {
  const query = `*[_type == "video" && _id == "${id}"][0] {caption, likes}`;
  const options = { next: { revalidate: 30, tags: ["initialLikes"] } };
  const results = await client.fetch(query, {}, options);
  const initialLikes = results?.likes?.map(
    (item: { _ref: string }) => item?._ref
  );
  return initialLikes || [];
};

/* -----------------------------------------------COMMENTS----------------------------------------------------------------- */

export const getVideoComments = async (
  videoId: string
): Promise<CommentType[]> => {
  const query = `*[_type == "comment" && references("${videoId}")] | order(_createdAt desc)
   {comment_text, _id, "likes":count(likes), _createdAt, "userId":userId->{name, image, _id}, reply[]{_key, reply_text, createdAt, uid->{name, _id, image}}}`;
  const options = { next: { tags: ["commentLikes"] } };
  return await client.fetch(query, {}, options);
};

export const getVideoCommentsCount = async (videoId: string) => {
  const query = `count(*[_type == "comment" && references("${videoId}")])`;
  const options = { next: { tags: ["commentCounts"] } };
  const response = await client.fetch(query, {}, options);
  return response;
};

export const addVideoComments = async (jun: addCommentType) => {
  const { comment_text, videoId, userId } = jun;
  const doc = {
    _type: "comment",
    comment_text,
    videoId: { _ref: videoId, _type: "reference" },
    userId: { _ref: userId, _type: "reference" },
  };

  try {
    await client.create(doc);
    revalidateTag("userVideos");
    revalidateTag("videoComments");
    revalidateTag("videoDetail");
    return { status: 200, message: "it was sucessful", data: doc };
  } catch (err) {
    console.log(err);
    throw new Error(`Something went wrong,`);
  }
};

export const deleteVideoComment = async (id: string | undefined) => {
  await client.delete(id as string);
};

export const fetchCommentLikeArray = async (commentId: string) => {
  const query = `*[_type == "comment" && _id == "${commentId}"][0]{likes}`;
  const options = { next: { revalidate: 30, tags: ["commentLikeArray"] } };
  const response = await client.fetch(query, {}, options);
  const initialLikes = response?.likes?.map(
    (item: { _ref: string }) => item?._ref
  );
  return initialLikes || [];
};

export const handleCommentLikes = async (commentId: string, userId: string) => {
  try {
    const comment = await client.fetch(
      `*[_type =="comment" && _id == "${commentId}"][0]{likes}`
    );
    const isLiked = comment?.likes?.find(
      (like: { _ref: string }) => like?._ref === userId
    );

    const updatedLikes = isLiked
      ? comment?.likes.filter((like: { _ref: string }) => like._ref !== userId) // Unlike
      : [
          ...(comment?.likes || []),
          { _ref: userId, _type: "reference", _key: userId?.slice(0, 12) },
        ]; // Like

    await client.patch(commentId).set({ likes: updatedLikes }).commit();

    revalidateTag("commentLikes");
    revalidateTag("commentLikeArray");
    return { success: true, likesCount: updatedLikes.length };
  } catch (err) {
    console.log("error message:", err);
    throw new Error(`error message: ${err}`);
  }
};

/* --------------------------------------------------REPLY--------------------------------------------------------- */

export const insertReply = async (replydocs: replyType) => {
  await client
    .patch(replydocs.commentId as string) // Target the specific comment document
    .setIfMissing({ reply: [] }) // Ensure the array exists
    .insert("after", "reply[-1]", [
      {
        _key: nanoid(),
        reply_text: replydocs.reply_text,
        createdAt: new Date().toISOString(),
        uid: { _type: "reference", _ref: replydocs.uid?._id },
      },
    ])
    .commit();
};

export async function deleteReplyByKey(commentId: string, replyKey: string) {
  const comment = await client.getDocument(commentId);

  if (!comment || !comment.reply) return;

  const updatedReplies = comment.reply.filter(
    (reply: { _key: string }) => reply._key !== replyKey
  );

  await client.patch(commentId).set({ reply: updatedReplies }).commit();
}

export const fetchReplyLikeArray = async (commentId: string) => {
  const query = `*[_type == "comment" && _id == "${commentId}"][0]{likes}`;
  const options = { next: { revalidate: 30, tags: ["commentLikeArray"] } };
  const response = await client.fetch(query, {}, options);
  const initialLikes = response?.likes?.map(
    (item: { _ref: string }) => item?._ref
  );
  return initialLikes || [];
};

export const handleReplyLikes = async (
  commentId: string,
  replykey: string,
  userId: string
) => {
  const query = `*[_type == "comment" && _id == $commentId][0]{
    comment_text, reply[]{_key, reply_text,likes[]{ _ref }}}`;

  const comments = await client.fetch(query, { commentId });
  let updatedLikes;
  const isLiked = comments?.reply
    ?.find((opiom: { _key: string }) => opiom?._key == replykey)
    ?.likes?.find((xox: { _ref: string }) => xox?._ref == userId);

  if (isLiked) {
    // Remove like
    updatedLikes = comments?.reply
      ?.find((opiom: { _key: string }) => opiom?._key == replykey)
      ?.likes?.filter((xox: { _ref: string }) => xox._ref !== userId);
  } else {
    // Add like
    updatedLikes = [
      ...(comments?.reply?.find(
        (opiom: { _key: string }) => opiom?._key == replykey
      )?.likes || []),
      { _key: nanoid(), _type: "reference", _ref: userId },
    ];
  }

  const fiexed = comments?.reply.map((opiom: { _key: string }) => {
    if (opiom?._key == replykey) {
      return { ...opiom, likes: updatedLikes };
    } else {
      return opiom;
    }
  });
  await client.patch(commentId).set({ reply: fiexed }).commit();
};

export async function getCommentsWithLikedUserIds(
  commentId: string,
  replyKey: string
) {
  const query = `*[_type == "comment" && _id == $commentId][0]{
      comment_text, reply[]{_key, reply_text,likes[]{ _ref }}
  }`;

  const comments = await client.fetch(query, { commentId });

  const response = comments?.reply
    ?.find((lol: { _key: string }) => lol._key == replyKey)
    ?.likes?.map((ios: { _ref: string }) => ios._ref);

  return response || [];
}

/* -----------------------------------FOLLOW & FOLLOWING--------------------------------------------------------------- */

export const getInitialFollowingArray = async (userId: string) => {
  const query = `*[_type == "user" && _id == "${userId}"][0] {following}`;
  const options = { next: { revalidate: 30, tags: ["initialFollowing"] } };
  const results = await client.fetch(query, {}, options);
  const initialLikes = results?.following?.map(
    (item: { _ref: string }) => item?._ref
  );
  return initialLikes || [];
};

export const getProfileFollowArray = async (celebrityId: string) => {
  const options = { next: { revalidate: 10, tags: ["profileFollow"] } };
  const options2 = { next: { revalidate: 10, tags: ["profileLikes"] } };
  const query = client.fetch(
    `*[_type == "user" && _id == "${celebrityId}"][0] {"followers":count(followers), "following":count(following)}`,
    {},
    options
  );
  const query2 = client.fetch(
    `*[_type == "video" && author._ref == "${celebrityId}"]{"likes":count(likes)}`,
    {},
    options2
  );

  const [profileFollow, profileLikes] = await Promise.all([query, query2]);
  const reducedLikes = profileLikes.reduce(
    (sum: number, like: { likes: number }) => sum + like.likes,
    0
  );
  return { profileFollow, reducedLikes };
};

export const handleFollow = async (celebrityId: string, userId: string) => {
  try {
    const user = await client.fetch(
      `*[_type =="user" && _id == "${userId}"][0]{following}`
    );
    const celebrity = await client.fetch(
      `*[_type =="user" && _id == "${celebrityId}"][0]{followers}`
    );

    const isFollowing = user?.following?.find(
      (follow: { _ref: string }) => follow?._ref === celebrityId
    );
    const isFollowed = celebrity?.followers?.find(
      (follow: { _ref: string }) => follow?._ref === userId
    );

    //update user following
    const updatedFollowing = isFollowing
      ? user?.following.filter(
          (like: { _ref: string }) => like._ref !== celebrityId
        ) // Unfollow
      : [
          ...(user?.following || []),
          {
            _ref: celebrityId,
            _type: "reference",
            _key: celebrityId?.slice(0, 12),
          },
        ]; // follow

    //update celebrity followers
    const updatedFollowed = isFollowed
      ? celebrity?.followers.filter(
          (like: { _ref: string }) => like._ref !== userId
        ) // Unfollow
      : [
          ...(celebrity?.followers || []),
          { _ref: userId, _type: "reference", _key: userId?.slice(0, 12) },
        ]; // follow

    //update user following array async
    await client.patch(userId).set({ following: updatedFollowing }).commit();

    //update followers of celebrity
    await client
      .patch(celebrityId)
      .set({ followers: updatedFollowed })
      .commit();

    revalidateTag("profileFollow");
    revalidateTag("profile");
    revalidateTag("profileLikes");
    revalidateTag("initialFollowing");
    return { success: true, followCount: updatedFollowing?.length };
  } catch (err) {
    console.log("error message:", err);
    throw new Error(`error message: ${err}`);
  }
};

//------------------------------------------Bookmarks-------------------------------------------------------

export const fetchUserBookmarks = async (userId: string) => {
  const query = `*[_type == "bookmark" && references("${userId}")] 
  | order(_createdAt desc) {videoId -> {..., "likes":count(likes), "author":author-> {name, image, profile_image, _id, fullname}}}`;
  const options = { next: { revalidate: 20, tags: ["fetchUserBookmarks"] } };
  const results = await client.fetch(query, {}, options);
  const sortedOut = results.map(
    (opp: { videoId: Record<string, string> }) => opp.videoId
  );
  return sortedOut;
};

export const handleToogleBookmarks = async (
  userId: string,
  videoId: string
) => {
  try {
    const isBookmarked = await client.fetch(
      `*[_type == "bookmark" && userId._ref =="${userId}" && videoId._ref == "${videoId}"][0]`
    );

    if (isBookmarked) {
      await client.delete(isBookmarked._id);
    } else {
      await client.create({
        _type: "bookmark",
        userId: { _ref: userId },
        videoId: { _ref: videoId },
      });
    }
    revalidateTag("fetchUserBookmarks");
    return { success: !isBookmarked };
  } catch (err) {
    console.log("error message:", err);
    throw new Error(`error message`);
  }
};

//------------------------------------videos mutations----------------------------------------------------------------

const extractHashtags = (text: string) => {
  const regex = /#(\w+)/g;
  const matches = text.match(regex) || [];
  return matches.map((tag) => tag.replace("#", "").toLowerCase());
};

const uploadHashtags = async (hashtags: string[]) => {
  if (!hashtags.length) return [];

  // Fetch existing hashtags by slug
  const existingTags: Array<{
    _id: string;
    title: string;
    slug: { current: string };
  }> = await client.fetch(
    `*[_type == "hashtag" && slug.current in $hashtags]{_id, title, slug}`,
    { hashtags }
  );

  const existingTagMap = new Map(
    existingTags.map((tag) => [tag.slug.current, tag._id])
  );

  // Find new hashtags that don't exist yet
  const newHashtags = hashtags.filter((tag) => !existingTagMap.has(tag));

  let createdTags = [];
  if (newHashtags.length > 0) {
    createdTags = await Promise.all(
      newHashtags.map(async (tag) => {
        const newTag = await client.create({
          _type: "hashtag",
          title: tag,
          slug: { _type: "slug", current: tag },
        });
        return newTag;
      })
    );

    // Add new tags to the map
    createdTags.forEach((tag) => existingTagMap.set(tag.slug.current, tag._id));
  }

  return hashtags.map((tag) => existingTagMap.get(tag)); // Returns an array of _id values
};

export const createPost = async (data: CreateVideoType) => {
  const hashtags = extractHashtags(data.description);

  const newHashtags = await uploadHashtags(hashtags);

  try {
    const newPost = {
      _type: "video",
      caption: data.caption,
      views: 1,
      description: data.description,
      visibility: data.visibility,
      category: data.category,
      coverImage: data.coverImage,
      videoUrl: data.publicId,
      author: { _ref: data.userId, _type: "reference" },
      hashtag: newHashtags.map((id) => ({
        _type: "reference",
        _ref: id,
        _key: id?.slice(0, 6),
      })),
    };
    await client.create(newPost);
    revalidatePath("/");
    return { status: 200, message: "Post created successfully" };
  } catch (err) {
    return { status: 500, message: `${err}` };
  }
};

export const getVideoLikeStatus = async (
  videoId: string,
  userId: string
): Promise<boolean> => {
  const video = await client.fetch(
    `*[_type =="video" && _id == "${videoId}"][0]{caption, likes, "author":author ->{_id}}`
  );
  const isLiked = video?.likes?.find(
    (like: { _ref: string }) => like?._ref == userId
  );
  return isLiked ? true : false;
};

export const handleLikes = async (videoId: string, userId: string) => {
  try {
    const video = await client.fetch(
      `*[_type =="video" && _id == "${videoId}"][0]{caption, likes, "author":author ->{_id}}`
    );
    const isLiked = video?.likes?.find(
      (like: { _ref: string }) => like?._ref === userId
    );

    const updatedLikes = isLiked
      ? video?.likes.filter((like: { _ref: string }) => like._ref !== userId) // Unlike
      : [
          ...(video?.likes || []),
          { _ref: userId, _type: "reference", _key: userId?.slice(0, 12) },
        ]; // Like

    await client.patch(videoId).set({ likes: updatedLikes }).commit();

    if (!isLiked)
      await createNotification("like", userId, video?.author._id, videoId);
    return { success: true, likesCount: updatedLikes.length };
  } catch (err) {
    throw new Error(`error message: ${err}`);
  }
};
