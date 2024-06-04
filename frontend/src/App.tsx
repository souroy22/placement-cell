import { useEffect } from "react";
import RouterComponent from "./routers";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./store/store";
import Loader from "./components/Loader";
import { Toaster } from "react-hot-toast";
import { getUser } from "./api/user.api";
import { setUser } from "./store/user/userReducer";
import "./App.css";
import { setLoading } from "./store/global/globalReducer";
import Navbar from "./components/navbar";

const App = () => {
  const { loading } = useSelector((state: RootState) => state.globalReducer);

  const dispatch = useDispatch();

  const onLoad = async () => {
    dispatch(setLoading(true));
    try {
      const user = await getUser();
      dispatch(setUser(user));
    } catch (error) {
      dispatch(setUser(null));
    }
    dispatch(setLoading(false));
  };

  useEffect(() => {
    onLoad();
  }, []);

  return (
    <>
      <Navbar />
      <RouterComponent />
      {loading && <Loader open={loading} />}
      <Toaster />
    </>
  );
};

export default App;
