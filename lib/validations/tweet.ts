import * as z from "zod";

export const TweetValidation = z.object({
  tweet: z
    .string()
    .nonempty()
    .min(3, { message: "Tweet should be at least 3 character." })
    .max(1000, { message: "Maximum 1000 characters allowed" }),
  accountId: z.string().nonempty(),
  postImg: z.string().url().optional(),
});

export const commentValidation = z.object({
  comment: z
    .string()
    .nonempty()
    .min(2, { message: "Comment should be at least 3 characters." })
    .max(300, { message: "Maximum 200 chaaracters allowed" }),
});
