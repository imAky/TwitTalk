"use client";
import * as z from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ChangeEvent, useState } from "react";
import { BsArrowLeft } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
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

import { TweetValidation } from "@/lib/validations/tweet";

import { BiArrowBack } from "react-icons/bi";
import TextareaAutosize from "./TextareaAutosize";

interface Props {
  userId: string;
}

function PostTweet({ userId }: Props) {
  const [postImage, setPostImage] = useState<File[]>();
  const { user, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  const form = useForm<z.infer<typeof TweetValidation>>({
    resolver: zodResolver(TweetValidation),
    defaultValues: {
      tweet: "",
      postImg: "",
      accountId: userId,
    },
  });

  function onSubmit(values: z.infer<typeof TweetValidation>) {}
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
      <div className="p-2 pl-4 pt-4">
        {isLoaded && userImage && (
          <Image
            src={userImage}
            alt="userImage"
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
      </div>
      <div className="px-2">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-dark-1 text-light-1"
          >
            <FormField
              control={form.control}
              name="tweet"
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
                      type="file"
                      accept="image/*"
                      placeholder=""
                      className=""
                      onChange={(e) => handlePostImg(e, field.onChange)}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button type="submit" className="mt-12">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PostTweet;
