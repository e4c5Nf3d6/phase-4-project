import React, { useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { useHistory } from "react-router-dom";

import useDocumentTitle from "../hooks/useDocumentTitle";

function SignUp({ onLogin }) {
    const history = useHistory();
    const [showError, setShowError] = useState(false);

    useDocumentTitle('Sign Up');

    const formSchema = yup.object().shape({
        username: yup.string()
            .required("Please enter a username"),
        password: yup.string()
            .required("Please enter a password"),
        password_confirmation: yup.string().required('Please retype your password')
            .oneOf([yup.ref('password')], 'Your passwords do not match.')
    });

    const formik = useFormik({
        initialValues: {
            username: "",
            password: "",
            password_confirmation: ""
        },
        validationSchema: formSchema,
        onSubmit: (values) => {
            fetch("/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values, null, 2)
            }).then((r) => {
                if (r.status === 201) {
                    r.json()
                    .then((user) => {
                        onLogin(user);
                        history.push('/');
                    });
                } else if (r.status === 422) {
                    setShowError(true);
                }
            });
        }
    });

    return (
        <div>
            <h1>Sign Up</h1>
            <form onSubmit={formik.handleSubmit}>
                {showError ? <p style={{ color: "red" }}> Username already taken</p> : null}
                <label htmlFor="username">Username</label>
                <input 
                    type="text"
                    id="username"
                    name="username"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.username && formik.errors.username ? <p style={{ color: "red" }}>{formik.errors.username}</p> : null}
                <label htmlFor="password">Password</label>
                <input 
                    type="password"
                    id="password"
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? <p style={{ color: "red" }}>{formik.errors.password}</p> : null}
                <label htmlFor="password_confirmation">Password Confirmation</label>
                <input 
                    type="password"
                    id="password_confirmation"
                    name="password_confirmation"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                />
                {formik.touched.password_confirmation && formik.errors.password_confirmation ? <p style={{ color: "red" }}>{formik.errors.password_confirmation}</p> : null}
                <button type="submit">Sign Up</button>
            </form>    
        </div>
    );
}

export default SignUp;