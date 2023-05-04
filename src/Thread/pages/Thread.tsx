import {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useModal } from "@tiller-ds/alert";
import {
  Breadcrumbs,
  Button,
  Card,
  Pagination,
  Typography,
} from "@tiller-ds/core";
import { DateInput } from "@tiller-ds/date";
import { Input, NumberInput } from "@tiller-ds/form-elements";
import { TextareaField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";
import { DropdownMenu } from "@tiller-ds/menu";

import { Formik } from "formik";
import moment from "moment/moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import * as yup from "yup";

import { CategoryResponse } from "../../common/api/CategoryResponse";
import { PostResponse } from "../../common/api/PostResponse";
import { putEditThreadRequest } from "../../common/api/putEditThreadRequest";
import { ThreadResponse } from "../../common/api/ThreadResponse";
import { UserRole } from "../../common/api/UserRole";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  POST_CONTENT_TOO_LONG_MESSAGE,
  POST_CONTENT_TOO_SHORT_MESSAGE,
  PostReactionType,
} from "../../common/constants";
import { ConfirmDeleteModal } from "../../common/pages/ConfirmDeleteModal";
import { EditTitleModal } from "../../common/pages/EditTitleModal";
import { deletePost } from "../api/deletePost";
import { deleteThread } from "../api/deleteThread";
import { getCategoryById } from "../api/getCategoryById";
import { getThreadById } from "../api/getThreadById";
import { postCreatePostRequest } from "../api/postCreatePostRequest";
import { postPostSearchRequest } from "../api/postPostSearchRequest";
import { PostReactionCountResponse } from "../api/PostReactionCountResponse";
import { postSearchPostReactionCountRequest } from "../api/postSearchPostReactionCountRequest";
import { postSearchUserPostReactionRequest } from "../api/postSearchUserPostReactionRequest";
import { SearchPostsRequest } from "../api/SearchPostsRequest";
import { UserPostReactionResponse } from "../api/UserPostReactionResponse";
import { PostCard } from "../components/PostCard";

type PostScore = {
  post: PostResponse;

  score: number;
};

type PostForm = {
  content: string;
};

const initialPostFormValues = {
  content: "",
} as PostForm;

const postFormValidationSchema = yup.object().shape({
  content: yup
    .string()
    .min(3, POST_CONTENT_TOO_SHORT_MESSAGE)
    .max(200, POST_CONTENT_TOO_LONG_MESSAGE)
    .required(POST_CONTENT_TOO_SHORT_MESSAGE),
});

export function Thread() {
  const params = useParams();

  const [filterFormOpen, setFilterFormOpen] = useState<boolean>(false);
  const [posts, setPosts] = useState<PostResponse[]>();
  const [postReactionsCounts, setPostReactionsCounts] = useState<
    PostReactionCountResponse[]
  >([]);
  const [currentUserPostReactions, setCurrentUserPostReactions] = useState<
    UserPostReactionResponse[]
  >([]);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [usernameFilter, setUsernameFilter] = useState<string>();
  const [likeFilter, setLikeFilter] = useState<number>();
  const [dislikeFilter, setDislikeFilter] = useState<number>();
  const [parentCategory, setParentCategory] = useState<CategoryResponse>();
  const [thread, setThread] = useState<ThreadResponse>();
  const [topPost, setTopPost] = useState<PostResponse>();
  const [page, setPage] = useState<number>();
  const [totalPosts, setTotalPosts] = useState<number>();
  const [filterUsed, setFilterUsed] = useState<boolean>(false);

  const threadId = Number(params.threadId);
  const categoryId = params.categoryId ? Number(params.categoryId) : undefined;
  const defaultSearchPostRequest = {
    threadId: threadId,
  } as SearchPostsRequest;
  const authContext = useContext(AuthContext);
  const topPostRef = useRef<HTMLDivElement>(null);
  const editModal = useModal();
  const confirmDeleteThreadModal = useModal();
  const confirmDeletePostModal = useModal();
  const navigate = useNavigate();

  const updatePostList = useCallback((request: SearchPostsRequest) => {
    setPosts([]);

    postPostSearchRequest(request).then((response) => {
      setPosts(response.data.content);
      setTotalPosts(response.data.totalElements);
    });
  }, []);

  const findTopPost = useCallback(() => {
    if (postReactionsCounts.length > 0 && posts) {
      // for each post, get score which is likes - dislikes
      const postScores = posts.map((post) => {
        const postReactions = postReactionsCounts.filter(
          (reaction) => reaction.postId === post.id
        );
        const postLikes = postReactions
          .filter(
            (reaction) => reaction.postReactionType === PostReactionType.LIKE
          )
          .reduce((acc, reaction) => acc + reaction.count, 0);
        const postDislikes = postReactions
          .filter(
            (reaction) => reaction.postReactionType === PostReactionType.DISLIKE
          )
          .reduce((acc, reaction) => acc + reaction.count, 0);

        return { post: post, score: postLikes - postDislikes } as PostScore;
      });

      // get post with max score
      let firstPostScore = postScores.find((score) => score.score > 0);
      let top = firstPostScore ? [firstPostScore] : [];
      if (top.length > 0) {
        postScores.forEach((postScore) => {
          //  skip comparing first post (initial top post) to itself
          if (postScore !== firstPostScore) {
            if (postScore.score > top[0].score) {
              top = [postScore];
            } else if (postScore.score === top[0].score) {
              top.push(postScore);
            }
          }
        });
      }

      // if two posts have the max score, set uop post to undefined, otherwise set to post with max score
      if (top.length === 1) {
        setTopPost(top[0].post);
      } else {
        setTopPost(undefined);
      }
    }
  }, [postReactionsCounts, posts]);

  const fetchPostReactionCounts = useCallback(() => {
    if (posts === undefined || posts.length === 0) {
      return;
    }

    postSearchPostReactionCountRequest({
      postIds: posts.map((post) => post.id),
    }).then((response) => {
      setPostReactionsCounts(response.data);
    });
  }, [posts]);

  useEffect(() => {
    updatePostList({
      ...defaultSearchPostRequest,
      pageNumber: page,
      pageSize: 10,
    });
    // eslint-disable-next-line
  }, [updatePostList, page]);

  useEffect(() => {
    if (categoryId) {
      getCategoryById(categoryId).then((response) =>
        setParentCategory(response.data)
      );
    }

    if (threadId) {
      getThreadById(threadId).then((response) => setThread(response.data));
    }
  }, [categoryId, threadId]);

  useEffect(() => {
    fetchPostReactionCounts();
  }, [fetchPostReactionCounts]);

  // eslint-disable-next-line
  useEffect(() => findTopPost(), [postReactionsCounts]);

  useEffect(() => {
    if (authContext.loggedInUser === undefined || posts === undefined) {
      return;
    }

    postSearchUserPostReactionRequest({
      postIds: posts.map((post) => post.id),
      userId: authContext.loggedInUser.id,
    }).then((response) => setCurrentUserPostReactions(response.data));
    // eslint-disable-next-line
  }, [posts]);

  function filterFormSubmitHandler(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    let request = {
      threadId: threadId,
      authorUsername: usernameFilter,
      likesFromIncluding: likeFilter,
      dislikesFromIncluding: dislikeFilter,
    } as SearchPostsRequest;

    if (startDate !== null) {
      request.creationDateTimeFromIncluding = moment(startDate)
        .add(1, "day")
        .toDate();
    }
    if (endDate !== null) {
      request.creationDateTimeToIncluding = moment(endDate)
        .add(1, "day")
        .toDate();
    }

    updatePostList(request);

    setFilterUsed(true);
  }

  function resetFilter() {
    if (filterUsed) {
      updatePostList({
        threadId: threadId,
        pageNumber: page,
      });

      setFilterUsed(false);
    }

    setFilterFormOpen(false);
  }

  function postInputFormSubmitHandler(form: PostForm) {
    postCreatePostRequest({
      threadId: threadId,
      content: form.content,
    }).then((response) => {
      if (posts !== undefined) {
        setPosts((prevState) => {
          if (prevState) {
            prevState.push(response.data);
            return prevState;
          }
          return [response.data];
        });

        updatePostList(defaultSearchPostRequest);
      }
    });
  }

  function cardDeleteHandler(postId: number) {
    deletePost(postId).then(() => updatePostList(defaultSearchPostRequest));
  }

  function getReactionCountForPost(
    reactionType: PostReactionType,
    postId: number
  ): PostReactionCountResponse | undefined {
    return postReactionsCounts.find(
      (reaction) =>
        reaction.postId === postId && reaction.postReactionType === reactionType
    );
  }

  function getCurrentUserReactionForPost(
    postId: number
  ): UserPostReactionResponse | undefined {
    return currentUserPostReactions.find(
      (postReaction) => postReaction.postId === postId
    );
  }

  function deleteThisThread() {
    if (!thread) {
      return;
    }

    deleteThread(thread.id)
      .then(() => {
        const pathParts = window.location.pathname
          .split("/")
          .filter((part) => part.length > 0);
        if (pathParts[0] === "news") {
          navigate("/news");
        } else {
          navigate(`/forum/${pathParts[pathParts.length - 2]}`);
        }
      })
      .catch();
  }

  function editTitle(newTitle: string) {
    if (!thread) {
      return;
    }

    putEditThreadRequest(threadId, {
      title: newTitle,
    }).then((response) => {
      if (response.isOk) {
        setThread(response.data);
      }
    });
  }

  return (
    <>
      <div className="m-3 sm:m-10">
        <div className="container mx-auto max-w-5xl">
          <Breadcrumbs icon={<Icon type="caret-right" />}>
            <Breadcrumbs.Breadcrumb>
              <Link to="/home">Home</Link>
            </Breadcrumbs.Breadcrumb>
            {parentCategory ? (
              <div>
                <Breadcrumbs icon={<Icon type="caret-right" />}>
                  <Breadcrumbs.Breadcrumb>
                    <Link to="/forum">Forum</Link>
                  </Breadcrumbs.Breadcrumb>
                  <Breadcrumbs.Breadcrumb>
                    <Link to={`/forum/${parentCategory.id}`}>
                      {parentCategory.title}
                    </Link>
                  </Breadcrumbs.Breadcrumb>
                </Breadcrumbs>
              </div>
            ) : (
              <Breadcrumbs.Breadcrumb>
                <Link to="/news">News</Link>
              </Breadcrumbs.Breadcrumb>
            )}
            <Breadcrumbs.Breadcrumb>{thread?.title}</Breadcrumbs.Breadcrumb>
          </Breadcrumbs>
          <div className="mt-20">
            <div className="flex flex-col space-y-20">
              <div className="flex flex-row justify-between">
                <div className="flex flex-col gap-y-3">
                  <Typography variant="h1" element="h1">
                    {thread?.title}
                  </Typography>
                  {topPost && (
                    <div
                      className="flex flex-row gap-x-3"
                      onClick={() =>
                        topPostRef.current &&
                        topPostRef.current.scrollIntoView()
                      }
                    >
                      <Button
                        variant="text"
                        color="primary"
                        trailingIcon={
                          <Icon type="arrow-right" variant="fill" />
                        }
                        onClick={() =>
                          topPostRef.current &&
                          topPostRef.current.scrollIntoView({
                            behavior: "smooth",
                          })
                        }
                      >
                        <Typography variant="subtext" element="p">
                          Go to top post
                        </Typography>
                      </Button>
                    </div>
                  )}
                </div>
                <DropdownMenu title="Actions" color="primary">
                  <DropdownMenu.Item
                    onSelect={() => setFilterFormOpen(!filterFormOpen)}
                  >
                    Filter
                  </DropdownMenu.Item>
                  {(authContext.loggedInUser?.id === thread?.author.id ||
                    authContext.loggedInUser?.role === UserRole.ADMIN) && (
                    <div>
                      <DropdownMenu.Item
                        onSelect={() => editModal.onOpen(null)}
                      >
                        Edit
                      </DropdownMenu.Item>
                      <DropdownMenu.Item
                        onSelect={() => confirmDeleteThreadModal.onOpen(null)}
                      >
                        Delete
                      </DropdownMenu.Item>
                    </div>
                  )}
                </DropdownMenu>
              </div>
              {filterFormOpen && (
                <Card className="flex flex-col space-y-10">
                  <Card.Body className="bg-gray-200">
                    <form onSubmit={filterFormSubmitHandler}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-5">
                        <div>
                          <Input
                            name="author"
                            placeholder="Author"
                            onChange={(event) =>
                              setUsernameFilter(event.target.value)
                            }
                            label="Author"
                          />
                          <NumberInput
                            name="minLikes"
                            placeholder="Min likes"
                            onChange={setLikeFilter}
                            label="Min likes"
                            className="mt-5"
                          />
                        </div>
                        <div>
                          <DateInput
                            name="startDate"
                            onChange={setStartDate}
                            value={startDate}
                            maxDate={endDate === null ? new Date() : endDate}
                            onReset={() => setStartDate(null)}
                            label="Start date"
                            className="mt-5 sm:mt-0"
                          />
                          <NumberInput
                            name="minDislikes"
                            placeholder="Min dislikes"
                            onChange={setDislikeFilter}
                            label="Min dislikes"
                            className="mt-5"
                          />
                        </div>
                        <div>
                          <DateInput
                            name="endDate"
                            onChange={setEndDate}
                            value={endDate}
                            minDate={
                              startDate === null ? new Date() : startDate
                            }
                            onReset={() => setEndDate(null)}
                            label="End date"
                            className="mt-5 md:mt-0"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col-reverse space-y-reverse space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-end mt-10">
                        <Button
                          variant="filled"
                          color="danger"
                          className="w-full sm:w-fit"
                          onClick={() => resetFilter()}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="filled"
                          color="primary"
                          className="w-full sm:w-fit"
                          type="submit"
                        >
                          Apply
                        </Button>
                      </div>
                    </form>
                  </Card.Body>
                </Card>
              )}
              <div className="flex flex-col space-y-10">
                {posts !== undefined &&
                  posts.map((post) => (
                    <div>
                      <PostCard
                        postId={post.id}
                        content={post.content}
                        author={post.author}
                        creationDate={post.creationDateTime}
                        isTopPost={topPost?.id === post.id}
                        topPostRef={topPostRef}
                        onReactionsChanged={() => {
                          fetchPostReactionCounts();
                          findTopPost();
                        }}
                        likes={
                          getReactionCountForPost(
                            PostReactionType.LIKE,
                            post.id
                          )?.count
                        }
                        dislikes={
                          getReactionCountForPost(
                            PostReactionType.DISLIKE,
                            post.id
                          )?.count
                        }
                        deleteHandler={() =>
                          confirmDeletePostModal.onOpen(null)
                        }
                        currentUserPostReaction={getCurrentUserReactionForPost(
                          post.id
                        )}
                      />
                      <ConfirmDeleteModal
                        modal={confirmDeletePostModal}
                        confirmCallback={() => cardDeleteHandler(post.id)}
                      />
                    </div>
                  ))}
                {(posts === undefined || posts.length === 0) && (
                  <Typography
                    variant="subtext"
                    element="p"
                    className="text-center"
                  >
                    No posts at the moment
                  </Typography>
                )}
                {totalPosts !== undefined && totalPosts > 10 && (
                  <Pagination
                    pageNumber={page ? page : 0}
                    pageSize={10}
                    totalElements={totalPosts ? totalPosts : 0}
                    className="justify-start"
                    onPageChange={setPage}
                  >
                    {() => <></>}
                  </Pagination>
                )}
              </div>

              {authContext.loggedInUser &&
                !(
                  thread?.category.section.title.toLowerCase() === "news" &&
                  authContext.loggedInUser?.role !== UserRole.ADMIN
                ) && (
                  <Formik
                    initialValues={initialPostFormValues}
                    validationSchema={postFormValidationSchema}
                    onSubmit={(values, { resetForm }) => {
                      postInputFormSubmitHandler(values);
                      resetForm();
                    }}
                  >
                    {(formik) => (
                      <form onSubmit={formik.handleSubmit}>
                        <TextareaField
                          name="content"
                          placeholder="What would you like to say?"
                        />
                        <div className="flex flex-row sm:justify-end mt-5">
                          <Button
                            type="submit"
                            variant="filled"
                            color="primary"
                            className="w-full sm:w-fit"
                          >
                            Post
                          </Button>
                        </div>
                      </form>
                    )}
                  </Formik>
                )}
            </div>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        modal={confirmDeleteThreadModal}
        confirmCallback={() => deleteThisThread()}
      />
      <EditTitleModal
        modal={editModal}
        oldTitle={thread?.title}
        confirmCallback={(newTitle) => editTitle(newTitle)}
      />
    </>
  );
}
