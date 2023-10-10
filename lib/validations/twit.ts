import * as z from "zod";

export const TweetValidation = z.object({
  twit: z
    .string()
    .nonempty()
    .min(1, { message: "Tweet should be at least 1 character." })
    .max(300, { message: "Maximum 300 characters allowed" }),
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
