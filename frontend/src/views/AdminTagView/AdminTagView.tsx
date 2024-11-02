import { useRef } from "react";

import { useMutation, useQuery } from "@apollo/client";
import { Breadcrumbs } from "@components";
import constants from "@constants";
import { TagIcon, XMarkIcon } from "@heroicons/react/20/solid";
import { GET_TAG, MUTATE_TAG } from "@queries";
import type { RelaySingle, TagGQLType } from "@types";
import { getTagInfoForType } from "@utils/tags";
import clsx from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function AdminTagView(): React.JSX.Element {
  const { tagId } = useParams();
  const navigate = useNavigate();
  const uploadField = useRef<HTMLInputElement | null>(null);
  const { data, loading } = useQuery<RelaySingle<TagGQLType>>(GET_TAG, {
    skip: !tagId,
    variables: {
      id: tagId,
    },
  });
  const [mutateTag] = useMutation(MUTATE_TAG, {
    onCompleted: (data) => {
      if (data?.tag?.tag?.id != tagId) {
        navigate(`${constants.ROUTES.ADMIN_TAG}/${data?.tag?.tag?.id}`);
      }
      toast.success("Tag saved!");
    },
    onError: () => toast.error("Unable to save tag"),
  });

  return (
    <>
      {loading ? (
        <Breadcrumbs loading />
      ) : (
        <Breadcrumbs
          breadcrumbs={[
            { name: "Tags", link: constants.ROUTES.ADMIN_TAGS, icon: TagIcon },
            ...(tagId
              ? [{ name: data?.tag?.name || "", link: location.pathname }]
              : [{ name: "New Tag", link: constants.ROUTES.ADMIN_TAG }]),
          ]}
        />
      )}

      {!loading && (
        <Formik
          initialValues={{
            tagType: data?.tag?.tagType || "EVENTS",
            name: data?.tag?.name || "",
            slug: data?.tag?.slug || "",
            banner: null,
            description: data?.tag?.description || "",
            startDate: data?.tag?.startDate || "",
            endDate: data?.tag?.endDate || "",
          }}
          onSubmit={(values, { setFieldValue, setFieldTouched }) => {
            mutateTag({
              variables: {
                id: tagId,
                tagType: values?.tagType,
                name: values?.name,
                slug: values?.slug,
                banner: values?.banner,
                description: values?.description,
                startDate: values?.startDate || null,
                endDate: values?.endDate || null,
              },
            });
            if (uploadField.current) {
              uploadField.current.value = "";
            }
            setFieldValue("banner", null);
            setFieldTouched("banner", false);
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Required").max(128, "Too long"),
            slug: Yup.string()
              .required("Required")
              .max(64, "Too long")
              .matches(/^[-a-zA-Z0-9_]+$/, "Must be a valid slug"),
            banner: Yup.mixed()
              .test(
                "file-type",
                "File is not a supported image type",
                (value) => {
                  return (
                    !value ||
                    ["image/jpeg", "image/png", "image/webp"].includes(
                      (value as File).type,
                    )
                  );
                },
              )
              .nullable(),
            description: Yup.string(),
            startDate: Yup.date().typeError(
              "The value must be a date (YYYY-MM-DD)",
            ),
            endDate: Yup.date().typeError(
              "The value must be a date (YYYY-MM-DD)",
            ),
          })}
        >
          {({ errors, setFieldValue }) => (
            <Form className="grid grid-cols-1 space-y-4 md:w-3/4 lg:w-1/2 lg:grid-cols-2">
              <label htmlFor="tagType" className="w-36 font-semibold">
                Tag Type*:
              </label>
              <div>
                <Field
                  as="select"
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.tagType && "ring-1 ring-lcarsPink-100",
                  )}
                  name="tagType"
                  required
                >
                  {Object.keys(constants.TAG_INFO).map(
                    (key) =>
                      key && (
                        <option value={key}>
                          {getTagInfoForType(key)?.name}
                        </option>
                      ),
                  )}
                </Field>
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="tagType" />
                </div>
              </div>

              <label htmlFor="name" className="w-36 font-semibold">
                Tag Name*:
              </label>
              <div>
                <Field
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.name && "ring-1 ring-lcarsPink-100",
                  )}
                  name="name"
                  required
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="name" />
                </div>
              </div>

              <label htmlFor="name" className="w-36 font-semibold">
                Tag Slug*:
              </label>
              <div>
                <Field
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.slug && "ring-1 ring-lcarsPink-100",
                  )}
                  name="slug"
                  required
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="slug" />
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  The slug will be used with the discord bot when archiving a
                  channel. It should have no spaces or special characters, and
                  must be unique. Using a slug that has already been used will
                  result in an error
                </div>
              </div>

              <label htmlFor="banner" className="w-36 font-semibold">
                Banner:
              </label>
              <div>
                {data?.tag?.banner && (
                  <div className="relative pb-2 pr-2">
                    <button
                      type="button"
                      className="absolute -right-1 -top-1 rounded-full bg-black text-center text-white ring-1 ring-white hover:bg-lcarsOrange-400"
                      onClick={() => {
                        mutateTag({
                          variables: {
                            id: tagId,
                            tagType: data?.tag?.tagType,
                            name: data?.tag?.name,
                            slug: data?.tag?.slug,
                            clearBanner: true,
                          },
                        });
                      }}
                    >
                      <XMarkIcon className="size-6" />
                    </button>
                    <img
                      className="rounded-md"
                      src={`${constants.MEDIA_URL}/${data?.tag?.banner}`}
                    />
                  </div>
                )}
                <input
                  type="file"
                  onChange={(event) =>
                    setFieldValue("banner", event.currentTarget.files?.item(0))
                  }
                  ref={uploadField}
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.banner && "ring-1 ring-lcarsPink-100",
                  )}
                  name="banner"
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="banner" />
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  The banner should be a JPG, PNG, or WEBP file with minimum
                  dimensions of 366px by 72px.
                </div>
              </div>
              <label htmlFor="name" className="w-36 font-semibold">
                Description:
              </label>
              <div>
                <Field
                  as="textarea"
                  className={clsx(
                    "h-32 w-72 rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.description && "ring-1 ring-lcarsPink-100",
                  )}
                  name="description"
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="description" />
                </div>
              </div>

              <label htmlFor="startDate" className="w-36 font-semibold">
                Start Date:
              </label>
              <div>
                <Field
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.name && "ring-1 ring-lcarsPink-100",
                  )}
                  name="startDate"
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="startDate" />
                </div>
                <div className="mt-2 text-sm text-gray-300">
                  Expects the format YYYY-MM-DD
                </div>
              </div>

              <label htmlFor="endDate" className="w-36 font-semibold">
                End Date:
              </label>
              <div>
                <Field
                  className={clsx(
                    "rounded-md border border-gray-600 bg-gray-700 p-2 text-gray-300",
                    errors?.name && "ring-1 ring-lcarsPink-100",
                  )}
                  name="endDate"
                />
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="endDate" />
                </div>{" "}
                <div className="mt-2 text-sm text-gray-300">
                  Expects the format YYYY-MM-DD
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="rounded-md bg-lcarsPurple-100 px-4 py-2 text-gray-800 hover:bg-lcarsBlue-500 hover:text-white"
                >
                  Save
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}
