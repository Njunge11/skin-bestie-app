// Pink curtain (no content). Must fill the scene height provided by wrapper.
export default function OurStory() {
  return (
    <section
      className="h-full w-full inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/background.svg')",
      }}
    />
  );
}
