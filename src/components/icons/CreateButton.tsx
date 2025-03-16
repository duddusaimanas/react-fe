interface Options {
  onClick: () => void;
}
function CreateButton({ onClick }: Options) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      onClick={onClick}
      className="size-4"
    >
      <title>Create</title>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m11.99 16.5 3.75 3.75m0 0 3.75-3.75m-3.75 3.75V3.75H4.49"
      />
    </svg>
  );
}

export default CreateButton;
