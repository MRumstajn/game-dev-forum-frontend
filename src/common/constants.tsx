// values

export const LOGIN_FIELD_MAX_LEN = 30;

export enum PostReactionType {
  LIKE = "LIKE",
  DISLIKE = "DISLIKE",
}

export const MAX_WORK_OFFER_CATEGORY_TITLE_LENGTH = 30;

export const USER_REPUTATION_RANKS: {
  minReputation: number;
  title: string;
}[] = [
  {
    minReputation: 5,
    title: "Newbiew",
  },
  {
    minReputation: 15,
    title: "Junior",
  },
  {
    minReputation: 30,
    title: "Well known",
  },
  {
    minReputation: 50,
    title: "Senior",
  },
  {
    minReputation: 70,
    title: "All knowing",
  },
  {
    minReputation: 100,
    title: "Legend",
  },
];

// messages

export const INPUT_TOO_LONG_MESSAGE = "Input is too long";

export const INPUT_TOO_SHORT_MESSAGE = "Input is too short";

export const INPUT_REQUIRED_MESSAGE = "Input is required";

export const SAME_PASSWORD_MESSAGE = "Same as current password";

export const BIO_TOO_LONG_MESSAGE = "Max bio length is 100 characters";

export const PASSWORD_DOES_NOT_MATCH_MESSAGE = "Passwords do not match";

export const POST_CONTENT_TOO_SHORT_MESSAGE =
  "Post content must be 3 or more letters long";

export const POST_CONTENT_TOO_LONG_MESSAGE =
  "Post content can have max 200 letters";

export const WORK_OFFER_RATE_RANGE_MESSAGE = "Rating can be min 1 and max 5";

export const WORK_OFFER_MIN_PRICE_MESSAGE = "Price has to be 0 or greater";

// screen sizes

export const NAVBAR_BREAKPOINT_PX = 870;
