"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useEffect, useId, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { TbPhoto } from "react-icons/tb";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";
import { useUploadThing } from "@/lib/uploadthing";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

import { TweetValidation } from "@/lib/validations/twit";

import { BiArrowBack } from "react-icons/bi";
import TextareaAutosize from "./TextareaAutosize";
import { isBase64Image } from "@/lib/utils";
import { createTwit } from "@/lib/actions/twit.actions";
import AnimateSVG from "../shared/AnimatesSVG";

interface Props {
  userId: string;
  currentUserImg: string;
}

function PostTweet({ userId, currentUserImg }: Props) {
  const [postImage, setPostImage] = useState<File[]>();
  const PostInputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { startUpload } = useUploadThing("media");
  const { user, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  const [loading, setLoading] = useState(false);
  const form = useForm<z.infer<typeof TweetValidation>>({
    resolver: zodResolver(TweetValidation),
    defaultValues: {
      twit: "",
      postImg: undefined,
      accountId: userId,
    },
  });

  const tweetWatch = form.watch("twit");

  async function onSubmit(values: z.infer<typeof TweetValidation>) {
    setLoading(true);
    try {
      const postImgBolb = values.postImg;
      if (postImgBolb) {
        const isPostImgValid = isBase64Image(postImgBolb);
        if (isPostImgValid && postImage) {
          const postImgRes = await startUpload(postImage);
          if (postImgRes && postImgRes[0].url) {
            values.postImg = postImgRes[0].url;
          }
        }
      }
      await createTwit({
        text: values.twit,
        postImg: values.postImg,
        author: userId,
        path: pathname,
        communityId: null,
      });
    } catch (err: any) {
      console.log(`Error on Posting Tweet ${err.message}`);
    } finally {
      setLoading(false);
      router.push("/");
    }
  }
  const handlePostImg = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();
    const fileReader = new FileReader();
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setPostImage(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <div>
      <div className="p-2 pl-4 pt-4 flex flex-row">
        <div className="w-12 h-12 relative rounded-full mx-2">
          <Image
            src={currentUserImg}
            alt="userImage"
            fill
            className="rounded-full object-cover"
          />
        </div>
        <span className="px-5 mx-4 h-[26px] text-primary-1 font-semibold tracking-wide border-2 text-xs border-purple-400 rounded-xl border-opacity-50">
          Everyone
        </span>
      </div>
      <div className="px-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-dark-1 text-light-1"
          >
            <FormField
              control={form.control}
              name="twit"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      row={3}
                      placeholder="What is happening?!"
                      {...field}
                      id="postTextarea"
                      className="pl-12 w-full bg-dark-1 text-light-3 font-normal resize-none outline-none  min-h-[60px] text-[20px] h-auto shadow-md placeholder:text-dark-6 placeholder- tracking-wide focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-slate-0 focus-visible:ring-offset-0 dark:border-none dark:bg-dark-1 dark:ring-offset-0 p-3"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="postImg"
              render={({ field }) => (
                <FormItem className="">
                  <FormLabel className="">
                    {field.value && (
                      <div className="w-full relative px-12 ">
                        <img
                          src={field.value}
                          alt="postImg"
                          style={{
                            objectFit: "contain",
                          }}
                          className="max-w-full h-auto rounded-2xl"
                        />
                      </div>
                    )}
                  </FormLabel>
                  <FormControl className="">
                    <Input
                      ref={PostInputRef}
                      type="file"
                      accept="image/*"
                      placeholder=""
                      className="hidden"
                      onChange={(e) => handlePostImg(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="flex justify-between items-center p-4 border-t-2 border-t-dark-2 mt-4">
              <div
                onClick={() => {
                  if (PostInputRef.current) {
                    PostInputRef.current.click();
                  }
                }}
              >
                <TbPhoto
                  size={40}
                  className="text-primary-1 hover:bg-dark-2 rounded-full p-2"
                />
              </div>

              <Button
                type="submit"
                disabled={!tweetWatch || form.formState.isSubmitting}
                className="bg-primary-1 rounded-full px-5 font-semibold tracking-wide  hover:bg-primary-1 hover:opacity-80"
              >
                {loading ? (
                  <AnimateSVG width={28} height={28} swidth={12} />
                ) : (
                  "Post"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PostTweet;
