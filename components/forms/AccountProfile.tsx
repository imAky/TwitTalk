"use client";
import * as z from "zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { ChangeEvent, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { TbCameraPlus } from "react-icons/tb";
import { isBase64Image } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

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

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { UserValidation } from "@/lib/validations/user";
import { updateUser } from "@/lib/actions/user.actions";

interface Props {
  user: {
    id: string;
    objectId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    banner: string;
    location: string;
    website: string;
  };
  btnTitle: string;
}

const AccountProfile = ({ user, btnTitle }: Props) => {
  const [fileprofile, setfileprofile] = useState<File[]>([]);
  const [filebanner, setfilebanner] = useState<File[]>([]);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const profileInputRef = useRef<HTMLInputElement | null>(null);
  const { startUpload } = useUploadThing("media");
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),
    defaultValues: {
      profile: user?.image ? user.image : "",
      banner: user?.banner ? user.banner : "",
      username: user.username || "",
      name: user.name || "",
      bio: user.bio || "",
      location: user.location || "",
      website: user.website,
    },
  });

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    const profileBlob = values.profile;
    const bannerBlob = values.banner;

    // Check if the profile image is a valid base64 image
    const isProfileImageValid = isBase64Image(profileBlob);

    // Check if the banner image is a valid base64 image
    const isBannerImageValid = isBase64Image(bannerBlob);

    if (isProfileImageValid) {
      // Upload the profile image if it's valid
      const profileImgRes = await startUpload(fileprofile);

      if (profileImgRes && profileImgRes[0].url) {
        values.profile = profileImgRes[0].url;
      }
    }

    if (isBannerImageValid) {
      // Upload the banner image if it's valid
      const bannerImgRes = await startUpload(filebanner);

      if (bannerImgRes && bannerImgRes[0].url) {
        values.banner = bannerImgRes[0].url;
      }
    }

    await updateUser({
      userId: user.id,
      username: values.username,
      name: values.name,
      bio: values.bio,
      location: values.location,
      profile: values.profile,
      banner: values.banner,
      website: values.website,
      path: pathname,
    });

    if (pathname === "/profile/edit") {
      router.back();
    } else {
      router.push("/");
    }
  };
  const handleBannerImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setfilebanner(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleProfileImage = (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void
  ) => {
    e.preventDefault();

    const fileReader = new FileReader();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setfileprofile(Array.from(e.target.files));
      if (!file.type.includes("image")) return;
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";
        fieldChange(imageDataUrl);
      };
      fileReader.readAsDataURL(file);
    }
  };
  return (
    <div className="bg-white md:rounded-lg shadow-lg md:w-[650px] w-full md:h-[700px] h-screen overflow-y-auto overflow-x-hidden relative ">
      <h1 className="text-light-2 sticky top-0 left-0 w-full p-4 bg-dark-1 z-30 mt-0 bg-opacity-90">
        Edit Profile
      </h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="bg-dark-1 text-light-1"
        >
          <FormField
            control={form.control}
            name="banner"
            render={({ field }) => (
              <FormItem className="border-2 border-dark-1 px-0 relative">
                <FormLabel className="">
                  {field.value ? (
                    <div className="w-[750px] h-[250px] relative overflow-hidden">
                      <Image
                        src={field.value}
                        alt="header_photo"
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </div>
                  ) : (
                    <div className="w-[750px] h-[250px]  relative overflow-hidden">
                      <Image
                        src="/assets/banner.png"
                        alt="profile_icon"
                        fill
                        style={{
                          objectFit: "cover",
                        }}
                        className=""
                      />
                    </div>
                  )}
                </FormLabel>
                <FormControl className="">
                  <Input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    placeholder="upload a banner photo"
                    className="hidden"
                    onChange={(e) => handleBannerImage(e, field.onChange)}
                  />
                </FormControl>
                <FormDescription>
                  <TbCameraPlus
                    className="absolute top-1/2 left-1/2 transform tansform -translate-x-1/2 -translate-y-1/2 text-xl text-light-1 bg-dark-1 bg-opacity-40 hover:bg-opacity-20 rounded-full p-3 cursor-pointer"
                    size={48}
                    onClick={() => {
                      if (bannerInputRef.current) {
                        bannerInputRef.current.click();
                      }
                    }}
                  />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="profile"
            render={({ field }) => (
              <FormItem className="px-6 object-contain -mt-14 z-20 relative">
                <FormLabel className="">
                  {field.value ? (
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
                  ) : (
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
                    ref={profileInputRef}
                    type="file"
                    accept="image/*"
                    placeholder=""
                    className="hidden"
                    onChange={(e) => handleProfileImage(e, field.onChange)}
                  />
                </FormControl>
                <FormDescription>
                  <TbCameraPlus
                    className="absolute top-10 left-16 text-xl text-light-1 bg-dark-1 bg-opacity-40 hover:bg-opacity-20 rounded-full p-3 cursor-pointer"
                    size={48}
                    onClick={() => {
                      if (profileInputRef.current) {
                        profileInputRef.current.click();
                      }
                    }}
                  />
                </FormDescription>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="px-6 relative pb-5">
                <FormLabel className="absolute top-1 left-9  text-dark-3 text-xs font-light">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-16 pt-6 text-lg font-medium border-2 focus:border:1 border-dark-6 bg-dark-1 active:bg-dark-1 ring-offset-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem className="px-6 relative pb-5">
                <FormLabel className="absolute top-1 left-9  text-dark-3 text-xs font-light">
                  Username
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-16 pt-6 text-lg font-medium border-2 focus:border:1 border-dark-6 bg-dark-1  ring-offset-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="px-6 relative pb-5">
                <FormLabel className="absolute top-1 left-9  text-dark-3 text-xs font-light">
                  Bio
                </FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    className="h-20 pt-6 text-lg font-medium border-2 border-dark-6 bg-dark-1 resize-none overflow-y-scroll focus:border:1   ring-offset-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="px-6 relative pb-5 ">
                <FormLabel className="absolute top-1 left-9  text-dark-3 text-xs font-light">
                  Location
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-16 pt-6 text-lg font-medium border-2 focus:border:1 border-dark-6 bg-dark-1 ring-offset-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem className="px-6 relative pb-5">
                <FormLabel className="absolute top-1 left-9  text-dark-3 text-xs font-light">
                  Website
                </FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    className="h-16 pt-6 text-lg font-medium border-2 focus:border:1 border-dark-6 bg-dark-1 ring-offset-sky-500 focus-visible:ring-1 focus-visible:ring-sky-500 focus-visible:ring-offset-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className=" bg-light-1 hover:bg-light-2 tracking-wider text-black z-30 text-sm font-sm rounded-2xl absolute top-3 right-3"
          >
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AccountProfile;
