import { Ref, useContext, useEffect, useState } from "react";

import { Button, Card, IconButton, Typography } from "@tiller-ds/core";
import { Textarea } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import Avatar from "react-avatar";
import { Link } from "react-router-dom";

import { UserResponse } from "../../common/api/UserResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import { PostReactionType } from "../../common/constants";
import { getReputationBadgeTitle } from "../../common/util/userReputationUtil";
import { formatDate } from "../../util/dateUtil";
import { deleteUserPostReaction } from "../api/deleteUserPostReaction";
import { postCreateUserPostReactionRequest } from "../api/postCreateUserPostReactionRequest";
import { postEditPostRequest } from "../api/postEditPostRequest";
import { PostReactionCountResponse } from "../api/PostReactionCountResponse";
import { UserPostReactionResponse } from "../api/UserPostReactionResponse";

type PostCardProps = {
  postId: number;
  content: string;
  author: UserResponse;
  creationDate: Date;
  likes: number | undefined;
  dislikes: number | undefined;
  deleteHandler: () => void;
  currentUserPostReaction: UserPostReactionResponse | undefined;
  isTopPost: boolean;
  onReactionsChanged: () => void;
  topPostRef: Ref<HTMLDivElement>;
};

export function PostCard({
  postId,
  content,
  author,
  creationDate,
  likes,
  dislikes,
  deleteHandler,
  currentUserPostReaction,
  isTopPost,
  onReactionsChanged,
  topPostRef,
}: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number>(likes ? likes : 0);
  const [dislikeCount, setDislikeCount] = useState<number>(
    dislikes ? dislikes : 0
  );
  const [postContent, setPostContent] = useState<string>(content);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(postContent);
  const [userPostReaction, setUserPostReaction] = useState<
    UserPostReactionResponse | undefined
  >(currentUserPostReaction);
  const [userLatestReactionType, setUserLatestReactionType] = useState<
    PostReactionType | undefined
  >();

  const authContext = useContext(AuthContext);

  useEffect(() => setLikeCount(likes ? likes : 0), [likes]);

  useEffect(() => setDislikeCount(dislikes ? dislikes : 0), [dislikes]);

  useEffect(() => {
    if (currentUserPostReaction === undefined) {
      return;
    }

    setUserPostReaction(currentUserPostReaction);
    setUserLatestReactionType(currentUserPostReaction?.postReactionType);
  }, [currentUserPostReaction]);

  function reactToPost(reactionType: PostReactionType) {
    if (reactionType !== userLatestReactionType) {
      postCreateUserPostReactionRequest({
        postId: postId,
        postReactionType: reactionType,
      }).then((response) => {
        setLikeAndDislikeCountFromResponse(response.data);
        setUserPostReaction(response.data);
        setUserLatestReactionType(reactionType);

        onReactionsChanged();
      });
    } else {
      if (userPostReaction !== undefined) {
        deleteUserPostReaction(userPostReaction.id).then((response) => {
          setLikeAndDislikeCountFromResponse(response.data);
          setUserPostReaction(undefined);
          setUserLatestReactionType(undefined);

          onReactionsChanged();
        });
      }
    }
  }

  function setLikeAndDislikeCountFromResponse(
    response: UserPostReactionResponse | PostReactionCountResponse[]
  ) {
    let source;
    if (!Array.isArray(response)) {
      source = (response as UserPostReactionResponse).reactionTypesCount;
    } else {
      source = response as PostReactionCountResponse[];
    }

    const postLikeCountInfo = source.find(
      (reactionTypeCount) =>
        reactionTypeCount.postReactionType === PostReactionType.LIKE
    );
    const postDislikeCountInfo = source.find(
      (reactionTypeCount) =>
        reactionTypeCount.postReactionType === PostReactionType.DISLIKE
    );
    if (postLikeCountInfo) {
      setLikeCount(postLikeCountInfo.count);
    }
    if (postDislikeCountInfo) {
      setDislikeCount(postDislikeCountInfo.count);
    }
  }

  function editHandler() {
    setEditing(true);
  }

  function saveConfirmHandler() {
    setEditing(false);

    postEditPostRequest(postId, {
      content: editedContent,
    }).then(() => {
      setPostContent(editedContent);
    });
  }

  let rotDivProps = isTopPost ? { ref: topPostRef } : {};

  return (
    <div {...rotDivProps} className="flex flex-col gap-y-1">
      {isTopPost && (
        <Typography variant="text" element="p">
          <strong className="text-green-600">Top post!</strong>
        </Typography>
      )}
      <Card
        className={
          isTopPost ? "border-2 border-green-600 shadow-green-600" : "border-2"
        }
      >
        <div className="flex flex-col sm:flex-row">
          <div className="w-full flex-shrink-0 border-b-2 sm:w-1/4 sm:border-b-0 sm:border-r-2 pt-3 pb-3 overflow-hidden">
            <div className="flex flex-row space-x-3 sm:space-x-0 sm:flex-col sm:space-y-3 -sm:justify-between">
              <Link to={`/profile/${author.id}`}>
                <div className="flex flex-row gap-x-3 sm:flex-col sm:gap-y-3 sm:gap-x-0">
                  <div className="sm:hidden ml-3">
                    <Avatar name={author.username} size="50" round={true} />
                  </div>
                  <div className="hidden sm:block text-center">
                    <Avatar
                      name={author.username}
                      size="80"
                      round={true}
                      className="sm:mx-auto"
                    />
                  </div>
                  <div className="items-center flex flex-row sm:w-3/2 sm:mx-auto">
                    <Typography
                      variant="h5"
                      element="h5"
                      className="w-full text-center truncate "
                    >
                      {author.username}
                    </Typography>
                  </div>
                </div>
              </Link>
              <div className="-sm:justify-end -sm:pr-3 text-center items-center my-auto sm:my-0">
                <Typography variant="text" element="p">
                  Reputation: {author.reputation}
                </Typography>
                <Typography
                  variant="subtext"
                  element="p"
                  className="hidden sm:block"
                >
                  ({getReputationBadgeTitle(author ? author.reputation : 0)})
                </Typography>
              </div>
              <div className="hidden sm:block flex flex-row gap-x-1 sm:flex-col -sm:justify-end -sm:pr-3 text-center items-center my-auto sm:my-0">
                <Typography variant="subtitle" element="p">
                  Joined
                </Typography>
                <Typography variant="text" element="p">
                  {formatDate(author.joinDate)}
                </Typography>
              </div>
            </div>
          </div>
          <div className="flex flex-col grow">
            <div className="border-b h-full p-3 flex flex-col space-y-3">
              <div className="flex justify-end">
                <Typography variant="subtitle" element="p">
                  {formatDate(creationDate)}
                </Typography>
              </div>
              {editing ? (
                <Textarea
                  name="content"
                  value={editedContent}
                  onChange={(event) => setEditedContent(event.target.value)}
                />
              ) : (
                <div className="overflow-hidden">
                  <Typography variant="text" element="p">
                    <pre className="whitespace-normal">{postContent}</pre>
                  </Typography>
                </div>
              )}
            </div>
            <div className="p-3">
              <Typography variant="subtext" element="p">
                <pre>{author.bio ? author.bio : "No bio yet"}</pre>
              </Typography>
            </div>
          </div>
        </div>
        <Card.Footer className="bg-gray-100">
          <div className="flex flex-row justify-between">
            <div className="flex flex-row space-x-5">
              <div className="flex flex-row items-center">
                <IconButton
                  icon={<Icon type="arrow-up" />}
                  title="like"
                  showTooltip={false}
                  onClick={() => reactToPost(PostReactionType.LIKE)}
                  disabled={authContext.loggedInUser === undefined}
                />
                <Typography variant="text" element="p">
                  {likeCount}
                </Typography>
              </div>
              <div className="flex flex-row items-center">
                <IconButton
                  icon={<Icon type="arrow-down" />}
                  title="dislike"
                  showTooltip={false}
                  onClick={() => reactToPost(PostReactionType.DISLIKE)}
                  disabled={authContext.loggedInUser === undefined}
                />
                <Typography variant="text" element="p">
                  {dislikeCount}
                </Typography>
              </div>
            </div>
            <div>
              {editing ? (
                <div className="flex flex-row space-x-3">
                  <Button
                    variant="filled"
                    color="success"
                    onClick={saveConfirmHandler}
                  >
                    Save
                  </Button>
                  <Button
                    variant="filled"
                    color="danger"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              ) : (
                (authContext.loggedInUser?.role === UserRole.ADMIN ||
                  authContext.loggedInUser?.id === author.id) && (
                  <div className="flex flex-row space-x-3">
                    <IconButton
                      icon={<Icon type="pencil" />}
                      title="edit"
                      showTooltip={false}
                      onClick={editHandler}
                    />

                    <IconButton
                      icon={<Icon type="trash" />}
                      title="delete"
                      showTooltip={false}
                      onClick={deleteHandler}
                    />
                  </div>
                )
              )}
            </div>
          </div>
        </Card.Footer>
      </Card>
    </div>
  );
}
