import { useState } from "react";

import { useMutation } from "@apollo/client/react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { useMe } from "@providers/MeProvider";
import { MUTATE_NICKNAME } from "@queries";
import type { DiscordMessage, MessageGQLType } from "@types";
import clsx from "clsx";
import { Field, Form, Formik } from "formik";
import { toast } from "react-toastify";
import * as Yup from "yup";

interface MessageRowProps {
  message: MessageGQLType;
}

const parseMessage = (rawMessage?: string): DiscordMessage | null => {
  if (!rawMessage) return null;
  return JSON.parse(rawMessage);
};

const parseDate = (datestring?: string): string | null => {
  if (!datestring) return null;
  const parsed = new Date(datestring);
  return parsed?.toLocaleString();
};

/**
 * Discord markup delimiters, longest first so that `**` wins over `*`. The
 * backreference requires a matching closing delimiter.
 */
const MARKUP_PATTERN = /(\*\*|__|~~|`|\*|_)(.+?)\1/g;

const MARKUP_CLASSES: Record<string, string> = {
  "**": "font-semibold",
  __: "font-semibold",
  "~~": "line-through",
  "`": "font-mono bg-slate-800 p-1 text-sm rounded-md",
  "*": "italic",
  _: "italic",
};

/**
 * Render Discord markup as React nodes. Message content is untrusted, so it is
 * never assembled into an HTML string -- each delimited run becomes a real
 * element and everything else stays a text node.
 */
const renderMarkup = (content: string): React.ReactNode[] => {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of content.matchAll(MARKUP_PATTERN)) {
    const [full, delimiter, inner] = match;
    if (match.index > lastIndex) {
      nodes.push(content.slice(lastIndex, match.index));
    }
    nodes.push(
      <span
        key={`${match.index}-${delimiter}`}
        className={MARKUP_CLASSES[delimiter]}
      >
        {inner}
      </span>,
    );
    lastIndex = match.index + full.length;
  }

  if (lastIndex < content.length) {
    nodes.push(content.slice(lastIndex));
  }

  return nodes;
};

const parseMessageContent = (
  rawMessageContent?: DiscordMessage | null,
): React.ReactNode => {
  const content = rawMessageContent?.content;
  if (!content) return "";

  // Remove newline from start of message
  return (
    <div className="whitespace-pre-line">
      {renderMarkup(content.replace(/^\n/, ""))}
    </div>
  );
};

export default function MessageRow(props: MessageRowProps): React.JSX.Element {
  const { message } = props;
  const { me } = useMe();
  const [editingNickname, setEditingNickname] = useState<boolean>(false);
  const [mutateNickname] = useMutation(MUTATE_NICKNAME, {
    variables: {
      id: message?.nickname?.id,
    },
    onCompleted: () => {
      toast.success("Nickname updated");
    },
    onError: () => {
      toast.error("Unable to save Nickname");
    },
  });

  return (
    <div className="flex w-full space-x-3 border-b border-b-gray-900 py-5">
      <div className="shrink-0">
        <img
          className="h-10 w-10 rounded-full"
          alt=""
          src={
            message?.nickname?.avatar
              ? `https://cdn.discordapp.com/avatars/${message?.nickname?.avatar}.webp?size=60`
              : "/static/images/profileDefault.png"
          }
        />
      </div>
      <div>
        {/* Nickname / Date Row */}
        <div className="flex items-center space-x-2 pb-1">
          {me?.isStaff && editingNickname ? (
            <Formik
              initialValues={{ name: message?.nickname?.name }}
              validationSchema={Yup.object().shape({
                name: Yup.string().required("Required"),
              })}
              onSubmit={(values) => {
                mutateNickname({ variables: { name: values?.name } }).then(() =>
                  setEditingNickname(false),
                );
              }}
            >
              {({ errors }) => (
                <Form>
                  <Field
                    name="name"
                    required
                    className={clsx(
                      "rounded-l-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                      errors?.name && "ring-1 ring-lcarsPink-100",
                    )}
                  />
                  <button
                    type="button"
                    className={clsx(
                      "border border-gray-600 bg-gray-700 p-2 hover:bg-lcarsBlue-100 hover:text-gray-800",
                      errors?.name && "ring-1 ring-lcarsPink-100",
                    )}
                    onClick={() => setEditingNickname(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={clsx(
                      "rounded-r-md border border-lcarsBlue-600 bg-lcarsAqua p-2 hover:bg-lcarsPurple-200 hover:text-gray-800",
                      errors?.name && "ring-1 ring-lcarsPink-100",
                    )}
                  >
                    Save
                  </button>
                </Form>
              )}
            </Formik>
          ) : (
            <span
              style={{ color: `#${message?.nickname?.color || "FFFFFF"}` }}
              className="text-semibold"
            >
              {message?.nickname?.name || "Deleted User"}
            </span>
          )}
          {me?.isStaff && message?.nickname && (
            <button
              type="button"
              className="cursor-pointer text-lcarsPurple-300 hover:text-lcarsBlue-200"
              title="Edit Nickname"
              onClick={() => setEditingNickname(!editingNickname)}
            >
              <PencilIcon className="size-4" />
            </button>
          )}
          <span className="text-sm text-gray-400">
            {parseDate(message?.timestamp)}
          </span>
        </div>

        {/* Message Content Row */}
        {parseMessageContent(parseMessage(message?.rawMessage))}
      </div>
    </div>
  );
}
