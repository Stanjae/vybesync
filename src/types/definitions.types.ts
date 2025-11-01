import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import {z} from 'zod'
import { formSchema } from "../lib/zod";

export type SearchParams = { [key: string]: string | string[] | undefined }

export type AuthorReferenceType = {
    name:string; 
    profile_image:SanityImageSource; 
    _id:string;
    fullname:string;
    image:string | null;
};

export type NotificationType = {
  _id:string; 
  type:"like"|"comment"|"follow";
  createdAt:string;
  senderId:string;
  receiverId:string;
  isRead?:boolean;
  name:string;
  image: string;
  videoId:string;
}

export type NotificationAll = {
  read:boolean;
  receiver: {_ref:string; _type: "reference"};
  sender: {image:string; name:string; _id:string;}
  type: "like"|"comment"|"follow";
  videoId:{_ref:string; _type: "reference"};
  _createdAt: string;
  _id: string;
}


export type replyType = {
  reply_text:string;
  uid:{
    name?:string; _id:string | undefined; image?:string
  };
  commentId:string | undefined;
  createdAt?:string;
  _key?:string 
}

export type CommentType ={
  userId:AuthorReferenceType | undefined;
  comment_text:string | null;
  _createdAt?:string;
  _id?:string;
  videoId:string | null;
  reply?:replyType[];
  likes?:number;
}

export type addCommentType ={
  userId:string | AuthorReferenceType | undefined ;
  id?:string;
  comment_text:string | undefined;
  videoId:string | undefined;
  name?:string | null| undefined;
}

export type ProfileFollowResponseType={
  profileFollow:{following:number; followers:number};
  reducedLikes:number
}

export type VideoType = {
    author: AuthorReferenceType;
    caption:string;
    description:string;
    videoUrl:string;
    _createdAt:string;
    _id:string;
    _type: "video";
    _updatedAt:string;
    views?:number;
    likes?:number;
    comment_count?:number;
}

export type ProfileType =  {
    profile_image: SanityImageSource;
    phoneNumber: string;
    _createdAt: string;
    name: string;
    _id: string;
    fullname: string;
    _updatedAt: string;
    bio: string;
    email: string;
    image?:string;
    followers?: string | number;
    following?: string | number;
  }


export type CloudinaryResource = {
    context?:{
        alt?:string;
        caption?:string
    };
    public_id?:string;
    secure_url?:string;
  }

  export type VideoResponse = {
        asset_id: string;
        public_id: 'vybez/yggcowvd0aqicylmiyyi',
        version: 1742881596,
        version_id: '065f2774863414744aa9f1a4adafe6ed',
        signature: '8bfadf70b2f06210d8d7f11e229b4c9b60e0e428',
        width: 1920,
        height: 1080,
        format: 'mp4',
        resource_type: 'video',
        created_at: '2025-03-25T05:46:36Z',
        tags: [],
        pages: 0,
        bytes: 4701383,
        type: 'upload',
        etag: '4e5265d9ac70bf57a572e0266d96d605',
        placeholder: false,
        url: 'http://res.cloudinary.com/dn5rlehel/video/upload/v1742881596/vybez/yggcowvd0aqicylmiyyi.mp4',
        secure_url: 'https://res.cloudinary.com/dn5rlehel/video/upload/v1742881596/vybez/yggcowvd0aqicylmiyyi.mp4',
        playback_url: 'https://res.cloudinary.com/dn5rlehel/video/upload/sp_auto/v1742881596/vybez/yggcowvd0aqicylmiyyi.m3u8',
        asset_folder: 'vybez',
        display_name: 'yggcowvd0aqicylmiyyi',
        audio: {
          codec: 'aac',
          bit_rate: '191878',
          frequency: 44100,
          channels: 2,
          channel_layout: 'stereo'
        },
        video: {
          pix_format: 'yuv420p',
          codec: 'h264',
          level: 40,
          profile: 'High',
          bit_rate: '4476518',
          time_base: '1/15360'
        },
        is_audio: false,
        frame_rate: 30,
        bit_rate: 4677412,
        duration: 8.040998,
        rotation: 0,
        nb_frames: 241,
        api_key: '373399557492313'
  }


export type CreateVideoType = z.infer<typeof formSchema>