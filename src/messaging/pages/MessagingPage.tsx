import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { Breadcrumbs, Button, Pagination, Typography } from "@tiller-ds/core";
import { TextareaField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { UserResponse } from "../../common/api/UserResponse";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { ConversationResponse } from "../api/ConversationResponse";
import { deleteMessage } from "../api/deleteMessage";
import { MessageResponse } from "../api/MessageResponse";
import { postCreateMessageRequest } from "../api/postCreateMessageRequest";
import { postMarkMessagesAsReadRequest } from "../api/postMarkMessagesAsReadRequest";
import { postSearchConversationsRequestPageable } from "../api/postSearchConversationsRequestPageable";
import { postSearchMessagePageableRequest } from "../api/postSearchMessagePageableRequest";
import { ConversationCard } from "../components/ConversationCard";
import { MessageBubble } from "../components/MessageBubble";

type Form = {
  content: string;
};

const initialFormValues = {
  content: "",
} as Form;

const formValidationSchema = yup.object().shape({
  content: yup
    .string()
    .required(INPUT_REQUIRED_MESSAGE)
    .min(3, INPUT_TOO_SHORT_MESSAGE)
    .max(300, INPUT_TOO_LONG_MESSAGE),
});

export function MessagingPage() {
  const [page, setPage] = useState<number>(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse>();
  const [totalConversations, setTotalConversations] = useState<number>(0);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [messagePage, setMessagePage] = useState<number>(0);
  const [totalMessagePages, setTotalMessagePages] = useState<number>(0);
  const [initialMessageFetch, setInitialMessageFetch] =
    useState<boolean>(false);
  const [dataLen, setDataLen] = useState<number>(5);
  const [render, setRender] = useState<boolean>(false);

  const messageContainerRef = useRef(null);
  const authContext = useContext(AuthContext);

  const fetchMessages = useCallback(
    (conversationId: number, requestPage: number) => {
      console.log("fetching page " + requestPage);
      postSearchMessagePageableRequest({
        pageSize: 5,
        pageNumber: requestPage,
        conversationId: conversationId,
      }).then((response) => {
        setMessages((prevState) => [...prevState, ...response.data.content]);
        setTotalMessages(response.data.totalElements);
        setDataLen((prevState) => prevState + 5);
        setMessagePage(requestPage);
        if (!initialMessageFetch) {
          setTotalMessagePages(response.data.totalPages);
          setMessagePage(response.data.totalPages - 1);
          setInitialMessageFetch(true);
        }
      });
    },
    [initialMessageFetch]
  );

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation?.id, totalMessagePages - 1);
    }
    //eslint-disable-next-line
  }, [totalMessages]);

  function isCurrentUserOwnerOfMessage(message: MessageResponse) {
    return authContext.loggedInUser?.id === message.author.id;
  }

  function formSubmitHandler(form: Form) {
    if (selectedConversation && authContext.loggedInUser) {
      postCreateMessageRequest({
        content: form.content,
        recipientId: getRecipientFromConversation(
          selectedConversation,
          authContext.loggedInUser.id
        ).id,
      }).then((response) => {
        setMessages((prevState) => {
          prevState.unshift(response.data);
          return [...prevState];
        });
        setTotalMessages((prevState) => prevState + 1);
      });
    }
  }

  useEffect(() => {
    if (!authContext.loggedInUser) {
      return;
    }

    postSearchConversationsRequestPageable({
      pageNumber: page,
      pageSize: 5,
    }).then((response) => {
      setConversations(response.data.content);
      setTotalConversations(response.data.totalElements);
    });
  }, [authContext.loggedInUser, page]);

  useEffect(() => {
    if (!selectedConversation) {
      return;
    }

    fetchMessages(selectedConversation.id, messagePage);
    // eslint-disable-next-line
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      postMarkMessagesAsReadRequest({
        conversationId: selectedConversation.id,
      }).then((response) => {
        if (response.isOk) {
          setMessages((prevState) => {
            let prevStateClone = [...prevState];
            prevStateClone.map((message) => {
              if (message.conversation.id === selectedConversation.id) {
                message.isRead = true;
              }

              return message;
            });

            return prevStateClone;
          });
        }
      });

      setConversations((prevState) => {
        prevState.map((conversation) => {
          if (conversation.id === selectedConversation.id) {
            conversation.unreadMessages = 0;
          }
        });

        return prevState;
      });
    }
  }, [selectedConversation]);

  function deleteMessageHandler(id: number) {
    deleteMessage(id).then((response) => {
      if (response.isOk) {
        setMessages((prevState) => {
          prevState.map((message) => {
            if (message.id === id) {
              message.deleted = true;
            }

            return message;
          });

          return prevState;
        });
        setRender((prevState) => !prevState);
      }
    });
  }

  function getRecipientFromConversation(
    conversation: ConversationResponse,
    currentUserId: number
  ): UserResponse {
    return conversation.participantA.id === currentUserId
      ? conversation.participantB
      : conversation.participantA;
  }

  return (
    <div className="m-10">
      <div className="container mx-auto max-w-5xl">
        <Breadcrumbs icon={<Icon type="caret-right" />}>
          <Breadcrumbs.Breadcrumb>
            <Link to="/home">Home</Link>
          </Breadcrumbs.Breadcrumb>
          <Breadcrumbs.Breadcrumb>Messaging</Breadcrumbs.Breadcrumb>
        </Breadcrumbs>
        <div className="mt-20">
          <div className="flex flex-row gap-x-3">
            <div className="w-1/3 h-[570px] flex flex-col border">
              <div className="flex flex-row justify-center bg-slate-300">
                <Typography variant="title" element="h4">
                  Conversations
                </Typography>
              </div>
              <div className="flex flex-col justify-between p-3 mt-3 h-full">
                <div>
                  {conversations.map((conversation) => (
                    <ConversationCard
                      user={
                        authContext.loggedInUser
                          ? getRecipientFromConversation(
                              conversation,
                              authContext.loggedInUser.id
                            )
                          : undefined
                      }
                      latestPostDate={conversation.latestMessageDateTime}
                      unreadMessages={conversation.unreadMessages}
                      clickCallback={() =>
                        setSelectedConversation(conversation)
                      }
                    />
                  ))}
                </div>

                <div className="flex flex-row justify-center">
                  <div>
                    <Pagination
                      className="mx-auto"
                      pageNumber={page}
                      pageSize={5}
                      totalElements={totalConversations}
                      onPageChange={setPage}
                      tokens={{
                        default: {
                          backgroundColor: "none",
                          textColor: "text-slate-600",
                          borderColor: "none",
                        },
                        current: {
                          backgroundColor: "none hover:bg-navy-100",
                          textColor: "text-slate-600",
                          borderColor: "border-none",
                        },
                        pageSummary: {
                          fontSize: "text-sm",
                          lineHeight: "leading-5",
                        },
                      }}
                    >
                      {() => null}
                    </Pagination>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col h-[570px] flex-grow border">
              <div
                style={{
                  height: 490,
                  overflow: "scroll",
                  display: "flex",
                  flexDirection: "column-reverse",
                }}
                ref={messageContainerRef}
              >
                {messageContainerRef.current && selectedConversation && (
                  <InfiniteScroll
                    className="flex flex-col gap-y-3"
                    style={{
                      display: "flex",
                      flexDirection: "column-reverse",
                      overflow: "hidden",
                    }}
                    inverse={true}
                    scrollableTarget={messageContainerRef.current}
                    next={() => {
                      if (selectedConversation && messagePage > 0) {
                        fetchMessages(selectedConversation.id, messagePage - 1);
                        setMessagePage((prevState) => prevState - 1);
                      }
                    }}
                    hasMore={messages.length < totalMessages}
                    loader={
                      <div className="flex flex-row justify-center">
                        <Typography variant="subtext">Loading...</Typography>
                      </div>
                    }
                    endMessage={
                      <div className="flex flex-row justify-center">
                        <Typography variant="subtext">
                          This is the start of your conversation
                        </Typography>
                      </div>
                    }
                    dataLength={dataLen}
                  >
                    {messages.map((message) => (
                      <div
                        className={`max-w-1/2 flex flex-row ${
                          isCurrentUserOwnerOfMessage(message)
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <MessageBubble
                          message={message}
                          showControls={isCurrentUserOwnerOfMessage(message)}
                          deleteCallback={() =>
                            deleteMessageHandler(message.id)
                          }
                        />
                      </div>
                    ))}
                  </InfiniteScroll>
                )}
                {!selectedConversation && (
                  <div className="h-full flex items-center justify-center">
                    <div className="flex justify-center">
                      <Typography variant="subtext" element="p">
                        Select a conversation
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
              {selectedConversation && (
                <div className="mt-3">
                  <Formik
                    initialValues={initialFormValues}
                    onSubmit={(values, { resetForm }) => {
                      formSubmitHandler(values);
                      resetForm();
                    }}
                    validationSchema={formValidationSchema}
                  >
                    {(formik) => (
                      <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-x-3">
                          <TextareaField
                            name="content"
                            className="flex-grow h-[60px] border-x-0 border-b-0"
                            tokens={{
                              borderRadius: "rounded-none",
                            }}
                          />
                          <div>
                            <Button
                              variant="filled"
                              color="primary"
                              type="submit"
                              className="w-full max-h-10 rounded-none"
                            >
                              Send
                            </Button>
                          </div>
                        </div>
                      </form>
                    )}
                  </Formik>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
