import { useCallback, useContext, useEffect, useRef, useState } from "react";

import { Breadcrumbs, Button, Pagination, Typography } from "@tiller-ds/core";
import { TextareaField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import InfiniteScroll from "react-infinite-scroll-component";
import { Link, useParams } from "react-router-dom";
import * as yup from "yup";

import { UserResponse } from "../../common/api/UserResponse";
import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { getUserById } from "../../user/api/getUserById";
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
  const [conversationPage, setConversationPage] = useState<number>(0);
  const [totalMessages, setTotalMessages] = useState<number>(0);
  const [conversations, setConversations] = useState<ConversationResponse[]>(
    []
  );
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationResponse>();
  const [totalConversations, setTotalConversations] = useState<number>(0);
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [messagePage, setMessagePage] = useState<number>(0);
  const [dataLen, setDataLen] = useState<number>(5);
  const [render, setRender] = useState<boolean>(false);

  const messageContainerRef = useRef(null);
  const authContext = useContext(AuthContext);
  const params = useParams();

  // effects start here

  // load conversations
  useEffect(() => {
    postSearchConversationsRequestPageable({
      pageNumber: conversationPage,
      pageSize: 5,
    }).then((response) => {
      setConversations(response.data.content);
      setTotalConversations(response.data.totalElements);
    });
  }, [conversationPage]);

  // if the user has been redirected to a chat from somewhere else,
  // open the conversation or create a mock conversation
  // if the two users have not communicated before
  useEffect(() => {
    if (!params.recipientId || !authContext.loggedInUser) {
      return;
    }

    const currentUser = authContext.loggedInUser;
    const recipientId = Number(params.recipientId);
    const conversationMatch = conversations.find(
      (conversation) =>
        getRecipientFromConversation(conversation, currentUser.id).id ===
        recipientId
    );

    if (conversationMatch) {
      setSelectedConversation(conversationMatch);
    } else {
      getUserById(recipientId).then((response) => {
        if (response.isOk) {
          // mock conversation so the first message can be sent, after which a real conversation will be created
          const mockedConversation = createNewMockedConversation(
            currentUser,
            response.data
          );
          setSelectedConversation(mockedConversation);
          setConversations((prevState) => [...prevState, mockedConversation]);
        }
      });
    }
    //eslint-disable-next-line
  }, [totalConversations]);

  // get info about how many pages there are.
  // also fetch last page, and fetch the one before that because sometimes
  // the latest page can have less than 5 elements.
  useEffect(() => {
    if (!selectedConversation || selectedConversation.id === -1) {
      return;
    }

    postSearchMessagePageableRequest({
      conversationId: selectedConversation.id,
      pageSize: 5,
      pageNumber: 0,
    }).then((response) => {
      setTotalMessages(response.data.totalElements);
      setDataLen(5);

      if (response.data.totalPages > 1) {
        setMessagePage(response.data.totalPages - 1);
      } else {
        setMessagePage(0);
      }

      if (response.data.totalPages >= 1) {
        let lastMsgPage = response.data.totalPages - 1;
        fetchMessagesForConversation(
          selectedConversation.id,
          lastMsgPage,
          true
        );

        if (lastMsgPage > 0) {
          lastMsgPage -= 1;
          fetchMessagesForConversation(
            selectedConversation.id,
            lastMsgPage,
            false
          );
        }

        setMessagePage(lastMsgPage);
      }
    });
    //eslint-disable-next-line
  }, [selectedConversation]);

  // update data len
  useEffect(() => setDataLen(messages.length), [messages]);

  // handlers start here

  function formSubmitHandler(form: Form) {
    if (!selectedConversation || !authContext.loggedInUser) {
      return;
    }

    let promise;
    promise = postCreateMessageRequest({
      content: form.content,
      recipientId: getRecipientFromConversation(
        selectedConversation,
        authContext.loggedInUser.id
      ).id,
    });

    if (promise) {
      promise.then((response) => {
        setMessages((prevState) => {
          prevState.unshift(response.data);
          return [...prevState];
        });
        setTotalMessages((prevState) => prevState + 1);
      });
    }
  }

  // when conversation is selected, mark all messages as read
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

          return conversation;
        });

        return prevState;
      });
    }
  }, [selectedConversation]);

  // util functions start here

  const fetchMessagesForConversation = useCallback(
    (conversationId: number, page: number, clearExistingMessages: boolean) => {
      postSearchMessagePageableRequest({
        pageSize: 5,
        pageNumber: page,
        conversationId: conversationId,
      }).then((response) => {
        if (clearExistingMessages) {
          setMessages(response.data.content.reverse());
        } else {
          setMessages((prevState) => [
            ...prevState,
            ...response.data.content.reverse(),
          ]);
        }
      });
    },
    []
  );

  function getRecipientFromConversation(
    conversation: ConversationResponse,
    currentUserId: number
  ): UserResponse {
    return conversation.participantA.id === currentUserId
      ? conversation.participantB
      : conversation.participantA;
  }

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

  function isCurrentUserOwnerOfMessage(message: MessageResponse) {
    return authContext.loggedInUser?.id === message.author.id;
  }

  const createNewMockedConversation = useCallback(
    (currentUser: UserResponse, otherParticipant: UserResponse) => {
      return {
        participantA: currentUser,
        participantB: otherParticipant,
        id: -1,
        unreadMessages: 0,
        latestMessageDateTime: new Date(),
      };
    },

    []
  );

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
                <div className="flex flex-col gap-y-3">
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
                      pageNumber={conversationPage}
                      pageSize={5}
                      totalElements={totalConversations}
                      onPageChange={setConversationPage}
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
                      if (
                        selectedConversation &&
                        selectedConversation.id !== -1 &&
                        messagePage > 0
                      ) {
                        fetchMessagesForConversation(
                          selectedConversation.id,
                          messagePage - 1,
                          false
                        );
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
                        className={`max-w-1/2 flex flex-row mx-3 ${
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
