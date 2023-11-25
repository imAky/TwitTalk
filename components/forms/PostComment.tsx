"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { TbPhoto } from "react-icons/tb";
import { RxCross2 } from "react-icons/Rx";
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

import { commentValidation } from "@/lib/validations/twit";

import TextareaAutosize from "./TextareaAutosize";
import { isBase64Image } from "@/lib/utils";
import { addCommentToTwit } from "@/lib/actions/twit.actions";
import AnimateSVG from "../shared/AnimatesSVG";

interface Props {
  twitId: string;
  currentUserImg: string;
  currentUserId: string;
}

function PostComment({ twitId, currentUserImg, currentUserId }: Props) {
  const [postImage, setPostImage] = useState<File[]>();
  const [loading, setLoading] = useState(false);
  const PostInputRef = useRef<HTMLInputElement | null>(null);
  const pathname = usePathname();
  const { startUpload } = useUploadThing("media");
  const form = useForm<z.infer<typeof commentValidation>>({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      comment: "",
      postImg: undefined,
      parentId: twitId,
    },
  });

  const commnetWatch = form.watch("comment");

  const handleClearPostImage = () => {
    setPostImage(undefined);
    if (PostInputRef.current) {
      PostInputRef.current.value = "";
    }
    // clear the image URL in form values
    form.setValue("postImg", undefined);
  };

  async function onSubmit(values: z.infer<typeof commentValidation>) {
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
      await addCommentToTwit(
        twitId,
        values.comment,
        values.postImg,
        currentUserId,
        pathname
      );
    } catch (err: any) {
      console.log(`Error on Posting Tweet ${err.message}`);
    } finally {
      setLoading(false);
      form.reset();
      handleClearPostImage();
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
    <div className="flex flex-row border-[1px] border-dark-2 relative">
      <div className="w-12 h-12 relative rounded-full my-7 ml-4">
        <Image
          src={currentUserImg}
          alt="userImage"
          fill
          className="rounded-full object-cover"
        />
      </div>
      <div className="flex-1">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-dark-1 text-light-1"
          >
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TextareaAutosize
                      row={1}
                      placeholder="Post your reply"
                      {...field}
                      id="postTextarea"
                      className=" pt-8 pb-4 px-6 whitespace-normal break-all w-full bg-dark-1 font-medium text-light-3  resize-none outline-none  min-h-[10px] text-[20px] h-auto shadow-md placeholder:text-dark-6 placeholder- tracking-wide focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-slate-0 focus-visible:ring-offset-0 dark:border-none dark:bg-dark-1 dark:ring-offset-0"
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
            {postImage && PostInputRef.current && (
              <div
                className="absolute top-32 right-14"
                onClick={handleClearPostImage}
              >
                <RxCross2
                  size={38}
                  className="text-light-1 hover:bg-slate-600  p-2 rounded-full"
                />
              </div>
            )}
            <div className="flex justify-between items-center px-6 pb-6 pt-2">
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
                disabled={!commnetWatch || form.formState.isSubmitting}
                className="bg-primary-1 rounded-full px-4 font-semibold tracking-wide  hover:bg-primary-1 hover:opacity-80"
              >
                {loading ? (
                  <AnimateSVG width={28} height={28} swidth={12} />
                ) : (
                  "Reply"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PostComment;
