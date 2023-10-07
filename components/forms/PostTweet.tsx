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

interface Props {
  userId: string;
}

function PostTweet({ userId }: Props) {
  const { user, isLoaded } = useUser();
  const userImage = user?.imageUrl;
  const form = useForm<z.infer<typeof TweetValidation>>({
    resolver: zodResolver(TweetValidation),
    defaultValues: {
      tweet: "",
      accountId: userId,
    },
  });

  function onSubmit(values: z.infer<typeof TweetValidation>) {}
  function handlePostImg(
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) {}
  return (
    <div>
      <div className="flex flex-row p-4">
        <BsArrowLeft size={18} />
      </div>
      <div className="p-2">
        {isLoaded && userImage && (
          <Image
            src={userImage}
            alt="userImage"
            width={48}
            height={48}
            className="rounded-full"
          />
        )}
      </div>
      <div className="px-4 pl-8">
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
                    <Textarea
                      rows={5}
                      placeholder="What is happening?!"
                      {...field}
                      className="bg-dark-1 text-light-1 border-none resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
            control={form.control}
            name="postImg"
            render={({ field }) => (
              <FormItem className="px-6 object-contain -mt-14 z-20 relative">
                <FormLabel className="">
                  {field.value && (
                    <div className="w-32 h-32 relative rounded-full overflow-hidden">
                      <Image
                        src={field.value}
                        alt="profile_icon"
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                        className="rounded-full border-4 border-dark-4"
                      />
                    </div>
                  )}
                </FormLabel>
                <FormControl className="">
                  <Input
                    type="file"
                    accept="image/*"
                    placeholder=""
                    className="hidden"
                    onChange={(e) => handlePostImg(e, field.onChange)}
                  />
                </FormControl>
              </FormItem>
            )}
          /> */}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

export default PostTweet;
