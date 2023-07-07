import ColorCircle from "./ColorCircle";

const UserList = (props) => {
  const { data: userList } = props;

  return (
    <>
      <h4 className="text-sm mb-5 font-semibold">Connected users:</h4>
      <ul className="space-y-4 overflow-y-auto max-h-[60vh]">
        {Object.keys(userList).map((username) => (
          //   <li key={username} className="px-2 py-1 rounded bg-white text-black">
          //     {username} - ({userList[username].color})
          //   </li>
          <li key={username} className="flex items-center">
            <ColorCircle color={userList[username].color} />
            <span>
              {username} ({userList[username].color})
            </span>
          </li>
        ))}
      </ul>
    </>
  );
};

export default UserList;
