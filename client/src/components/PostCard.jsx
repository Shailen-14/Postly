const PostCard = (props) => {
  return (
    <div onClick={props.onClick} className="px-3 py-1.5 border border-black/20 shadow-lg rounded-md cursor-pointer w-full wrap-break-word">
      <h2 className="border-b border-b-black/20 text-center mb-2 font-medium">{props.title}</h2>
      <h2 className="border-b-black/20">{props.body}</h2>
      <div>
        <span className="border-t border-t-slate-400/40 text-[12px] text-slate-400">@{props.username}</span>
      </div>
    </div>
  );
};

export default PostCard;
