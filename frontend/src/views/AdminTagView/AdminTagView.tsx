import { useMutation, useQuery } from "@apollo/client";
import { Breadcrumbs } from "@components";
import constants from "@constants";
import { TagIcon } from "@heroicons/react/20/solid";
import { GET_TAG, MUTATE_TAG } from "@queries";
import type { RelaySingle, TagGQLType } from "@types";
import clsx from "clsx";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";

export default function AdminTagView(): React.JSX.Element {
  const { tagId } = useParams();
  const navigate = useNavigate();
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
            tagType: data?.tag?.tagType || "EVENT",
            name: data?.tag?.name || "",
            slug: data?.tag?.slug || "",
            description: data?.tag?.description || "",
          }}
          onSubmit={(values) => {
            mutateTag({
              variables: {
                id: tagId,
                tagType: values?.tagType,
                name: values?.name,
                slug: values?.slug,
                description: values?.description,
              },
            });
          }}
          validationSchema={Yup.object().shape({
            name: Yup.string().required("Required").max(128, "Too long"),
            slug: Yup.string()
              .required("Required")
              .max(64, "Too long")
              .matches(/^[-a-zA-Z0-9_]+$/, "Must be a valid slug"),
            description: Yup.string(),
          })}
        >
          {({ errors }) => (
            <Form className="grid grid-cols-1 space-y-4 md:w-3/4 lg:w-1/2 lg:grid-cols-2">
              <label htmlFor="tagType" className="w-36 font-semibold">
                Tag Type:
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
                  <option value="EVENT" selected>
                    Event
                  </option>
                  <option value="QUARTERS">Crew Quarters</option>
                  <option value="OTHER">Other</option>
                </Field>
                <div className="mt-2 text-lcarsPink-100">
                  <ErrorMessage name="tagType" />
                </div>
              </div>

              <label htmlFor="name" className="w-36 font-semibold">
                Tag Name:
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
                Tag Slug:
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
                  channel. It should have no spaces in it.
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
