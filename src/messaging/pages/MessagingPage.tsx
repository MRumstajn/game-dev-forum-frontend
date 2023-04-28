import { useCallback, useContext, useEffect, useState } from "react";

import { Breadcrumbs, Button, Pagination } from "@tiller-ds/core";
import { TextareaField } from "@tiller-ds/formik-elements";
import { Icon } from "@tiller-ds/icons";

import { Formik } from "formik";
import { Link } from "react-router-dom";
import * as yup from "yup";

import { AuthContext } from "../../common/components/AuthProvider";
import {
  INPUT_REQUIRED_MESSAGE,
  INPUT_TOO_LONG_MESSAGE,
  INPUT_TOO_SHORT_MESSAGE,
} from "../../common/constants";
import { ConversationResponse } from "../api/ConversationResponse";
import { MessageResponse } from "../api/MessageResponse";
import { postCreateMessageRequest } from "../api/postCreateMessageRequest";
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
  const [initialMessageFetch, setInitialMessageFetch] =
    useState<boolean>(false);

  const authContext = useContext(AuthContext);

  const fetchMessages = useCallback(
    (conversationId: number, requestPage: number) => {
      postSearchMessagePageableRequest({
        pageSize: 5,
        pageNumber: requestPage,
        conversationId: conversationId,
      }).then((response) => {
        setMessages(response.data.content);
        setTotalMessages(response.data.totalElements);
        if (!initialMessageFetch) {
          setMessagePage(response.data.totalPages - 1);
          setInitialMessageFetch(true);
        }
      });
    },
    [initialMessageFetch]
  );

  function isCurrentUserOwnerOfMessage(message: MessageResponse) {
    return authContext.loggedInUser?.id === message.author.id;
  }

  function formSubmitHandler(form: Form) {
    if (selectedConversation) {
      postCreateMessageRequest({
        content: form.content,
        conversationId: selectedConversation.id,
      }).then((response) => {
        setMessages((prevState) => [...prevState, response.data]);
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
      pageSize: 10,
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
  }, [selectedConversation, messagePage, fetchMessages]);

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
          <div className="flex flex-row">
            <div className="w-1/3 flex flex-col">
              {conversations.map((conversation) => (
                <ConversationCard
                  user={
                    conversation.participants.filter(
                      (participant) =>
                        participant.id !== authContext.loggedInUser?.id
                    )[0]
                  }
                  latestPostDate={conversation.latestMessageDateTime}
                  unreadMessages={conversation.unreadMessages}
                  clickCallback={() => setSelectedConversation(conversation)}
                />
              ))}
              <div className="flex flex-row justify-center">
                <div>
                  <Pagination
                    className="mx-auto"
                    pageNumber={page}
                    pageSize={10}
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

            <div className="border-r mr-3 ml-3" />
            <div className="flex flex-col gap-y-3 flex-grow">
              <div className="flex flex-col gap-y-3">
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
                    />
                  </div>
                ))}
              </div>

              {selectedConversation && (
                <div>
                  <Pagination
                    pageNumber={messagePage}
                    pageSize={5}
                    totalElements={totalMessages}
                    onPageChange={setMessagePage}
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
                  <Formik
                    initialValues={initialFormValues}
                    onSubmit={formSubmitHandler}
                    validationSchema={formValidationSchema}
                  >
                    {(formik) => (
                      <form onSubmit={formik.handleSubmit}>
                        <div className="flex flex-col gap-y-3">
                          <TextareaField name="content" className="flex-grow" />
                          <div className="flex flex-row justify-end">
                            <Button
                              variant="filled"
                              color="primary"
                              type="submit"
                              className="w-1/12 max-h-10 h-10"
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
