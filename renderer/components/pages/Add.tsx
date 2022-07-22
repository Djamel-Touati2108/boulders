export default function Add({ next }: { next: () => void }) {
  return (
    <div className="w-screen h-screen flex flex-col justify-between items-center p-8 pb-16">
      <div className="w-full flex flex-col items-start space-y-1">
        <h1 className="text-[1.35rem] font-bold text-white">
          add boulders to queue 🗿{" "}
        </h1>
        <p className="text-gray-400 text-[0.85rem]">
          click anywhere to add a new boulder.
        </p>
      </div>
      <button onClick={next} className="btn-text">
        <p>done</p>
      </button>
    </div>
  );
}
