import { gql, useMutation, useQuery } from "@apollo/client";
import { ErrorMessage, Field, Form, Formik, useFormik, type FormikHelpers } from "formik";
import * as yup from 'yup';

const USERS_QUERY = gql`
    {
        users {
            id
            userName
        }
    }
`;

const ADD_QUERY = gql`
    mutation createBlog($title: String!, $description: String!, $user: ID!){
        blogCreate(input: {title: $title, description: $description, userId: $user}){
            message
        }
    }
`;

const validationSchema = yup.object({
    title: yup.string()
      .required('Title is required'),
    description: yup
      .string()
      .required('Description is required'),
    user: yup
      .string()
      .required("Please select a User.")
  });

interface Values {
    title: string,
    description: string,
    user: string
}

export default function AddBlog() {
    const { data, loading, error } = useQuery(USERS_QUERY, {context: {clientName: 'railsendpoint'}});
    const [ addBlog ] = useMutation(ADD_QUERY);
    if (loading) return "Loading...";
    if (error) return <pre>{error.message}</pre>

    const initialValues: Values = {
        title: "",
        description: "",
        user: ""
    }

    const handleSubmit = async (
        values: Values,
        { setSubmitting }: FormikHelpers<Values>
    ) => {
        const res = await addBlog({ variables: values });
        alert(res["data"]["blogCreate"]["message"])
        values.title = ''
        values.description = ''
        values.user = ''
        setSubmitting(false);
    };
      
    return (
    <div className="p-2">
        <h1>Add Blogs</h1>
        <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
        >
        {({isSubmitting}) => (
            <div className="px-5">
                <Form className="form-control">
                    <div className="input-group mb-2">
                        <label
                        htmlFor="title"
                        className="input-group-text"
                        id="inputGroup-sizing-default"
                        >
                        Title
                        </label>
                        <Field
                        id="title"
                        name="title"
                        placeholder="Blog Title"
                        type="text"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </div>
                    <ErrorMessage name="title" />

                    <div className="input-group mb-2">
                        <label
                        htmlFor="description"
                        className="input-group-text"
                        id="inputGroup-sizing-default"
                        >
                        Description
                        </label>
                        <Field
                        id="description"
                        name="description"
                        placeholder="Blog Description"
                        as="textarea"
                        className="form-control"
                        aria-label="Sizing example input"
                        aria-describedby="inputGroup-sizing-default"
                        />
                    </div>
                    <ErrorMessage name="description" />

                    <div className="input-group mb-2">
                        <label
                        htmlFor="user"
                        className="input-group-text"
                        id="inputGroup-sizing-default"
                        >
                        Post by
                        </label>
                        <Field as="select" id="user" name="user" className="form-select">
                            <option selected>Choose...</option>
                                {
                                    data.users.map((user: any)=>(
                                        <option value={user.id}>{user.userName}</option>
                                    ))
                                }
                        </Field>
                    </div>
                    <ErrorMessage name="user" />

                    <div className="input-group mb-2">
                        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                        Submit
                        </button>
                    </div>
                </Form>
            </div>
        )}
        </Formik>
    </div>
    );
}
