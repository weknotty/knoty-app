import { useDispatch } from "react-redux";

const CustomDispatch = () => {
  const dispatch = useDispatch();

  return [dispatch];
};

export default CustomDispatch