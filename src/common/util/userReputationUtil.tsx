import { USER_REPUTATION_RANKS } from "../constants";

export function getReputationBadgeTitle(reputation: number) {
  let userRank = "New in town";
  for (let rank of USER_REPUTATION_RANKS) {
    if (reputation >= rank.minReputation) {
      userRank = rank.title;
    }
  }

  return userRank;
}
