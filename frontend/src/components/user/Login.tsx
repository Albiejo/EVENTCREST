
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
  Input,
    Button,
} from "@material-tailwind/react";
import { useEffect} from 'react';
import {Link,useNavigate} from 'react-router-dom'
import {axiosInstance} from '../../api/axiosinstance';
import {  useSelector,useDispatch } from 'react-redux';
import { setUserInfo } from "../../redux/slices/UserSlice";
import UserRootState from '../../redux/rootstate/UserState';
import { validate } from "../../validations/loginVal";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import {GoogleLogin , GoogleOAuthProvider} from '@react-oauth/google';

const clientId = import.meta.env.VITE_CLIENT_ID || '';

interface FormValues {
  email: string;
  password: string;
}

const initialValues: FormValues = {
  email: '',
  password: '',
};

const UserLoginForm=()=> {

  
  
  const user = useSelector((state: UserRootState) => state.user.userdata);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []); 

  const formik = useFormik({
    initialValues,
    validate,
    onSubmit: (values) => {
      axiosInstance
        .post("/login", values)
        .then((response) => {
          console.log(response);
          dispatch(setUserInfo(response.data.userData));
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.response.data.message)
          console.log("here", error);
        });
    },
  });


  return (
    <GoogleOAuthProvider clientId={clientId}>
    <Card className="w-96 mt-50 bg-dark m-auto bg-dark mx-auto max-w-md bg-white rounded-lg shadow-lg"  placeholder={undefined} shadow={false}>

      <CardHeader
        floated={false}
        shadow={false}
        color="transparent"
        className="mt-10 rounded-none text-center"  placeholder={undefined}      >
            <Typography variant="h4" color="black"  placeholder={undefined}>
              User - Sign In
            </Typography>
      </CardHeader>


      <form onSubmit={formik.handleSubmit}>
        <CardBody className="flex flex-col gap-4" placeholder={undefined}>
          <Input
            label="Email"
            size="md"
            crossOrigin={undefined}
            color="red"
            className="bg-white bg-opacity-50"
            onChange={formik.handleChange}
            value={formik.values.email}
            name="email"
          />
          {formik.errors.email ? <p className="text-sm" style={{color:"red",marginBottom:-10,marginTop:-10}}>{formik.errors.email}</p> : null}
          <Input
            label="Password"
            size="md"
            crossOrigin={undefined}
            color="pink"
            className="bg-white bg-opacity-50"
            onChange={formik.handleChange}
            value={formik.values.password}
            name="password"
            type="password"
          />
          {formik.errors.password ? <p className="text-sm" style={{color:"red",padding:0,marginTop:-10}}>{formik.errors.password}</p> : null}
          <div className="ml-2.5">
            <Link to="/forgot-password">
              <Typography
                variant="small"
                color="black"
                placeholder={undefined}
                className="text-left"
              >
                Forgot password?
              </Typography>
            </Link>
          </div>
          <Button
            variant="gradient"
            fullWidth
            placeholder={undefined}
            type="submit"
          >
            Sign In
          </Button>
        </CardBody>
      </form>

      <div id="signInButton" className="pl-20">
        <GoogleLogin
        type='standard'
        theme='filled_black'
        size='large'
        onSuccess={response => {
          axiosInstance.post('/google/login' , response).then((res) => {
            if(res.data) {
              dispatch(setUserInfo(res.data.userData));
              toast.success(res.data.message);
              navigate('/');
            }
          })
          .catch((error) => {
            console.log(error)
            toast.error(error.response.data.error)
          })
        }}
        />
    </div>


      <CardFooter className="pt-0" placeholder={undefined}>
        <Typography
          variant="small"
          color="black"
          className="mt-6 flex justify-center "
          placeholder={undefined}
        >
          Don&apos;t have an account?
          <Link to="/signup">
            <Typography
              as="a"
              href="#signup"
              variant="small"
              color="black"
              className="ml-1 font-bold"
              placeholder={undefined}
            >
              Sign up
            </Typography>
          </Link>
        </Typography>
        <Typography
          variant="small"
          color="black"
          className="mt-3 flex justify-center"
          placeholder={undefined}
        >
          Are you a vendor?
          <Link to="/vendor/login">
            <Typography
              as="a"
              href="#signup"
              variant="small"
              color="black"
              className="ml-1 font-bold"
              placeholder={undefined}
            >
              Login here
            </Typography>
          </Link>
        </Typography>
      </CardFooter>
    </Card>
    </GoogleOAuthProvider>
  );
}


export default UserLoginForm;