import { useState } from "react";

import { Button, Card, IconButton, Typography } from "@tiller-ds/core";
import { Textarea } from "@tiller-ds/form-elements";
import { Icon } from "@tiller-ds/icons";

import Avatar from "react-avatar";

import { UserResponse } from "../../common/api/UserResponse";
import { formatDate } from "../../util/dateUtil";
import { dislikePost } from "../api/dislikePost";
import { getPost } from "../api/getPost";
import { likePost } from "../api/likePost";
import { postEditPostRequest } from "../api/postEditPostRequest";

type PostCardProps = {
  postId: number;
  content: string;
  author: UserResponse;
  creationDate: Date;
  likes: number;
  dislikes: number;
  deleteHandler: () => void;
};

export function PostCard({
  postId,
  content,
  author,
  creationDate,
  likes,
  dislikes,
  deleteHandler,
}: PostCardProps) {
  const [likeCount, setLikeCount] = useState<number>(likes);
  const [dislikeCount, setDislikeCount] = useState<number>(dislikes);
  const [postContent, setPostContent] = useState<string>(content);
  const [editing, setEditing] = useState<boolean>(false);
  const [editedContent, setEditedContent] = useState<string>(postContent);

  function likeHandler() {
    getPost(postId).then((postObj) => {
      const newLikeCount = postObj.likes + 1;
      likePost(postId).then(() => setLikeCount(newLikeCount));
    });
  }

  function dislikeHandler() {
    getPost(postId).then((postObj) => {
      const newDislikeCount = postObj.dislikes + 1;
      dislikePost(postId).then(() => setDislikeCount(newDislikeCount));
    });
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

  return (
    <Card className="border-2">
      <div className="flex flex-col sm:flex-row">
        <div className="w-full border-b-2 sm:w-1/4 sm:border-b-0 sm:border-r-2 pt-3 pb-3 overflow-hidden">
          <div className="flex flex-row space-x-3 sm:space-x-0 sm:flex-col sm:space-y-3 -sm:justify-between">
            <div className="sm:hidden ml-3">
              <Avatar name={author.username} size="50" round={true} />
            </div>
            <div className="-sm:hidden text-center">
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
            <div className="-sm:justify-end -sm:pr-3 text-center">
              <Typography variant="subtitle" element="p">
                Joined
              </Typography>
              <Typography variant="text" element="p">
                {formatDate(author.joinDate)}
              </Typography>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full">
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
                  {postContent}
                </Typography>
              </div>
            )}
          </div>
          <div className="p-3">
            <Typography variant="text" element="p">
              {"Bio placeholder"}
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
                onClick={likeHandler}
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
                onClick={dislikeHandler}
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
            )}
          </div>
        </div>
      </Card.Footer>
    </Card>
  );
}
