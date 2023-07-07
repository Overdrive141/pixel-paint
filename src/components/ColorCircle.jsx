const ColorCircle = (props) => {
  const { color } = props;

  return (
    <span
      className="w-4 h-4 mr-2 rounded-full"
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorCircle;
