const userAvatar = ({photo, name}) => {
  return (
    <img
      src={photo}
      alt={name}
      className="size-[25px] md:size-[45px] rounded-full"
    />
  );
};

export default userAvatar;
