import ColorCircle from "./ColorCircle";

const UserInfo = (props) => {
  const { username, color } = props;

  return (
    <div className="flex items-center gap-2">
      <p>{`You are ${username} and your color is ${color} - `}</p>
      <ColorCircle color={color} />
    </div>
  );
};

export default UserInfo;
